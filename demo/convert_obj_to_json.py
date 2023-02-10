# Description: Converts an obj file to a json file
# author: @sanjid
import json
import numpy as np

file_name = 'MuscleCar.obj'
vertices = []
faces = []
uvs = []
uv_indices = []

with open(file_name) as f:
	for line in f:
		if line.startswith('v '):
			vertices.append([float(x) for x in line.split()[1:]])
		elif line.startswith('vt '):
			uvs.append([float(x) for x in line.split()[1:]])
		elif line.startswith('f '):
			faces.append([int(x.split('/')[0]) - 1 for x in line.split()[1:]])
			uvs.append([int(x.split('/')[1]) - 1 for x in line.split()[1:]])

vertices = [item for sublist in vertices for item in sublist]
faces = [item for sublist in faces for item in sublist]
uvs = [item for sublist in uvs for item in sublist]

uv = np.zeros(int(len(vertices) / 3 * 2))

with open(file_name) as f:
	# get index in loop
	for index, line in enumerate(f):
		if line.startswith('f '):
			line = line.split()[1:]
			for i in line:
				vertex_index = int(i.split('/')[0]) - 1
				uv_index = int(i.split('/')[1]) - 1
				uv[vertex_index] = uvs[uv_index]


data = {
	'vertices': vertices,
	'faces': faces,
	'uvs': uvs,
}

with open(file_name + '.json', 'w') as f:
	json.dump(data, f)


