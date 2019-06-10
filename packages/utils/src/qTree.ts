// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Pool from '@core/pool';
import { AABB2d, OBB2d } from '@maths/bounds';

export interface QTreeNodeItem{
    id: string;
    worldBounds: AABB2d;
}

/**
 * Quad-tree, dynamic insert, delete and update.
 */
export class QTreeNode<T extends QTreeNodeItem> {

    public maxItems: number = 5;
    private _level: number = 0;
    private _parent?: QTreeNode<T>;
    private _tree!: QTree<T>;
    private _nodes: Array<QTreeNode<T>> = [];
    private _items: Set<T> = new Set<T>();
    private _bounds: AABB2d = new AABB2d();

    initialize(
        tree: QTree<T>, x: number, y: number, width: number, height: number, maxItems: number = 5, level: number = 0,
        parent?: QTreeNode<T>
    ) {
        this._level = level || 0;
        this._parent = parent;
        this._tree = tree;
        this._nodes = [];
        this._items = new Set<T>();
        this._bounds.set(x, y, width, height);
        this.maxItems = maxItems;
    }

    getAll(items: Array<T>) {
        Array.prototype.push.apply(items, Array.from(this._items));
        this._nodes.forEach(node => {
            node.getAll(items);
        });
    }

    release() {
        this._nodes.splice(0).forEach((n) => {
            n.release();
            if (this._tree) this._tree.quadTreePool.release(n);
        });
        this._items.forEach((item) => {
            this._tree.unmap(item.id);
        });
        this._items.clear();
        this._parent = undefined;
        this._level = 0;
        this._bounds.set(0, 0, 0, 0);
    }

    /**
     * Find the node contains specific item
     * @param item
     * @returns {*}
     */
    findItemBelongsTo(item: T): QTreeNode<T>|undefined {
        if (this._items.has(item)) { return this }
        else if (this._nodes[0]) {
            for (let i = 0; i < 4; i++) {
                let n = this._nodes[i].findItemBelongsTo(item);
                if (n) return n;
            }
        }
        return undefined;
    }

    /**
     * Remove the item
     * @param item
     * @returns {boolean}
     */
    removeItem(item: T) {
        if (this._items.has(item)) {
            this._items.delete(item);
            this._tree.unmap(item.id);
            return true;
        }
        for (let node of this._nodes) {
            if (node.removeItem(item)) { return true }
        }
        return false;
    }

    /**
     * Get all items which overlap the rect
     * @param items
     * @param rect
     * @param layer
     */
    find(items: Set<T>, rect: any, filter?: (o: T) => boolean) {
        if (this.overlap(rect)) {
            this._items.forEach((item) => {
                if (item.worldBounds.overlap(rect) && (!filter || (filter && filter(item)))) {
                    items.add(item);
                }
            });
            this._nodes.forEach(node => {
                node.find(items, rect, filter);
            });
        }
    }

    /**
     * Update item
     * @param item
     */
    update(item: T) {
        let n = this._tree.node(item.id) || this.findItemBelongsTo(item);
        if (n) {
            if (!n.contains(item)) {
                if (n.backToInsert(item)) {
                    if (n !== this._tree.node(item.id)) { n.removeItem(item) }
                }
                else if (this._tree) {
                    let b = item.worldBounds;
                    let minX = this._bounds.x < b.x ? this._bounds.x : b.x;
                    let minY = this._bounds.y < b.y ? this._bounds.y : b.y;
                    let maxX = this._bounds.right > b.right ? this._bounds.right : b.right;
                    let maxY = this._bounds.bottom > b.bottom ? this._bounds.bottom : b.bottom;
                    this._tree.resize(maxX - minX, maxY - minY, minX, minY);
                }
            }
        } else {
            this.insert(item);
        }
    }

    /**
     * Insert recursion from bottom to top.
     * @param item
     * @returns {*}
     */
    backToInsert(item: any): boolean {
        if (!this._parent) return false;
        if (!this._parent.insert(item)) {
            return this._parent.backToInsert(item);
        } else {
            return true;
        }
    }

    /**
     * Quad tree node overlap
     * @param rect
     * @returns {*}
     */
    overlap(item: IAABB2d|IOBB2d|QTreeNodeItem) {
        if (item.hasOwnProperty('worldBounds')) {
            return this._bounds.overlap((item as any).worldBounds);
        } else { return this._bounds.overlap(item as any) }
    }

    /**
     * It is contains rect
     * @param rect
     */
    contains(item: QTreeNodeItem) {
        return this._bounds.contains(item.worldBounds);
    }

    /**
     * Insert item
     * @param item
     * @returns {boolean}
     */
    insert(item: T) {
        if ((item.worldBounds.width === 0 || item.worldBounds.height === 0)) {
            return false;
        }
        if (this._nodes[0]) {
            let index = this.getIndex(item);
            if (index > -1) {
                if (this._nodes[index].insert(item)) { return true }
            }
        }
        this._items.add(item);
        this._tree.map(item.id, this);
        if (this._items.size > this.maxItems && this._level < QTree.MAX_LEVELS) {
            if (!this._nodes[0]) {
                this.split();
            }
            Array.from(this._items).forEach((i) => {
                let index = this.getIndex(i);
                if (index > -1) {
                    if (this._nodes[index].insert(i)) {
                        this._items.delete(i);
                    }
                }
            });
        }
        return true;
    }

    /**
     * Split space into four quadrant
     */
    split() {
        if (!this._tree) return;
        const halfW = this._bounds.width / 2;
        const halfH = this._bounds.height / 2;
        let l = this._level + 1;
        let child = this._tree.quadTreePool.obtain();
        child.initialize(this._tree, this._bounds.x + halfW, this._bounds.y, halfW, halfH, this.maxItems, l, this);
        this._nodes.push(child);

        child = this._tree.quadTreePool.obtain();
        child.initialize(this._tree, this._bounds.x, this._bounds.y, halfW, halfH, this.maxItems, l, this);
        this._nodes.push(child);

        child = this._tree.quadTreePool.obtain();
        child.initialize(this._tree, this._bounds.x, this._bounds.y + halfH, halfW, halfH, this.maxItems, l, this);
        this._nodes.push(child);

        child = this._tree.quadTreePool.obtain();
        child.initialize(this._tree, this._bounds.x + halfW, this._bounds.y + halfH, halfW, halfH, this.maxItems, l, this);
        this._nodes.push(child);
    }

    /**
     * Get the quadrant the rect stand.
     * @param item
     * @returns {number}
     */
    getIndex(item: QTreeNodeItem) {
        const rect = item.worldBounds;
        const verticalMid = this._bounds.y + this._bounds.height / 2;
        const horizontalMid = this._bounds.x + this._bounds.width / 2;
        const left = rect.x < horizontalMid && rect.right < horizontalMid;
        const top = rect.y < verticalMid && rect.bottom < verticalMid;
        let index = -1;
        if (left) {
            if (top) {
                index = 1;
            } else if (rect.y > verticalMid) {
                index = 2;
            }
        } else if (rect.x > horizontalMid) {
            if (top) {
                index = 0;
            } else if (rect.y > verticalMid) { index = 3 }
        }
        return index;
    }

    get parent() {
        return this._parent;
    }

    get bounds() {
        return this._bounds;
    }

    get nodes() {
        return this._nodes;
    }

    get allcount(): number {
        return this._items.size + this._nodes.reduce((a: number, n: QTreeNode<T>) => {
            return a + n.allcount;
        }, 0);
    }
}

export default class QTree<T extends QTreeNodeItem> {

    static MAX_LEVELS = 5;
    private _root: QTreeNode<T>;
    private _quadTreePool: Pool<QTreeNode<T>> = new Pool<QTreeNode<T>>(QTreeNode);
    private _dirtyBoundsItems: Set<T> = new Set<T>();
    private _itemMap: {[id: number]: QTreeNode<T>} = {};

    constructor(width: number, height: number, x?: number, y?: number) {
        this._root = this._quadTreePool.obtain();
        this._root.initialize(this, x || 0, y || 0, width, height, 5, 0);
    }

    resize(w: number, h: number, x?: number, y?: number) {
        const items: Array<T> = [];
        this._root.getAll(items);
        this._root.release();
        this.initialize(x || this._root.bounds.x, y || this._root.bounds.y, w, h, items);
    }

    /**
     * Initialize
     * @param bounds
     * @param items
     */
    initialize(x: number, y: number, width: number, height: number, items: Array<T>) {
        this._root.bounds.set(x, y, width, height);
        items.forEach((item) => {
            this.add(item);
        });
    }

    node(id: string) {
        return this._itemMap[id];
    }

    map(id: string, node: QTreeNode<T>) {
        this._itemMap[id] = node;
    }

    unmap(id: string) {
        delete this._itemMap[id];
    }

    add(item: T) {
        if (!this._root.contains(item)) {
            let b = item.worldBounds;
            let minX = this._root.bounds.x < b.x ? this._root.bounds.x : b.x;
            let minY = this._root.bounds.y < b.y ? this._root.bounds.y : b.y;
            let maxX = this._root.bounds.right > b.right ? this._root.bounds.right : b.right;
            let maxY = this._root.bounds.bottom > b.bottom ? this._root.bounds.bottom : b.bottom;
            this.resize(maxX - minX, maxY - minY, minX, minY);
        }
        this._root.insert(item);
    }

    remove(item: T) {
        this._root.removeItem(item);
        this._dirtyBoundsItems.delete(item);
    }

    update(item: T) {
        this._root.update(item);
    }

    find(items: Set<T>, rect: any, filter?: (o: T) => boolean) {
        this._root.find(items, rect, filter);
    }

    release() {
        this._root.release();
    }

    get bounds() {
        return this._root.bounds;
    }

    get quadTreePool() {
        return this._quadTreePool;
    }
}