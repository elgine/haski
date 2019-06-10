// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import RenderObject from './renderObject';
import QTree from '@utils/qTree';

export default class SpatialManager {

    private _qTree: QTree<RenderObject>;
    private _dirtyNodes: Set<RenderObject>;

    constructor(width: number = 5000, height: number = 5000, x: number = -2500, y: number = -2500) {
        this._qTree = new QTree(width, height, x, y);
        this._dirtyNodes = new Set<RenderObject>();
    }

    onNodeAdded(node: RenderObject) {
        this._qTree.add(node);
    }

    onNodeRemoved(node: RenderObject) {
        this._qTree.remove(node);
    }

    onNodeWorldBoundDirty(node: RenderObject) {
        this._dirtyNodes.add(node);
    }

    findNodesOverlapRect(nodeSet: Set<RenderObject>, rect: IAABB2d|IOBB2d, filter?: (v: RenderObject) => boolean) {
        this.update();
        this._qTree.find(nodeSet, rect, filter);
    }

    update() {
        this._dirtyNodes.forEach((n) => {
            this._qTree.update(n);
        });
        this._dirtyNodes.clear();
    }

    release() {
        this._qTree.release();
        this._dirtyNodes.clear();
    }
}