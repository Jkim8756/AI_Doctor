# AI Doctor Backend

Backend workspace for generating and serving 3D body model assets.

## Mesh Export Pipeline

The first backend task is to generate a static `.glb` human body model that the frontend can load with Three.js or React Three Fiber.

This uses Anny's default topology, not the optional `smplx` topology.

## Setup

```powershell
cd Backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Export Default Body Model

```powershell
python .\scripts\export_anny_body.py --output .\generated_models\anny_default_body.glb
```

The generated file should later be copied or served to the frontend as a static asset.
