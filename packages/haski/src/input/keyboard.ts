// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Emitter from '@core/emitter';

export interface KeyState{
    keyCode: number;
    down: boolean;
    ctrl: boolean;
    alt: boolean;
    shift: boolean;
    downTimestamp: number;
    upTimestamp: number;
    duration: number;
}

export default class Keyboard extends Emitter {
    static BACK_SPACE: number = 8;
    static TAB: number = 9;
    static CLEAR: number = 12;
    static ENTER: number = 13;
    static LEFT_SHIFT: number = 16;
    static LEFT_CONTROL: number = 17;
    static LEFT_ALT: number = 18;
    static PAUSE: number = 19;
    static CAPS_LOCK: number = 20;
    static ESC: number = 27;
    static SPACE: number = 32;
    static PRIOR: number = 33;
    static NEXT: number = 24;
    static END: number = 35;
    static HOME: number = 36;
    static LEFT: number = 37;
    static UP: number = 38;
    static RIGHT: number = 39;
    static DOWN: number = 40;
    static SELECT: number = 41;
    static PRINT: number = 42;
    static EXECUTE: number = 43;
    static INSERT: number = 45;
    static DELETE: number = 46;
    static HELP: number = 47;
    static 0: number = 48;
    static 1: number = 49;
    static 2: number = 50;
    static 3: number = 51;
    static 4: number = 52;
    static 5: number = 53;
    static 6: number = 54;
    static 7: number = 55;
    static 8: number = 56;
    static 9: number = 57;
    static A: number = 65;
    static B: number = 66;
    static C: number = 67;
    static D: number = 68;
    static E: number = 69;
    static F: number = 70;
    static G: number = 71;
    static H: number = 72;
    static I: number = 73;
    static J: number = 74;
    static K: number = 75;
    static L: number = 76;
    static M: number = 77;
    static N: number = 78;
    static O: number = 79;
    static P: number = 80;
    static Q: number = 81;
    static R: number = 82;
    static S: number = 83;
    static T: number = 84;
    static U: number = 85;
    static V: number = 86;
    static W: number = 87;
    static X: number = 88;
    static Y: number = 89;
    static Z: number = 90;
    static F1: number = 112;
    static F2: number = 113;
    static F3: number = 114;
    static F4: number = 115;
    static F5: number = 116;
    static F6: number = 117;
    static F7: number = 118;
    static F8: number = 119;
    static F9: number = 120;
    static F10: number = 121;
    static F11: number = 122;
    static F12: number = 123;

    public lastKeyState: {[keycode: number]: KeyState} = {};
    public keyState: {[keycode: number]: KeyState} = {};
    private _el?: HTMLElement;

    constructor(el?: HTMLElement) {
        super();
        if (el) this.initialize(el);
        this._onKeydown = this._onKeydown.bind(this);
        this._onKeyup = this._onKeyup.bind(this);
    }

    update() {
        for (let k in this.keyState) {
            let keyCode = parseInt(k);
            this.lastKeyState[keyCode] = Object.assign(this.lastKeyState[keyCode], this.keyState[keyCode]);
        }
    }

    initialize(el: HTMLElement) {
        if (this._el) {
            this.uninitialize();
        }
        this._el = el;
        this._el.addEventListener('keydown', this._onKeydown);
        this._el.addEventListener('keyup', this._onKeyup);
    }

    uninitialize() {
        if (this._el) {
            this._el.removeEventListener('keydown', this._onKeydown);
            this._el.removeEventListener('keyup', this._onKeyup);
        }
    }

    private _createNewState(keyCode: number): KeyState {
        return {
            keyCode,
            down: false,
            downTimestamp: 0,
            upTimestamp: 0,
            ctrl: false,
            alt: false,
            shift: false,
            duration: 0
        };
    }

    private _makesureKeyStateExists(keyCode: number) {
        if (!this.lastKeyState[keyCode]) {
            this.lastKeyState[keyCode] = this._createNewState(keyCode);
        }
        if (!this.keyState[keyCode]) {
            this.keyState[keyCode] = this._createNewState(keyCode);
        }
    }

    private _onKeydown(e: KeyboardEvent) {
        this._makesureKeyStateExists(e.keyCode);
        let state = this.keyState[e.keyCode];
        state.downTimestamp = Date.now();
        state.duration = 0;
        state.alt = e.altKey;
        state.ctrl = e.ctrlKey;
        state.shift = e.shiftKey;
        state.down = true;
    }

    private _onKeyup(e: KeyboardEvent) {
        this._makesureKeyStateExists(e.keyCode);
        let state = this.keyState[e.keyCode];
        state.upTimestamp = Date.now();
        state.duration = 0;
        state.alt = e.altKey;
        state.ctrl = e.ctrlKey;
        state.shift = e.shiftKey;
        state.down = false;
    }
}