// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Pool from '@core/pool';
import { AABB2d } from '@maths/bounds';

export default class DirtyRectCollector {

    /**
     * Keep overlap situation of corners
     */
    private _cornerInfo = {
        x1y1: false,
        x1y2: false,
        x2y1: false,
        x2y2: false,
        count: 0
    };

    private _dirtyRegions: Array<AABB2d> = [];

    /**
     * The index of those regions which contain
     * in new region
     */
    private _indices: Array<number> = [];

    /**
     * Pool aabb objects to reduce gc frequency
     */
    private _regionPool: Pool<AABB2d> = new Pool<AABB2d>(AABB2d);

    /**
     * Add a dirty region
     * @param r
     */
    addRegion(r: AABB2d) {
        this._indices.length = 0;
        let region = this._regionPool.obtain().clone(r); let
            rect;
        const rectangleLen = this._dirtyRegions.length;
        for (let index = 0; index < rectangleLen; index++) {
            rect = this._dirtyRegions[index];
            if (rect.overlap(region)) {
                switch (this._cornerInside(rect, region)) {
                    case 4:
                    case 3:
                        return;
                    case 2:
                        this._shrink(rect, region);
                        break;
                    case 1:
                        switch (this._cornerInside(region, rect)) {
                            case 1:
                                rect.union(region);
                                return;
                            case 2:
                                this._shrink(region, rect);
                                break;
                            case 4:
                                this._indices.unshift(index);
                                break;
                        }
                        break;
                    case 0:
                        switch (this._cornerInside(region, rect)) {
                            case 4:
                                this._indices.unshift(index);
                                break;
                            case 2:
                                this._shrink(region, rect);
                                break;
                            case 3:
                            case 1:
                                return;
                        }
                }
            }
        }

        this._removeIncides();
        this._dirtyRegions.push(region);
    }

    reset() {
        this._dirtyRegions.forEach((r) => {
            r.reset();
            this._regionPool.release(r);
        });
        this._dirtyRegions.length = 0;
    }

    private _removeIncides() {
        this._indices.forEach((index) => {
            this._dirtyRegions[index].reset();
            this._regionPool.release(this._dirtyRegions[index]);
            this._dirtyRegions.splice(index, 1);
        });
    }

    private _resetCornerInfo() {
        this._cornerInfo.x1y1 = false;
        this._cornerInfo.x1y2 = false;
        this._cornerInfo.x2y1 = false;
        this._cornerInfo.x2y2 = false;
        this._cornerInfo.count = 0;
    }

    private _cornerInside(a: AABB2d, b: AABB2d): number {
        this._resetCornerInfo();
        if (b.x >= a.x && b.x <= a.right) {
            if (b.y >= a.y && b.y <= a.bottom) {
                this._cornerInfo.x1y1 = true;
                this._cornerInfo.count++;
            }
            if (b.bottom >= a.y && b.bottom <= a.bottom) {
                this._cornerInfo.x1y2 = true;
                this._cornerInfo.count++;
            }
        }

        if (b.right >= a.x && b.right <= a.right) {
            if (b.y >= a.y && b.y <= a.bottom) {
                this._cornerInfo.x2y1 = true;
                this._cornerInfo.count++;
            }

            if (b.bottom >= a.y && b.bottom <= a.bottom) {
                this._cornerInfo.x2y2 = true;
                this._cornerInfo.count++;
            }
        }
        return this._cornerInfo.count;
    }

    private _shrink(containing: AABB2d, contained: AABB2d) {
        // The x1, y1 and x2, y1 corner of contained.
        if (this._cornerInfo.x1y1 && this._cornerInfo.x2y1) {
            contained.height -= containing.bottom - contained.y;
            contained.y = containing.bottom;
            return;
        }

        // The x1, y1 and x1, y2 corner of contained.
        if (this._cornerInfo.x1y1 && this._cornerInfo.x1y2) {
            contained.width -= containing.right - contained.x;
            contained.x = containing.right;
            return;
        }

        // The x1, y2 and x2, y2 corner of contained.
        if (this._cornerInfo.x1y2 && this._cornerInfo.x2y2) {
            contained.height = containing.y - contained.y;
            return;
        }

        // The x2, y1 and x2, y2 corner of contained.
        if (this._cornerInfo.x2y1 && this._cornerInfo.x2y2) {
            contained.width = containing.x - contained.x;
            return;
        }
    }

    get dirtyRegions() {
        return this._dirtyRegions;
    }
}