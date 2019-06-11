// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Emitter from '@core/emitter';
import Mouse from './mouse';
import Keyboard from './keyboard';
import Touch from './touch';
import supportTouch from '@utils/supportTouch';

export enum Device{
    MOUSE,
    KEYBOARD,
    TOUCH
}

export interface Key{
    type: Device;
    keyCode: number;
}

export default class Input extends Emitter {

    public mouse!: Mouse;
    public keyboard!: Keyboard;
    public touch!: Touch;
    private _actions: {[name: string]: Key[]} = {};

    constructor(el?: HTMLElement) {
        super();
        if (supportTouch()) {
            this.touch = new Touch();
        } else {
            this.mouse = new Mouse();
            this.keyboard = new Keyboard();
        }
        if (el) this.initialize(el);
    }

    getActionEarlyTriggerTime(action: string) {
        let min = Number.MAX_VALUE;
        if (this._actions[action]) {
            this._actions[action].forEach((key) => {
                if (key.type === Device.MOUSE) {
                    if (this.mouse.buttonState[key.keyCode].down) {
                        let timestamp = this.mouse.buttonState[key.keyCode].downTimestamp;
                        if (min > timestamp) {
                            min = timestamp;
                        }
                    }
                } else if (key.type === Device.KEYBOARD) {
                    if (this.keyboard.keyState[key.keyCode] && this.keyboard.keyState[key.keyCode].down) {
                        let timestamp = this.keyboard.keyState[key.keyCode].downTimestamp;
                        if (min > timestamp) {
                            min = timestamp;
                        }
                    }
                }
            });
        }
        return min;
    }

    getActionKeys(action: string) {
        return this._actions[action];
    }

    getTypeActionKey(action: string, type: number) {
        if (!this._actions[action]) return;
        return this._actions[action].find(k => k.type === type);
    }

    /**
     * Bind input action
     * @param action
     * @param key
     */
    registerAction(action: string, key: Key|Key[]) {
        if (!this._actions[action]) {
            this._actions[action] = [];
        }
        if (Array.isArray(key)) {
            key.forEach((k1) => {
                if (!this._actions[action].some((k2) => {
                    return k1.type === k2.type && k1.keyCode === k2.keyCode;
                })) { this._actions[action].push(k1) }
            });
        } else {
            this._actions[action].push(key);
        }
    }

    /**
     * Unbind input action
     * @param action
     * @param key
     */
    unregisterAction(action: string, key?: Key|Key[]) {
        if (this._actions[action]) {
            if (key) {
                if (Array.isArray(key)) {
                    const copy = this._actions[action].slice();
                    key.forEach((k) => {
                        let index = copy.indexOf(k);
                        if (index > -1) {
                            this._actions[action].splice(index, 1);
                        }
                    });
                } else {
                    let index = this._actions[action].indexOf(key);
                    if (index > -1) {
                        this._actions[action].splice(index, 1);
                    }
                }
            } else {
                this._actions[action].length = 0;
            }
        }
    }

    update() {
        this.mouse && this.mouse.update();
        this.keyboard && this.keyboard.update();
        this.touch && this.touch.update();
    }

    wasActive(action: string) {
        if (!this._actions[action]) return;
        return this._actions[action].some((key) => {
            if (key.type === Device.MOUSE) {
                return this.mouse !== undefined && this.mouse.lastButtonState[key.keyCode] && this.mouse.lastButtonState[key.keyCode].down;
            } else if (key.type === Device.KEYBOARD) {
                return this.keyboard !== undefined && this.keyboard.lastKeyState[key.keyCode] && this.keyboard.lastKeyState[key.keyCode].down;
            } else if (key.type === Device.TOUCH) {
                return this.touch !== undefined && this.touch.lastPointerStates[key.keyCode] && this.touch.lastPointerStates[key.keyCode].hasDowned;
            }
            return false;
        });
    }

    /**
     * Check action is active?
     * @param action
     */
    isActive(action: string) {
        if (!this._actions[action]) return false;
        return this._actions[action].some((key) => {
            if (key.type === Device.MOUSE) {
                return this.mouse && this.mouse.buttonState[key.keyCode].down;
            } else if (key.type === Device.KEYBOARD) {
                return this.keyboard && this.keyboard.keyState[key.keyCode] && this.keyboard.keyState[key.keyCode].down;
            } else if (key.type === Device.TOUCH) {
                return this.touch && this.touch.pointerStates[key.keyCode] && this.touch.pointerStates[key.keyCode].hasDowned;
            }
            return false;
        });
    }

    initialize(el: HTMLElement) {
        this.mouse && this.mouse.initialize(el);
        this.keyboard && this.keyboard.initialize(document.body);
        this.touch && this.touch.initialize(el);
    }

    uninitialize() {
        this.mouse && this.mouse.uninitialize();
        this.keyboard && this.keyboard.uninitialize();
        this.touch && this.touch.uninitialize();
    }
}