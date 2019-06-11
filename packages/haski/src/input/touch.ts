// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Emitter from '@core/emitter';
import TouchPointer from './touchPointer';

export default class Touch extends Emitter {

    public readonly maxTouchCount: number = 10;
    public lastPointerStates: TouchPointer[] = [];
    public pointerStates: TouchPointer[] = [];
    public activeTouchCount: number = 0;
    private _el?: HTMLElement;

    constructor(maxTouchCount: number = 10) {
        super();
        this.maxTouchCount = maxTouchCount;
    }

    update() {
        for (let i = 0; i < this.maxTouchCount; i++) {
            if (!this.lastPointerStates[i]) {
                this.lastPointerStates[i] = new TouchPointer(i);
            }
            this.lastPointerStates[i].clone(this.pointerStates[i]);
        }
    }

    initialize(el: HTMLElement) {
        if (this._el === el) return;
        this.uninitialize();
        this._el = el;
        this._el.addEventListener('touchstart', this._onTouchstart);
        this._el.addEventListener('touchmove', this._onTouchmove);
        this._el.addEventListener('touchend', this._onTouchend);
    }

    uninitialize() {
        if (this._el) {
            this._el.removeEventListener('touchstart', this._onTouchstart);
            this._el.removeEventListener('touchmove', this._onTouchmove);
            this._el.removeEventListener('touchend', this._onTouchend);
        }
        this._el = undefined;
    }

    private _setTouchState(touch: any, touchPointer: TouchPointer) {
        touchPointer.force = touch.force;
        touchPointer.radiusX = touch.radiusX;
        touchPointer.radiusY = touch.radiusY;
        touchPointer.rotationAngle = touch.rotationAngle;
    }

    private _onTouchstart(e: TouchEvent) {
        if (!e.touches) return;
        const touchCount = e.touches.length;
        for (let i = 0; i < touchCount; i++) {
            if (!this.pointerStates[i]) this.pointerStates[i] = new TouchPointer(i);
            let touchPointer = this.pointerStates[i];
            let touch = e.touches[i];
            this._setTouchState(touch, touchPointer);
            touchPointer.down({ x: touch.clientX, y: touch.clientY });
        }
        this.activeTouchCount = touchCount;
    }

    private _onTouchmove(e: TouchEvent) {
        if (!e.touches) return;
        const touchCount = e.touches.length;
        for (let i = 0; i < touchCount; i++) {
            if (!this.pointerStates[i]) this.pointerStates[i] = new TouchPointer(i);
            let touchPointer = this.pointerStates[i];
            let touch = e.touches[i];
            this._setTouchState(touch, touchPointer);
            touchPointer.move({ x: touch.clientX, y: touch.clientY });
        }
        this.activeTouchCount = touchCount;
    }

    private _onTouchend(e: TouchEvent) {
        if (!e.touches) return;
        const touchCount = e.touches.length;
        for (let i = 0; i < touchCount; i++) {
            if (!this.pointerStates[i]) this.pointerStates[i] = new TouchPointer(i);
            let touchPointer = this.pointerStates[i];
            let touch = e.touches[i];
            this._setTouchState(touch, touchPointer);
            touchPointer.up({ x: touch.clientX, y: touch.clientY });
        }
        this.activeTouchCount = touchCount;
    }
}