from __future__ import annotations

import argparse
import json
from pathlib import Path

import roma
import torch
import trimesh


def create_model(model_type: str, rig: str, dtype: torch.dtype):
    try:
        import anny
    except ImportError as exc:
        raise SystemExit(
            "Missing dependency: anny. Run `pip install -r requirements.txt` from Backend first."
        ) from exc

    if model_type == "default":
        model = anny.create_fullbody_model(
            rig=rig,
            topology="default",
            local_changes=True,
            extrapolate_phenotypes=False,
        )
    elif model_type == "head":
        model = anny.create_head_model(
            eyes=True,
            tongue=True,
            local_changes=True,
            extrapolate_phenotypes=False,
        )
    elif model_type == "left-hand":
        model = anny.create_hand_model(side="L", extrapolate_phenotypes=False)
    elif model_type == "right-hand":
        model = anny.create_hand_model(side="R", extrapolate_phenotypes=False)
    else:
        raise ValueError(f"Unsupported model type: {model_type}")

    return model.to(dtype=dtype)


def export_model(output_path: Path, model_type: str, rig: str) -> dict:
    dtype = torch.float32
    model = create_model(model_type=model_type, rig=rig, dtype=dtype)

    bones_rotvec = torch.zeros((len(model.bone_labels), 3), dtype=dtype)
    bones_rotmat = roma.rotvec_to_rotmat(torch.deg2rad(bones_rotvec))
    pose_parameters = roma.Rigid(
        bones_rotmat,
        torch.zeros((len(bones_rotmat), 3), dtype=dtype),
    )[None].to_homogeneous()

    phenotype_kwargs = {key: 0.5 for key in model.phenotype_labels}
    local_changes_kwargs = {key: 0.0 for key in model.local_change_labels}

    output = model(
        pose_parameters=pose_parameters,
        phenotype_kwargs=phenotype_kwargs,
        local_changes_kwargs=local_changes_kwargs,
    )

    vertices = output["vertices"].squeeze(dim=0).detach().cpu().numpy()
    faces = model.faces.detach().cpu().numpy()

    mesh = trimesh.Trimesh(vertices=vertices, faces=faces, process=False)
    mesh.visual = trimesh.visual.TextureVisuals(
        material=trimesh.visual.material.PBRMaterial(
            baseColorFactor=[0.4, 0.8, 0.8, 1.0],
            metallicFactor=0.1,
            roughnessFactor=0.8,
            doubleSided=True,
            alphaMode="OPAQUE",
        )
    )

    scene = trimesh.Scene()
    scene.add_geometry(mesh, node_name="body")

    view_transform = roma.Rigid(
        roma.euler_to_rotmat("x", [-90.0], degrees=True),
        torch.zeros(3),
    ).to_homogeneous().numpy()
    scene.apply_transform(view_transform)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    scene.export(output_path)

    metadata = {
        "model_type": model_type,
        "rig": rig,
        "topology": "default",
        "vertices": int(len(vertices)),
        "faces": int(len(faces)),
        "bones": int(len(model.bone_labels)),
        "output": str(output_path),
    }

    metadata_path = output_path.with_suffix(".json")
    metadata_path.write_text(json.dumps(metadata, indent=2), encoding="utf-8")

    return metadata


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Export an Anny body model as GLB.")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("generated_models/anny_default_body.glb"),
        help="Output .glb path.",
    )
    parser.add_argument(
        "--model-type",
        choices=["default", "head", "left-hand", "right-hand"],
        default="default",
        help="Model variant to export.",
    )
    parser.add_argument(
        "--rig",
        default="default",
        help="Anny rig name. Use default unless you know you need another rig.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    metadata = export_model(
        output_path=args.output,
        model_type=args.model_type,
        rig=args.rig,
    )
    print(json.dumps(metadata, indent=2))


if __name__ == "__main__":
    main()
