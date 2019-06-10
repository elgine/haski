// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import autobind from 'autobind-decorator';
import computed, { getComputedInnerValue } from '@core/computed';
import observable from '@core/observable';
import Color from '@maths/color';
import Vector2d from '@maths/vector2d';
import { AABB2d } from '@maths/bounds';
import RenderObject from '../core/renderObject';
import Region from '../core/region';
import Texture from '../core/texture';
import Size from '../core/size';
import RenderTarget from '../core/renderTarget';

export default class Sprite extends RenderObject {

    readonly type: string = 'sprite';
    readonly textureRegion: Region = new Region();
    readonly size: Size = new Size();
    readonly glIndices: number[] = [0, 1, 2, 0, 2, 3];
    readonly tintTexture: RenderTarget= new RenderTarget();

    autoSetTexRegionTexChanged: boolean = true;
    autoSetSizeTexChanged: boolean = true;
    autoSetSizeTexRegionChanged: boolean = true;

    @computed({ expression: 'computeGLVertices' })
    glVertices: Vec2d[] = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ];

    @computed({ expression: 'computeGLWorldVertices' })
    glWorldVertices: Vec2d[] = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ];

    @computed({ expression: 'computeGLTexCoords' })
    glTexCoords: Vec2d[] = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ];

    @observable({ onDirty: 'updatePivot' })
    ax: number = 0;

    @observable({ onDirty: 'updatePivot' })
    ay: number = 0;

    protected _texture?: Texture;
    protected _tint: RGBA = [255, 255, 255, 1];
    protected _tintTextureDirty: boolean = false;
    protected _glVerticesDirty: boolean = false;
    protected _glWorldVerticesDirty: boolean = false;
    protected _glTexCoordsDirty: boolean = false;

    constructor(texture?: Texture) {
        super();
        this.textureRegion.on(Region.ON_CHANGE, this._onTextureRegionChanged);
        this.size.on(Size.ON_CHANGE, this._onSizeChanged);
        if (texture) { this.texture = texture }
    }

    computeTintTexture() {
        if (!this._tintTextureDirty) return;
        this._tintTextureDirty = false;
        if (this._texture) {
            let width = this._texture.rawData.width;
            let height = this._texture.rawData.height;
            let tintTexture = getComputedInnerValue(this, 'tintTexture');
            let ctx = tintTexture.rawData.getContext('2d') as CanvasRenderingContext2D;
            tintTexture.rawData.width = width;
            tintTexture.rawData.height = height;
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = Color.toString(this._tint, false);
            ctx.fillRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'multiply';
            ctx.drawImage(this._texture.rawData, 0, 0);
            ctx.globalCompositeOperation = 'destination-atop';
            ctx.drawImage(this._texture.rawData, 0, 0);
        }
    }

    computeGLVertices(val: Vec2d[]) {
        if (!this._glVerticesDirty) return;
        this._glVerticesDirty = false;
        Vector2d.set(0, 0, val[0]);
        Vector2d.set(this.size.width, 0, val[1]);
        Vector2d.set(this.size.width, this.size.height, val[2]);
        Vector2d.set(0, this.size.height, val[3]);
    }

    computeGLWorldVertices(val: Vec2d[]) {
        if (!this._glWorldVerticesDirty) return;
        this._glWorldVerticesDirty = false;
        this.glVertices.forEach((v, i) => {
            Vector2d.transform(v, this.worldMatrix, val[i]);
        });
    }

    computeGLTexCoords(val: Vec2d[]) {
        if (!this._glTexCoordsDirty) return;
        this._glTexCoordsDirty = false;
        if (!this.texture) return;
        const right = this.textureRegion.x + this.textureRegion.width;
        const bottom = this.textureRegion.y + this.textureRegion.height;
        val[3][0] = val[0][0] = this.textureRegion.x;
        val[1][1] = val[0][1] = this.textureRegion.y;
        val[2][0] = val[1][0] = right;
        val[3][1] = val[2][1] = bottom;
    }

    setGLVerticesDirty(v: boolean = true) {
        if (this._glVerticesDirty === v) return;
        this._glVerticesDirty = v;
        if (v) this.setGLWorldVerticesDirty(v);
    }

    setGLWorldVerticesDirty(v: boolean = true) {
        if (this._glWorldVerticesDirty === v) return;
        this._glWorldVerticesDirty = v;
    }

    setGLTexCoordsDirty(v: boolean = true) {
        if (this._glTexCoordsDirty === v) return;
        this._glTexCoordsDirty = v;
    }

    setWorldMatrixDirty(v: boolean = true) {
        super.setWorldMatrixDirty(v);
        if (v) this.setGLWorldVerticesDirty(v);
    }

    setTint(v: ColorRawData) {
        if (Color.equals(v, this._tint)) return;
        Color.set(v, this._tint);
        if (this._texture) {
            this._tintTextureDirty = true;
            this.setRenderDirty(true);
        }
    }

    setMesh(vertices: Vec2d[]) {
        this.glVertices = vertices.slice();
        this.setLocalBoundsDirty(true);
        this.setRenderDirty(true);
    }

    updatePivot() {
        this.px = this.size.width * this.ax;
        this.py = this.size.height * this.ay;
    }

    protected _doComputeLocalBounds(target: AABB2d) {
        target.compose(this.glVertices);
    }

    @autobind
    protected _onSizeChanged() {
        this.setLocalBoundsDirty(true);
        this.setGLVerticesDirty(true);
        this.updatePivot();
        this.setRenderDirty(true);
    }

    @autobind
    protected _onTextureRegionChanged() {
        if (this.autoSetSizeTexRegionChanged) {
            this.size.clone(this.textureRegion);
        }
        this.setGLTexCoordsDirty(true);
        this.setRenderDirty(true);
    }

    set tint(v: RGBA) {
        this.setTint(v);
    }

    get tint(): RGBA {
        return this._tint;
    }

    set texture(v: Texture|undefined) {
        if (this._texture === v) return;
        if (this._texture) {
            this._texture.glTexture.removeRef();
        }
        this._texture = v;
        if (this._texture) {
            this._texture.glTexture.addRef();
            if (this.autoSetSizeTexChanged) {
                this.size.clone(this._texture.rawData);
            }
            if (this.autoSetTexRegionTexChanged) {
                this.textureRegion.setRegion(0, 0, this._texture.rawData.width, this._texture.rawData.height);
            }
        } else {
            this.size.width = 0;
            this.size.height = 0;
        }
        if (this._tint[3] > 0) {
            this._tintTextureDirty = true;
        }
        this.setRenderDirty(true);
    }

    get texture() {
        return this._texture;
    }
}