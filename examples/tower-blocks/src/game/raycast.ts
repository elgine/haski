// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Vector3d from '@maths/vector3d';

const edge1 = [0, 0, 0]; const edge2 = [0, 0, 0]; const n = [0, 0, 0]; const
    v = [0, 0, 0];

export default (object: IObject3d, viewPoint: Vec3d) => {
    return object.faces.map((vertices, i) => {
        Vector3d.normalize(viewPoint, v);
        Vector3d.sub(vertices[1], vertices[0], edge1);
        Vector3d.sub(vertices[2], vertices[1], edge2);
        Vector3d.normalize(Vector3d.cross(edge1, edge2, n));
        return {
            index: i,
            distance: Vector3d.dot(v, n)
        };
    }).sort((a, b) => {
        return a.distance - b.distance;
    });
};