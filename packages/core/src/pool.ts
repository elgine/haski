// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import isConstructor from './isConstructor';

export default class Pool<T> {

    private _objs: Array<T> = [];
    private _activeCount: number = 0;
    private _freeCount: number = 0;
    private _constructor: any;
    private _isNativeConstructor: boolean = false;
    private _initializer?: (o: T, ...args: any[]) => void;
    private _finalizer?: (o: T) => void;

    constructor(constructor: any, initializer?: (o: T, ...args: any[]) => void, finalizer?: (o: T) => void) {
        this._constructor = constructor;
        this._isNativeConstructor = isConstructor(this._constructor);
        this._initializer = initializer;
        this._finalizer = finalizer;
    }

    newObj(): T {
        if (this._isNativeConstructor) {
            return new this._constructor();
        } else {
            return this._constructor();
        }
    }

    alloc(size: number) {
        this._objs.length = 0;
        for (let i = 0; i < size; i++) {
            this._objs.push(this.newObj());
        }
        this._activeCount = 0;
        this._freeCount = size;
        return this._objs.slice();
    }

    /**
     * Obtain an object from pool
     */
    obtain(...args: any[]): T {
        let o;
        if (this._freeCount > 0) {
            o = this._objs.shift() as T;
            this._freeCount--;
        } else {
            o = this.newObj();
        }
        this._initializer && this._initializer(o, args);
        this._activeCount++;
        this._objs.push(o);
        return o;
    }

    /**
     * Release obj
     * @param o
     */
    release(o: T) {
        let index = this._objs.indexOf(o);
        if (index > -1) {
            this._finalizer && this._finalizer(o);
            this._objs.splice(index, 1);
            this._activeCount--;
            this._objs.splice(this._freeCount++, 0, o);
        }
    }

    /**
     * Release all objects
     */
    releaseAll() {
        this._freeCount = this._objs.length;
        this._activeCount = 0;
    }

    /**
     * Clear all free objects
     */
    flush() {
        this._objs.splice(0, this._freeCount);
        this._freeCount = 0;
    }

    dispose() {
        this._freeCount = this._activeCount = 0;
        this._objs.length = 0;
    }

    get activeCount() {
        return this._activeCount;
    }

    /**
     * Get all active objects
     */
    get active(): T[] {
        return this._objs.slice(this._freeCount);
    }

    get count() {
        return this._activeCount + this._freeCount;
    }
}