// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import RenderObject from '../../core/renderObject';
import Emitter from '@core/emitter';
import { IArmatureProxy, Armature, EventStringType, EventObject } from 'dragonBones';

export default class ArmatureDisplay extends RenderObject implements IArmatureProxy {

    private _armature!: Armature;
    private _emitter: Emitter = new Emitter();

    dbInit(armature: Armature) {
        this._armature = armature;
    }

    dbClear() {
        this._armature = null as any;
    }

    dbUpdate() {}

    dispose(disposeProxy: boolean = true) {
        // eslint-disable-next-line no-unused-expressions
        disposeProxy;
        if (this._armature !== null) {
            this._armature.dispose();
            this._armature = null as any;
        }
    }

    dispatchDBEvent(type: EventStringType, obj: EventObject) {
        this._emitter.emit(type, obj);
    }

    addDBEventListener(type: EventStringType, listener: Function) {
        this._emitter.on(type, listener);
    }

    removeDBEventListener(type: EventStringType, listener: Function) {
        this._emitter.off(type, listener);
    }

    hasDBEventListener(type: EventStringType) {
        return this._emitter.has(type);
    }

    get armature() {
        return this._armature;
    }

    get animation() {
        return this._armature.animation;
    }
}