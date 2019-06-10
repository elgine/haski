// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Renderer, { RendererParams } from '../renderer';
import RenderObject from '../../core/renderObject';
import { AABB2d } from '@maths/bounds';
import Color from '@maths/color';
import { getCanvasRenderingContext } from '@utils/canvas';
import SpriteRenderer from './objectRenderers/spriteRenderer';

export default class CanvasRenderer extends Renderer {

    /**
     * CanvasRenderingContext2D of current render-target
     */
    public ctx: CanvasRenderingContext2D;
    public curCtx!: CanvasRenderingContext2D;

    constructor(params: RendererParams = {}) {
        super(params);
        this.curCtx = this.ctx = getCanvasRenderingContext(this.rawData);
        this.addObjRenderer(new SpriteRenderer());
    }

    protected _preRender() {
        // this.curCtx = this.ctx;
        this.curCtx.save();
    }

    protected _postRender() {
        this.curCtx.restore();
    }

    protected _renderNode(node: RenderObject) {
        const m = node.worldMatrix;
        this.curCtx.save();
        this.curCtx.globalAlpha = node.globalOpacity;
        this.curCtx.transform(m[0], m[1], m[3], m[4], m[2], m[5]);
        this._objRendererMap[node.type].render(this, node);
        this.curCtx.restore();
    }

    protected _clearDirtyRegions(dirtyWorldRegions: IAABB2d[], clearColor: RGBA) {
        let region: AABB2d = new AABB2d();
        let clear = clearColor[3] <= 0;
        this.curCtx.beginPath();
        dirtyWorldRegions.forEach((r: IAABB2d) => {
            region.clone(r).round();
            clear && this.curCtx.clearRect(region.x, region.y, region.width, region.height);
            this.curCtx.rect(region.x, region.y, region.width, region.height);
        });
        this.curCtx.closePath();
        if (!clear) {
            this.curCtx.fillStyle = Color.toString(clearColor);
            this.curCtx.fill();
        }
        this.curCtx.clip();
    }

    protected _applyViewMatrix(vm: Mat2d) {
        this.curCtx.transform(vm[0], vm[1], vm[3], vm[4], vm[2], vm[5]);
    }
}