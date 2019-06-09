// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import GLTexture from './glTexture';

export default class GLFBO {

    public readonly gl: WebGLRenderingContext;
    private _fbo: WebGLFramebuffer|null = null;
    private _rbo: WebGLRenderbuffer|null = null;
    private _texture: GLTexture|null = null;
    private _width: number = 256;
    private _height: number = 256;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
    }

    initialize(texture?: GLTexture, width: number = 256, height: number = 256) {
        let ret;
        this._width = width;
        this._height = height;
        this._fbo = this.gl.createFramebuffer();
        this.bind();
        // Bind texture as color attachment
        if (texture && this._texture !== texture) {
            if (this._texture) {
                this._texture.removeRef();
            }
            this._texture = texture;
            if (this._texture) {
                this._texture.addRef();
            }
        }
        if (this._texture) {
            this.gl.bindTexture(this.gl.TEXTURE_2D, this._texture.texture);
            this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this._texture.texture, 0);
        }
        if (!this._rbo) {
            this._rbo = this.gl.createRenderbuffer();
        }
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this._rbo);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this._width, this._height);
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this._rbo);
        ret = this.valid();
        this.unbind();
        return ret;
    }

    valid() {
        let e = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER);
        if (this.gl.FRAMEBUFFER_COMPLETE !== e) {
            console.log('Frame buffer object is incomplete: ' + e.toString());
            return false;
        }
        return true;
    }

    bind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._fbo);
    }

    unbind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    dispose() {
        this.gl.deleteFramebuffer(this._fbo);
        this.gl.deleteRenderbuffer(this._rbo);
        this._rbo = null;
        this._fbo = null;
        this._texture = null;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }
}