// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import './wheelPolyfill';
import Pointer from './pointer';
import Emitter from '@core/emitter';

export interface ButtonState{
    button: number;
    down: boolean;
    downTimestamp: number;
    upTimestamp: number;
    duration: number;
}

const createButtonState = (button: number) => {
    return {
        button,
        down: false,
        downTimestamp: 0,
        upTimestamp: 0,
        duration: 0
    };
};

export default class Mouse extends Emitter {


    public readonly lastPointer: Pointer = new Pointer();
    public readonly pointer: Pointer = new Pointer();
    public readonly lastButtonState: ButtonState[] = [];
    public readonly buttonState: ButtonState[] = [];

    public lastWheel: number = 0;
    public wheel: number = 0;

    private _el?: HTMLElement;

    constructor() {
        super();
        for (let i = 0; i < 5; i++) {
            this.lastButtonState[i] = createButtonState(i);
            this.buttonState[i] = createButtonState(i);
        }
        this._onMousedown = this._onMousedown.bind(this);
        this._onMousemove = this._onMousemove.bind(this);
        this._onMouseup = this._onMouseup.bind(this);
        this._onWheel = this._onWheel.bind(this);
    }

    update() {
        for (let button in this.buttonState) {
            this.lastButtonState[button] = Object.assign(this.lastButtonState[button], this.buttonState[button]);
        }
        this.lastPointer.clone(this.pointer);
        this.lastWheel = this.wheel;
    }

    initialize(el: HTMLElement) {
        if (this._el) {
            this.uninitialize();
        }
        this._el = el;
        this._el.addEventListener('mousedown', this._onMousedown);
        this._el.addEventListener('mousemove', this._onMousemove);
        this._el.addEventListener('mouseup', this._onMouseup);
        this._el.addEventListener('wheel', this._onWheel);
    }

    uninitialize() {
        if (this._el) {
            this._el.removeEventListener('mousedown', this._onMousedown);
            this._el.removeEventListener('mousemove', this._onMousemove);
            this._el.removeEventListener('mouseup', this._onMouseup);
            this._el.removeEventListener('wheel', this._onWheel);
        }
    }

    private _onWheel(e: WheelEvent) {
        // Firefox
        if (e.detail) {
            this.wheel = -e.detail / 3;
        } else if ((e as any).wheelDelta) {
            this.wheel = (e as any).wheelDelta / 120;
        } else {
            this.wheel = 0;
        }
    }

    private _onMousedown(e: MouseEvent) {
        this.buttonState[e.button].down = true;
        this.buttonState[e.button].downTimestamp = Date.now();
        this.buttonState[e.button].duration = 0;
        this.pointer.down(e);
    }

    private _onMousemove(e: MouseEvent) {
        this.pointer.move({ x: e.pageX, y: e.pageY });
    }

    private _onMouseup(e: MouseEvent) {
        this.buttonState[e.button].down = false;
        this.buttonState[e.button].upTimestamp = Date.now();
        this.buttonState[e.button].duration = this.buttonState[e.button].upTimestamp - this.buttonState[e.button].downTimestamp;
        this.pointer.up(e);
    }
}