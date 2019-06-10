// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import SpatialManager from './spatialManager';
import RenderObject from '../renderObject/renderObject';
import autobind from 'autobind-decorator';

export interface StageParams{
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

export default class Stage {

    public readonly spatial: SpatialManager;
    public readonly root: RenderObject;

    public readonly nodeSet: Set<RenderObject> = new Set<RenderObject>();
    public readonly dirtySet: Set<RenderObject> = new Set<RenderObject>();

    constructor(params: StageParams = {}) {
        this.spatial = new SpatialManager(params.width, params.height, params.x, params.y);
        this.root = new RenderObject();
        this.root.$$setStage(this);
    }

    clearDirty() {
        this.dirtySet.forEach((node) => {
            node.setRenderDirty(false);
            node.$$worldBoundsDirtyInThisTick = false;
        });
        this.dirtySet.clear();
    }

    /**
     * Proxy 'addChild' of root node
     */
    addChild(v: RenderObject) {
        return this.root.addChild(v);
    }

    /**
     * Proxy 'addChildAt' of root node
     * @param v
     * @param i
     */
    addChildAt(v: RenderObject, i: number) {
        return this.root.addChildAt(v, i);
    }

    $$watchNode(n: RenderObject) {
        if (n === this.root || this.nodeSet.has(n)) return;
        this.nodeSet.add(n);
        this.spatial.onNodeAdded(n);
        n.on(RenderObject.ON_WORLD_BOUNDS_DIRTY, this._onNodeWorldBoundDirty);
        n.on(RenderObject.ON_RENDER_DIRTY, this._onNodeDirty);
        n.on(RenderObject.ON_REMOVED_FROM_STAGE, this._onNodeRemoved);
    }

    @autobind
    protected _onNodeDirty(n: RenderObject) {
        if (n === this.root) return;
        this.dirtySet.add(n);
    }

    @autobind
    protected _onNodeWorldBoundDirty(n: RenderObject) {
        if (n === this.root) return;
        this.spatial.onNodeWorldBoundDirty(n);
    }

    @autobind
    protected _onNodeRemoved(n: RenderObject) {
        if (n === this.root || !this.nodeSet.has(n)) return;
        this.spatial.onNodeRemoved(n);
        n.off(RenderObject.ON_WORLD_BOUNDS_DIRTY, this._onNodeWorldBoundDirty);
        n.off(RenderObject.ON_RENDER_DIRTY, this._onNodeDirty);
        n.off(RenderObject.ON_REMOVED_FROM_STAGE, this._onNodeRemoved);
        this._onNodeDirty(n);
        this.nodeSet.delete(n);
    }
}