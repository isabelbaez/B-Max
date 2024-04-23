import os
import re

### Global Constants ###
# yes = {"yes", "yeah", "y", "yea"}

# def _remesh(mesh):
#     """
#     Resmeshes a mesh to force all faces to become polygons 

#     Inputs
#         :mesh: <pymeshlab.Mesh> mesh to be remeshed

#     Throws
#         <ValueError> if the number of verticies > number of vertex normals
#     """
#     ms = pymeshlab.MeshSet()
#     ms.add_mesh(mesh)
#     ms.meshing_isotropic_explicit_remeshing(iterations=3)

#     return ms.current_mesh()