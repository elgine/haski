// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Transform3d from '@maths/transform3d';
import Size3d from '@haski/core/size3d';
import Vector3d from '@maths/vector3d';
import Color from '@maths/color';
import Graphics from '@haski/graphics/graphics';
import toXYPlane from './toXYPlane';
import raycast from './raycast';

export default class IsoCube extends Graphics {

    private static _tempColor: RGBA = [0, 0, 0, 0];
    public readonly size: Size3d = new Size3d();
    public readonly transform: Transform3d = new Transform3d();

    private _center: Vec3d = [0, 0, 0];

    private _backgroundColor: RGBA = [255, 255, 255, 1];

    // Clockwise
    private _vertices: Vec3d[] = [
        // Top
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],

        // Bottom
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    private _verticesDirty: boolean = false;

    private _faces: Vec3d[][] = [
        [this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]],
        [this.vertices[3], this.vertices[2], this.vertices[6], this.vertices[7]],
        [this.vertices[0], this.vertices[3], this.vertices[7], this.vertices[4]],
        [this.vertices[2], this.vertices[1], this.vertices[5], this.vertices[6]],
        [this.vertices[1], this.vertices[0], this.vertices[4], this.vertices[5]],
        [this.vertices[5], this.vertices[4], this.vertices[7], this.vertices[6]]
    ];

    private _viewDirty: boolean = true;

    /**
     * Transform origin
     */
    private _anchor: Vec3d = [0.5, 0.5, 0.5];

    /**
     * Viewpoint offset relative to local coordinate
     */
    private _viewpointOffset: Vec3d = [-500, 500, -500];

    private _ambientLightOffset: Vec3d = [-500, 0, 0];

    private _colorDiff: number = 0.3;

    constructor(width: number = 10, height: number = 10, depth: number = 10) {
        super();
        this.transform.on(IsoCube.ON_MATRIX_DIRTY, this._onMatrix3dDirty.bind(this));
        this.size.on(Size3d.ON_CHANGE, this._onSizeChanged.bind(this));
        this.size.width = width;
        this.size.height = height;
        this.size.depth = depth;
    }

    setVerticesDirty(v: boolean) {
        if (this._verticesDirty === v) return;
        this._verticesDirty = v;
        if (v) {
            this.setViewDirty(true);
        }
    }

    setViewDirty(v: boolean) {
        if (this._viewDirty === v) return;
        this._viewDirty = v;
    }

    public updateView() {
        if (!this._viewDirty) return;
        this._viewDirty = false;
        // Update faces
        let pos = [0, 0];
        this.clear();
        const lightInfo = raycast(this, this._ambientLightOffset).sort((a, b) => a.index - b.index);
        // Face culling
        raycast(this, this._viewpointOffset).filter((info) => info.distance >= 0).forEach((info) => {
            this.beginPath();
            this._faces[info.index].forEach((vertice, i) => {
                toXYPlane(vertice, pos);
                if (i === 0) {
                    this.moveTo(pos[0], pos[1]);
                } else {
                    this.lineTo(pos[0], pos[1]);
                }
            });
            this.closePath();
            this.fill(Color.toString(Color.tint(this.color, lightInfo[info.index].distance * this._colorDiff, IsoCube._tempColor)));
        });
    }

    setRotation3d(v: AxisRad) {
        this.transform.setRotationAxisRad(v);
    }

    rotate3d(v: AxisRad) {
        this.transform.rotateAxis(v);
    }

    setColor(c: ColorRawData) {
        if (Color.equals(this._backgroundColor, c)) return;
        Color.set(c, this._backgroundColor);
        this.setViewDirty(true);
    }

    setAmbientLightOffset(vec: Vec3d) {
        if (Vector3d.equals(vec, this._ambientLightOffset)) return;
        Vector3d.clone(vec, this._ambientLightOffset);
        this.setViewDirty(true);
    }

    setViewpointOffset(vec: Vec3d) {
        if (Vector3d.equals(vec, this._viewpointOffset)) return;
        Vector3d.clone(vec, this._viewpointOffset);
        this.setViewDirty(true);
    }

    setColorDiff(v: number) {
        if (this._colorDiff === v) return;
        this._colorDiff = v;
        this.setViewDirty(true);
    }

    setScale3d(v: Vec3d|number) {
        this.transform.scale(v);
    }

    setSize3d(bounds: {width: number; height: number; depth: number}) {
        const { width, height, depth } = bounds;
        if (this.size.width === width && this.size.height === height && this.size.depth === depth) return;
        this.size.width = width;
        this.size.height = height;
        this.size.depth = depth;
        this.updatePivot3d();
        this.setVerticesDirty(true);
    }

    setAnchor3d(v: Vec3d) {
        if (Vector3d.equals(this._anchor, v)) return;
        Vector3d.clone(v, this._anchor);
        this.updatePivot3d();
    }

    updatePivot3d() {
        this.setPivot3d([this.size.width * this._anchor[0], this.size.height * this._anchor[1], this.size.depth * this._anchor[2]]);
    }

    setPivot3d(v: Vec3d) {
        this.transform.setPivot(v);
    }

    setPosition3d(v: Vec3d) {
        this.transform.setTranslation(v);
    }

    translate3d(v: Vec3d) {
        this.transform.translate(v);
    }

    private _onMatrix3dDirty() {
        this.setVerticesDirty(true);
    }

    private _onSizeChanged() {
        this.setVerticesDirty(true);
    }

    private _updateVertices() {
        // Update vertices
        Vector3d.set(0, this.size.height, this.size.depth, this._vertices[0]);
        Vector3d.set(this.size.width, this.size.height, this.size.depth, this._vertices[1]);
        Vector3d.set(this.size.width, this.size.height, 0, this._vertices[2]);
        Vector3d.set(0, this.size.height, 0, this._vertices[3]);

        Vector3d.set(0, 0, this.size.depth, this._vertices[4]);
        Vector3d.set(this.size.width, 0, this.size.depth, this._vertices[5]);
        Vector3d.set(this.size.width, 0, 0, this._vertices[6]);
        Vector3d.set(0, 0, 0, this._vertices[7]);

        this._center[0] = this._center[1] = this._center[2] = 0;
        this._vertices.forEach((v) => {
            // v[0] -= this.size.width * 0.5;
            // v[1] -= this.size.height * 0.5;
            // v[2] -= this.size.depth * 0.5;
            Vector3d.transform(v, this.transform.matrix);
            this._center[0] += v[0];
            this._center[1] += v[1];
            this._center[2] += v[2];
        });
        this._center[0] /= 8;
        this._center[1] /= 8;
        this._center[2] /= 8;
    }

    get color() {
        return this._backgroundColor;
    }

    get width() {
        return this.size.width;
    }

    get height() {
        return this.size.height;
    }

    get depth() {
        return this.size.depth;
    }

    get vertices() {
        if (this._verticesDirty) {
            this._updateVertices();
            this._verticesDirty = false;
        }
        return this._vertices;
    }

    get center() {
        if (this._verticesDirty) {
            this._updateVertices();
            this._verticesDirty = false;
        }
        return this._center;
    }

    get faces() {
        if (this._verticesDirty) {
            this._updateVertices();
            this._verticesDirty = false;
        }
        return this._faces;
    }
}