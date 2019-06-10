// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Color from '@maths/color';
import { AABB2d } from '@maths/bounds';
import { getCanvasRenderingContext } from '@utils/canvas';
import RendererType from './rendererType';
import Stage from '../core/stage';
import Size from '../core/size';
import RenderTarget, { RenderTargetParams } from '../core/renderTarget';
import RenderObject from '../core/renderObject';
import ObjectRenderer from './objectRenderer';
import DirtyRectCollector from '../core/dirtyRectCollector';

export interface RendererParams extends RenderTargetParams{
    type?: RendererType;
    backgroundColor?: ColorRawData;
    resolution?: number;
    fixResolution?: boolean;
    antialias?: boolean;
}

export default class Renderer extends RenderTarget {

    public static DEFAULT_WIDTH: number = 800;
    public static DEFAULT_HEIGHT: number = 600;
    public static DEFAULT_RESOLUTION: number = 4 / 3;

    /**
     * Type of renderer
     */
    public readonly type: RendererType = RendererType.CANVAS;

    /**
     * Renderer width, height in pixels
     */
    public readonly size: Size = new Size();

    /**
     * Flag use dirty-rectangle rendering
     */
    public enableDirtyRendering: boolean = true;
    public dirtyRenderingUpperLimit: number = 0.6;
    public needRefresh: boolean = true;
    protected _useDirtyRendering: boolean = true;

    /**
     * Resolution ratio
     */
    protected _resolution: number = Renderer.DEFAULT_RESOLUTION;

    /**
     * Background color
     */
    protected _backgroundColor: RGBA = [0, 0, 0, 0];

    /**
     * Make width/height conform to resolution
     */
    protected _fixResolution: boolean = false;

    protected _objRendererMap: Dictionary<ObjectRenderer<RenderObject>> = {};

    /**
     * Dirty rectangle combiner
     */
    protected _dirtyRectCollector: DirtyRectCollector = new DirtyRectCollector();

    constructor(params: RendererParams = {}, ...args: any[]) {
        super(params);
        const size = params.size || { width: Renderer.DEFAULT_WIDTH, height: Renderer.DEFAULT_HEIGHT };
        this.size.width = size.width;
        this.size.height = size.height;
        this.fixResolution = params.fixResolution || false;
        this._updateResolution();
        if (params.backgroundColor) this.backgroundColor = params.backgroundColor;
    }

    addObjRenderer(objRenderer: ObjectRenderer<RenderObject>) {
        this._objRendererMap[objRenderer.name] = objRenderer;
    }

    renderStageToTarget(stage: Stage, target?: RenderTarget, ...args: any[]) {
        const dirtyObjectCount = stage.dirtySet.size;
        if (dirtyObjectCount <= 0 && !this.needRefresh) return;
        if (this.size.width !== this.rawData.width || this.size.height !== this.rawData.height) {
            this.rawData.width = this.size.width;
            this.rawData.height = this.size.height;
            this.needRefresh = true;
        }
        const renderObjectSet: Set<RenderObject> = new Set<RenderObject>();
        let bounds = new AABB2d(0, 0, this.size.width, this.size.height);
        let dirtyRegions: IAABB2d[] = [bounds];
        this._useDirtyRendering = !this.needRefresh && this.type === RendererType.CANVAS && this.enableDirtyRendering && stage.nodeSet.size * this.dirtyRenderingUpperLimit >= dirtyObjectCount;
        if (this._useDirtyRendering) {
            stage.dirtySet.forEach((dirtyNode) => {
                if (bounds.overlap(dirtyNode.$$lastWorldBounds)) { this._dirtyRectCollector.addRegion(dirtyNode.$$lastWorldBounds) }
                if (bounds.overlap(dirtyNode.worldBounds)) { this._dirtyRectCollector.addRegion(dirtyNode.worldBounds) }
            });
            dirtyRegions = this._dirtyRectCollector.dirtyRegions;
        }
        dirtyRegions.forEach((dirtyRegion) => {
            stage.spatial.findNodesOverlapRect(renderObjectSet, dirtyRegion, (o: RenderObject) => {
                return o.globalOpacity > 0 && o.visible;
            });
        });
        this._preRender();
        this._clearDirtyRegions(dirtyRegions, this._backgroundColor);
        this._renderNodes(renderObjectSet);
        this._postRender();
        if (target && target.rawData !== this.rawData) {
            this._swapBuffer(target);
        } else {
            stage.clearDirty();
            this._dirtyRectCollector.reset();
        }
        this.needRefresh = false;
        this._useDirtyRendering = false;
    }

    protected _preRender() {

    }

    protected _postRender() {

    }

    protected _swapBuffer(target: RenderTarget) {
        const targetCtx = getCanvasRenderingContext(target.rawData);
        const { width, height } = target.rawData;
        targetCtx.clearRect(0, 0, width, height);
        targetCtx.drawImage(this.rawData, 0, 0, width, height);
    }

    protected _clearDirtyRegions(dirtyWorldRegions: IAABB2d[], clearColor: RGBA) {

    }

    protected _renderNodes(renderSet: Set<RenderObject>) {
        Array.from(renderSet).sort(RenderObject.compare).forEach((node) => {
            if (this._objRendererMap[node.type]) {
                this._renderNode(node);
            }
        });
    }

    protected _renderNode(node: RenderObject) {

    }

    protected _updateResolution() {
        this._resolution = this.size.width / this.size.height;
    }

    protected _updateSizeIfFixedResolution() {
        if (this._fixResolution) {
            this.size.height = this.size.width / this._resolution;
        }
    }

    set resolution(v: number) {
        if (this._resolution === v || v === 0) return;
        this._resolution = v;
        this._updateSizeIfFixedResolution();
    }

    get resolution() {
        return this._resolution;
    }

    set fixResolution(v: boolean) {
        if (this._fixResolution === v) return;
        this._fixResolution = v;
        this._updateResolution();
    }

    get fixResolution() {
        return this._fixResolution;
    }

    set backgroundColor(v: any) {
        if (Color.equals(this._backgroundColor, v)) return;
        Color.set(v, this._backgroundColor);
    }

    get backgroundColor() {
        return this._backgroundColor;
    }
}