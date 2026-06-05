from IPython.display import Markdown, display
import torch
import roma # A PyTorch library useful to deal with space transformations.
import anny # The main library for the Anny model.
import trimesh # For 3D mesh visualization.

# Instantiate the model, with all shape parameters available.
# Remark: the first instantiation may take a while. Latter calls will be faster thanks to caching.
anny_model = anny.create_fullbody_model(all_phenotypes=True, local_changes=True, remove_unattached_vertices=True)
# Use 32bit floating point precision on the CPU for this demo.
dtype = torch.float32
device = torch.device('cpu')
anny_model = anny_model.to(device=device, dtype=dtype)

# A simple transform to get a better view angle in 3D mesh visualizations.
trimesh_scene_transform = roma.Rigid(linear=roma.euler_to_rotmat('x', [-90.], degrees=True), translation=None).to_homogeneous().cpu().numpy()


display(Markdown(f"{anny_model.template_vertices.shape[0]} vertices -- {anny_model.faces.shape[0]} faces composed of {anny_model.faces.shape[1]} vertices each."))
trimesh.Trimesh(vertices=anny_model.template_vertices.cpu().numpy(), faces=anny_model.faces.cpu().numpy()).apply_transform(trimesh_scene_transform).show()