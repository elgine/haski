// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { getWebGLRenderingContext } from '@utils/canvas';
import autobind from 'autobind-decorator';
import Renderer, { RendererParams } from '../renderer';
import RendererType from '../rendererType';
import RenderObject from '../../../renderObject/renderObject';
import GLTextureManager from '@gl/glTextureManager';
import GLShaderManager from '@gl/glShaderManager';
import { AABB2d } from '@maths/bounds';
import { spriteVS, spriteFS } from './shaders/sprite';
import { patternVS, patternFS } from './shaders/pattern';
import { gradientVS, gradientFS } from './shaders/gradient';

import SpriteRenderer from './objectRenderers/spriteRenderer';

const GL = WebGLRenderingContext;
const compositionBlendFunMap: Dictionary<number[]> = {
    'source-over': [GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA, GL.ONE, GL.ONE],
    'source-in': [GL.DST_ALPHA, GL.ZERO],
    'source-out': [GL.ONE_MINUS_DST_ALPHA, GL.ZERO],
    'source-atop': [GL.DST_ALPHA, GL.ONE_MINUS_SRC_ALPHA],
    'destination-over': [GL.ONE_MINUS_DST_ALPHA, GL.ONE],
    'destination-in': [GL.ZERO, GL.SRC_ALPHA],
    'destination-out': [GL.ZERO, GL.ONE_MINUS_SRC_ALPHA],
    'destination-atop': [GL.ONE_MINUS_DST_ALPHA, GL.SRC_ALPHA],
    'lighter': [GL.ONE, GL.ONE],
    'copy': [GL.ONE, GL.ZERO],
    'xor': [GL.ONE_MINUS_DST_ALPHA, GL.ONE_MINUS_SRC_ALPHA]
};

/**
 * WebGL renderer in auto batch-up
 */
export default class GLRenderer extends Renderer {

    public readonly ctx: WebGLRenderingContext;
    public readonly type: RendererType = RendererType.WEBGL;
    public readonly textureManager: GLTextureManager;
    public readonly shaderManager: GLShaderManager;

    /**
     * Current rendering context
     */
    public curCtx!: WebGLRenderingContext;

    private _drawCall: number = 0;

    /**
     * Current blend mode
     */
    private _blendFn: string = 'none';

    // // Dirty rendering
    // private _fbo:GLFBO;
    // private _fboTexture:GLTexture;

    constructor(params: RendererParams = {}) {
        super(params);
        this.curCtx = this.ctx = getWebGLRenderingContext(this.rawData);
        this.curCtx.enable(this.curCtx.BLEND);
        this.shaderManager = new GLShaderManager(this.ctx);
        const maxTextureUnits =  this.ctx.getParameter(this.ctx.MAX_TEXTURE_IMAGE_UNITS);
        this.textureManager = new GLTextureManager(this.ctx, maxTextureUnits);
        // // Dirty rendering
        // this._fbo = new GLFBO(this.ctx);
        // this._fboTexture = new GLTexture();
        // this.textureManager.upload(this._fboTexture);
        // this._fbo.initialize(this._fboTexture);
        this.shaderManager.createShader('sprite', spriteVS(), spriteFS(maxTextureUnits));
        this.shaderManager.createShader('pattern', patternVS(), patternFS(maxTextureUnits));
        this.shaderManager.createShader('gradient', gradientVS(), gradientFS());
        this.curCtx.enable(this.curCtx.BLEND);
        this.setCompositionBlend('source-over');

        this.addObjRenderer(new SpriteRenderer());
    }

    /**
     * Switch compositing or blending
     * @param v
     */
    setCompositionBlend(v: string) {
        if (this._blendFn !== v) {
            let params = compositionBlendFunMap[v];
            let fn: Function = params.length > 2 ? this.curCtx.blendFuncSeparate : this.curCtx.blendFunc;
            if (this.shaderManager.curShader) { this.shaderManager.curShader.vao.flush() }
            fn.apply(this.curCtx, params);
            this._blendFn = v;
        }
    }

    switchShader(name: string) {
        if (!this.shaderManager.curShader || this.shaderManager.curShader.name !== name) {
            if (this.shaderManager.curShader) {
                this.shaderManager.curShader.vao.onDrawn = undefined;
            }
            // Switch shader
            this.shaderManager.switchShader(name);
            const curShader = this.shaderManager.curShader;
            if (curShader) {
                curShader.vao.onDrawn = this._onDrawn;
                curShader.vao.beforeDrawn = this._beforeDrawn;
                curShader.uniforms['uViewWidth'].value = this.size.width;
                curShader.uniforms['uViewHeight'].value = this.size.height;
            }
        }
        return this.shaderManager.curShader;
    }

    protected _renderNode(node: RenderObject) {
        this._objRendererMap[node.type].render(this, node);
    }

    protected _clearDirtyRegions(dirtyWorldRegions: AABB2d[], c: RGBA) {
        // // Dirty rendering
        // if(!this._useDirtyRendering){
        this.curCtx.viewport(0, 0, this.size.width, this.size.height);
        const inv255 = 1 / 255;
        this.curCtx.clearColor(c[0] * inv255, c[1] * inv255, c[2] * inv255, c[3]);
        this.curCtx.clear(this.curCtx.COLOR_BUFFER_BIT | this.curCtx.DEPTH_BUFFER_BIT);
        // // Dirty rendering
        // }else{
        //     const inv255 = 1 / 255;
        //     const r = c[0] * inv255, g = c[1] * inv255, b = c[2] * inv255, a = c[3];
        //     const curShader = this.switchShader("shape", vm);
        //     dirtyWorldRegions.forEach((region)=>{
        //         curShader.vao.push([
        //             region.x, region.y, r, g, b, a,
        //             region.x + region.width, region.y, r, g, b, a,
        //             region.x + region.width, region.y + region.height, r, g, b, a,
        //             region.x, region.y + region.height, r, g, b, a
        //         ], [0, 1, 2, 0, 2, 3]);
        //     });
        // }
    }

    protected _preRender() {
        this.curCtx = this.ctx;
        this._drawCall = 0;
        // // Dirty rendering
        // if(this.needRefresh){
        //     let width = nextPow2(this.size.width), height = nextPow2(this.size.height);
        //     if(width !== this._fbo.width || height !== this._fbo.height){
        //         this._fboTexture.dirty = true;
        //         this.textureManager.upload(this._fboTexture, undefined, width, height);
        //         this._fbo.initialize(this._fboTexture, width, height);
        //     }
        // }
        // this._fbo.bind();
    }

    protected _swapBackBuffer() {
        // // Dirty rendering
        // this._fbo.unbind();
        // const {width, height} = this.size, wr = width / this._fbo.width, hr = height / this._fbo.height;
        // this.curCtx.viewport(0, 0, width, height);
        // this.switchShader("sprite", this._vm);
        // const id = this._fboTexture.id;
        // this.shaderManager.curShader.vao.push([
        //     0, 0, id, 0, hr, 1, 1, 1, 1,
        //     width, 0, id, wr, hr, 1, 1, 1, 1,
        //     width, height, id, wr, 0, 1, 1, 1, 1,
        //     0, height, id, 0, 0, 1, 1, 1, 1
        // ], [0, 1, 2, 0, 2, 3]);
        // this.shaderManager.curShader.vao.flush();
    }

    protected _postRender() {
        if (this.shaderManager.curShader) {
            this.shaderManager.curShader.vao.flush(this.curCtx.DYNAMIC_DRAW);
            // console.log(this.drawCall);
        }
        this._swapBackBuffer();
    }

    @autobind
    private _beforeDrawn() {
        const curShader = this.shaderManager.curShader;
        if (curShader.uniforms['uTextures']) {
            curShader.uniforms['uTextures'].value = this.textureManager.units;
        }
        curShader.uniforms['uViewWidth'].value = this.size.width;
        curShader.uniforms['uViewHeight'].value = this.size.height;
    }

    @autobind
    private _onDrawn() {
        this._drawCall++;
    }

    get drawCall() {
        return this._drawCall;
    }
}