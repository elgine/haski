// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export default class GLTexture {

    /**
     * Texture id, readonly relative to user
     * @readonly
     */
    public id: number = -1;

    /**
     * WebGLTexture instance, readonly relative to user
     * @readonly
     */
    public texture: WebGLTexture|null = null;

    /**
     * Flag need to update(upload)
     */
    public dirty: boolean = false;

    /**
     * Set by glTextureManager, increased when ref <= 0 in per tick.
     * When > gcTime, glTextureManager would uninstall from gpu.
     */
    public freeFlag: number = 0;

    /**
     * Filtering, NEAREST default
     */
    private _minFilter: number = WebGLRenderingContext.LINEAR;
    private _magFilter: number = WebGLRenderingContext.LINEAR;

    /**
     * Wrapping, REPEAT default
     */
    private _wrapS: number = WebGLRenderingContext.REPEAT;
    private _wrapN: number = WebGLRenderingContext.REPEAT;

    /**
     * Generate mipmap
     */
    private _mipmap: boolean = true;

    /**
     * Reference counter
     */
    private _ref: number = 0;

    addRef() {
        this._ref++;
    }

    removeRef() {
        this._ref--;
    }

    /**
     * @internal
     */
    _dispose() {
        this._ref = 0;
        this.dirty = false;
        this.texture = null;
        this.id = -1;
    }

    get ref() {
        return this._ref;
    }

    set mipmap(v: boolean) {
        if (this._mipmap === v) return;
        this._mipmap = v;
        this.dirty = true;
    }

    get mipmap() {
        return this._mipmap;
    }

    set minFilter(v: number) {
        if (this._minFilter === v) return;
        this._minFilter = v;
        this.dirty = true;
    }

    get minFilter() {
        return this._minFilter;
    }

    set magFilter(v: number) {
        if (this._magFilter === v) return;
        this._magFilter = v;
        this.dirty = true;
    }

    get magFilter() {
        return this._magFilter;
    }

    set wrapS(v: number) {
        if (this._wrapS === v) return;
        this._wrapS = v;
        this.dirty = true;
    }

    get wrapS() {
        return this._wrapS;
    }

    set wrapN(v: number) {
        if (this._wrapN === v) return;
        this._wrapN = v;
        this.dirty = true;
    }

    get wrapN() {
        return this._wrapN;
    }
}