import uuid from 'uuid/v4';
import computed, { getComputedInnerValue } from '@core/computed';
import observable from '@core/observable';
import Transform2d from '@maths/transform2d';
import { AABB2d } from '@maths/bounds';
import Matrix2d from '@maths/matrix2d';
import Stage from '../core/stage';

const mat = Matrix2d.create();

export default class RenderObject extends Transform2d {

    public static ON_ADDED_TO_STAGE = 'ON_ADDED_TO_STAGE';
    public static ON_REMOVED_FROM_STAGE = 'ON_REMOVED_FROM_STAGE';
    public static ON_LOCAL_BOUNDS_DIRTY = 'ON_LOCAL_BOUNDS_DIRTY';
    public static ON_WORLD_BOUNDS_DIRTY = 'ON_WORLD_BOUNDS_DIRTY';
    public static ON_VISIBLE_CHANGE = 'ON_VISIBLE_CHANGE';
    public static ON_RENDER_DIRTY = 'ON_RENDER_DIRTY';

    public static compare(a: RenderObject, b: RenderObject) {
        let aDepth = a.globalZIndex.length; let
            bDepth = b.globalZIndex.length;
        let delta: number;
        for (let i = 0, count = Math.min(aDepth, bDepth); i < count; i++) {
            delta = a.globalZIndex[i] - b.globalZIndex[i];
            if (delta !== 0) return delta;
        }
        return aDepth - bDepth;
    }

    readonly id = uuid();

    name: string = 'undefined';
    type: string = 'undefined';

    compositionOperation: string = 'source-over';

    @computed({ expression: 'computeLocalBounds' })
    localBounds: AABB2d = new AABB2d();

    @computed({ expression: 'computeWorldBounds' })
    worldBounds: AABB2d = new AABB2d();

    // Cache last world-bounds in order to implement dirty-rect-rendering
    $$worldBoundsDirtyInThisTick = false;
    $$lastWorldBounds: AABB2d = new AABB2d();

    @computed({ expression: 'computeWorldMatrix' })
    worldMatrix: Mat2d = Matrix2d.create();

    @computed({ expression: 'computeWorldMatrix' })
    invWorldMatrix: Mat2d = Matrix2d.create();

    @observable({ onGet: 'computeChildren', onDirty: 'onLocalZIndexDirty' })
    localZIndex: number = 0;

    @computed({ expression: 'computeGlobalZIndex' })
    globalZIndex: number[] = [];

    @computed({ expression: 'computeChildren' })
    children: RenderObject[] = [];

    @observable({ onDirty: 'setGlobalOpacityDirty' })
    opacity: number = 1;

    @computed({ expression: 'computeGlobalOpacity' })
    globalOpacity: number = 1;

    @observable({ onDirty: 'onVisibleChange' })
    visible: boolean = true;

    /**
     * Stage object this node belongs to
     */
    protected _stage?: Stage;

    /**
     * Parent node
     */
    protected _parent?: RenderObject;

    protected _timeSetLocalZIndex: number = 0;
    protected _worldMatrixDirty = false;
    protected _globalZIndexDirty = false;
    protected _globalOpacityDirty = false;
    protected _childrenOrderDirty = false;
    protected _localBoundsDirty = false;
    protected _worldBoundsDirty = false;
    protected _renderDirty = false;

    constructor() {
        super();
        this.on(Transform2d.ON_MATRIX_DIRTY, this.setWorldMatrixDirty.bind(this));
    }

    $$setStage(v?: Stage) {
        if (this._stage === v) return;
        if (this._stage) {
            this.emit(RenderObject.ON_REMOVED_FROM_STAGE, this);
        }
        this._stage = v;
        if (this._stage) {
            this._stage.$$watchNode(this);
            this.emit(RenderObject.ON_ADDED_TO_STAGE, this);
        }
        this.setWorldBoundsDirty(true);
        this.setRenderDirty(true);
        this.children.forEach((child) => {
            child.$$setStage(this._stage);
        });
    }

    $$setParent(p?: RenderObject) {
        if (this._parent === p) return;
        let previousParentExists = this._parent !== undefined;
        this._parent = p;
        if (previousParentExists) {
            // Keep world matrix be same only when previous parent exists
            if (this._parent) {
                Matrix2d.invert(this._parent.matrix, mat);
                Matrix2d.mul(this.worldMatrix, mat, mat);
                this.setMatrix(mat);
            } else {
                this.setMatrix(this.worldMatrix);
            }
        } else {
            this.setWorldMatrixDirty(true);
        }
        this.setGlobalZIndexDirty(true);
    }

    $$_setChildrenOrderDirty(v = true) {
        if (this._childrenOrderDirty === v) return;
        this._childrenOrderDirty = v;
    }

    onVisibleChange() {
        this.emit(RenderObject.ON_VISIBLE_CHANGE, this);
        this.setRenderDirty(true);
    }

    onLocalZIndexDirty() {
        this._timeSetLocalZIndex = Date.now();
        this.setGlobalZIndexDirty();
    }

    setGlobalZIndexDirty(v = true) {
        if (this._globalZIndexDirty === v) return;
        this._globalZIndexDirty = v;
        this._parent && this._parent.$$_setChildrenOrderDirty(v);
    }

    setWorldMatrixDirty(v = true) {
        if (this._worldMatrixDirty === v) return;
        this._worldMatrixDirty = v;
        if (v) {
            this.setWorldBoundsDirty(true);
            this.setRenderDirty(true);
            this.children.forEach((c) => c.setWorldMatrixDirty(v));
        }
    }

    setGlobalOpacityDirty(v: boolean) {
        if (this._globalOpacityDirty === v) return;
        this._globalOpacityDirty = v;
        if (v) {
            this.setRenderDirty(v);
            this.children.forEach((child) => {
                child.setGlobalOpacityDirty(true);
            });
        }
    }

    setLocalBoundsDirty(v = true) {
        if (this._localBoundsDirty === v) return;
        this._localBoundsDirty = v;
        if (this._localBoundsDirty) {
            this.setWorldBoundsDirty();
        }
    }

    setWorldBoundsDirty(v = true) {
        if (this._worldBoundsDirty === v) return;
        this._worldBoundsDirty = v;
        if (this._worldBoundsDirty) {
            if (!this.$$worldBoundsDirtyInThisTick) {
                let innerWB = getComputedInnerValue(this, 'worldBounds');
                this.$$lastWorldBounds.clone(innerWB);
                this.$$worldBoundsDirtyInThisTick = true;
            }
            this.emit(RenderObject.ON_WORLD_BOUNDS_DIRTY, this);
        }
    }

    setRenderDirty(v = true) {
        if (this._renderDirty === v) return;
        this._renderDirty = v;
    }

    computeChildren() {
        let children = getComputedInnerValue(this, 'children');
        if (this._childrenOrderDirty) {
            children.sort((a, b) => {
                if (a._localZIndex === b._localZIndex) {
                    return b._localZIndexChangeTime - a._localZIndexChangeTime;
                }
                return a._localZIndex - b._localZIndex;
            }).forEach((child, i) => {
                child.localZIndex = i;
            });
            this._childrenOrderDirty = false;
        }
        return children;
    }

    computeGlobalZIndex(v: number[]) {
        if (this._globalZIndexDirty) {
            v.length = 0;
            if (this.parent) {
                Array.prototype.push.apply(v, this.parent.globalZIndex);
            }
            v.push(this.localZIndex);
            this._globalZIndexDirty = false;
        }
    }

    computeGlobalOpacity() {
        let globalOpacity = this.opacity;
        if (this._globalOpacityDirty) {
            globalOpacity *= this.parent ? this.parent.globalOpacity : 1;
            this._globalOpacityDirty = false;
        }
        return globalOpacity;
    }

    computeLocalBounds() {
        if (this._localBoundsDirty) {
            this._doComputeLocalBounds(getComputedInnerValue(this, 'localBounds'));
            this._localBoundsDirty = false;
        }
    }

    computeWorldBounds() {
        if (this._worldBoundsDirty) {
            this._doComputeWorldBounds(this.localBounds, getComputedInnerValue(this, 'worldBounds'));
            this._worldBoundsDirty = false;
        }
    }

    computeWorldMatrix() {
        if (this._worldMatrixDirty) {
            let innerMat = getComputedInnerValue(this, 'worldMatrix');
            let innerInvMat = getComputedInnerValue(this, 'invWorldMatrix');
            this._doComputeWorldMatrix(innerMat, innerInvMat);
            this._worldMatrixDirty = false;
        }
    }

    /**
     * Append child to end of children list
     * @param n
     */
    addChild(n: RenderObject) {
        this.addChildAt(n);
    }

    addChildAt(n: RenderObject, index: number = -1) {
        index = index < 0 ? this.children.length : index;
        if (n.parent === this) return false;
        this.children.push(n);
        // Set current target to new child
        n.$$setStage(this._stage);
        n.$$setParent(this);
        n.localZIndex = index;
    }

    swapChildren(chidl1: RenderObject, child2: RenderObject) {
        let order1 = chidl1.localZIndex;
        let order2 = child2.localZIndex;
        chidl1.localZIndex = order2;
        child2.localZIndex = order1;
    }

    /**
     * Get child index
     * @param n
     */
    getChildIndex(n: RenderObject) {
        return this.children.findIndex((c) => c === n);
    }

    /**
     * Get child index according name
     * @param n
     */
    getChildIndexByName(name: string) {
        return this.children.findIndex((c) => c.name === name);
    }

    /**
     * Get child at specific index
     * @param index
     */
    getChildAt(index: number) {
        return this.children[index];
    }

    /**
     * Try to get child according to specific name
     * @param name
     */
    getChildByName(name: string): RenderObject|undefined {
        let c = this.children.find((c) => c.name === name);
        if (!c) {
            for (let child of this.children) {
                c = child.getChildByName(name);
                if (c) break;
            }
        }
        return c;
    }

    /**
     * Remove child
     * @param n
     */
    removeChild(n: RenderObject) {
        return this.removeChildAt(this.children.indexOf(n));
    }

    /**
     * Remove child at specific position
     * @param index
     */
    removeChildAt(index: number) {
        if (index < 0 || index >= this.children.length) return undefined;
        let child = this.children.splice(index, 1)[0];
        if (child) {
            child.localZIndex = -1;
            child.$$setParent(undefined);
            child.$$setStage(undefined);
        }
        return child;
    }

    protected _doComputeLocalBounds(target: AABB2d) {

    }

    protected _doComputeWorldBounds(local: AABB2d, target: AABB2d) {
        target.clone(local).transform(this.matrix);
    }

    protected _doComputeWorldMatrix(innerMat: Mat2d, innerInvMat: Mat2d) {
        Matrix2d.reset(innerMat);
        if (this._parent) {
            Matrix2d.mul(innerMat, this._parent.worldMatrix);
        }
        Matrix2d.mul(innerMat, this.matrix);
        Matrix2d.invert(innerMat, innerInvMat);
    }

    get parent() {
        return this._parent;
    }

    get stage() {
        return this._stage;
    }

    get renderDirty() {
        return this._renderDirty;
    }
}