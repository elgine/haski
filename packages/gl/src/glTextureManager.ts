// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import GLTexture from './glTexture';
import isPowOf2 from '@maths/isPowOf2';

class GLTextureUnitGenerator {

    public maxNum: number;
    private _units: number[] = [];
    private _freeCount: number = 0;

    constructor(maxNum: number = 32) {
        this.maxNum = maxNum;
        this._freeCount = maxNum;
        for (let i = 0; i < this.maxNum; i++) { this._units[i] = i }
    }

    obtain() {
        if (this._freeCount <= 0) {
            return -1;
        }
        let unit = this._units.shift();
        if (unit === undefined || unit < 0) return -1;
        this._units.push(unit);
        this._freeCount--;
        return unit;
    }

    free(id: number) {
        let index = this._units.indexOf(id);
        if (index >= this._freeCount && index < this.maxNum) {
            this._units.splice(index, 1);
            this._units.splice(this._freeCount++, 0, id);
        }
    }

    get units() {
        return this._units.slice(this._freeCount);
    }
}

export default class GLTextureManager {

    public readonly gl: WebGLRenderingContext;
    public gcTime: number = 60;
    private _idGenerator: GLTextureUnitGenerator;
    private _idTextureMap: GLTexture[] = [];
    private _glTextures: GLTexture[] = [];

    constructor(gl: WebGLRenderingContext, maxTextureCount: number = 16, gcTime: number = 60) {
        this.gl = gl;
        this.gcTime = gcTime;
        this._idTextureMap = new Array<GLTexture>(maxTextureCount);
        this._idGenerator = new GLTextureUnitGenerator(maxTextureCount);
    }

    createGLTexture() {
        let texture = this.gl.createTexture();
        if (!texture) throw new Error("Can't create webgl texture");
        let glTexture = new GLTexture();
        this._glTextures.push(glTexture);
        return glTexture;
    }

    update() {
        this._glTextures.slice().forEach((glTexture) => {
            if (glTexture.ref > 0) {
                glTexture.freeFlag = 0;
            } else {
                glTexture.freeFlag++;
            }
            if (glTexture.freeFlag >= this.gcTime) {
                this.destroyGLTexture(glTexture);
            }
        });
    }

    upload(texture: GLTexture, source?: HTMLImageElement|HTMLVideoElement|HTMLCanvasElement, width: number = 256, height: number = 256) {
        if (!texture.dirty && texture.id > -1) return false;
        if (texture.id < 0 || this._idTextureMap[texture.id] !== texture) {
            let id = this._idGenerator.obtain();
            if (id < 0) {
                id = this.disposeUselessTextureInGPU();
            }
            texture.id = id;
        }
        if (!texture.texture) {
            texture.texture = this.gl.createTexture();
        }
        this.gl.activeTexture(this.gl.TEXTURE0 + texture.id);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture.texture);
        if (source) {
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, source);
        } else {
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
        }
        width = source ? source.width : width;
        height = source ? source.height : height;
        if (!isPowOf2(width) || !isPowOf2(height)) {
            texture.minFilter = this.gl.NEAREST;
            texture.magFilter = this.gl.NEAREST;
            texture.wrapN = this.gl.CLAMP_TO_EDGE;
            texture.wrapS = this.gl.CLAMP_TO_EDGE;
            texture.mipmap = false;
        }
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, texture.minFilter || this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, texture.magFilter || this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, texture.wrapS || this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, texture.wrapN || this.gl.REPEAT);
        if (texture.mipmap) {
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
        }
        texture.dirty = false;
        // Reset freeFlag
        texture.freeFlag = 0;
        return true;
    }

    disposeUselessTextureInGPU() {
        let glTexture = this._idTextureMap.sort((a, b) => a.ref - b.ref)[0];
        let id = glTexture.id;
        if (this._idTextureMap[id] === glTexture) {
            this._idGenerator.free(id);
            delete this._idTextureMap[id];
            glTexture.id = -1;
        }
        return id;
    }

    destroyGLTexture(glTexture: GLTexture) {
        let index = this._glTextures.indexOf(glTexture);
        if (index > -1) {
            if (glTexture.id > 0 && this._idTextureMap[glTexture.id] === glTexture) {
                this._idGenerator.free(glTexture.id);
                delete this._idTextureMap[glTexture.id];
            }
            this.gl.deleteTexture(glTexture.texture);
            glTexture._dispose();
        }
    }

    get units() {
        return this._idGenerator.units;
    }
}