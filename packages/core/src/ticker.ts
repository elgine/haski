// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

const requestAnimationFrame = (function() {
    if (window) {
        return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                function(callback: Function) {
                    return window.setTimeout(callback, 1000 / 60);
                };
    } else { return function(callback: Function) {
        return setTimeout(callback, 1000 / 60);
    }; }
})();

const cancelAnimationFrame = (function() {
    if (window) {
        return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout;
    } else {
        return clearTimeout;
    }
})();

/**
 * Simple ticker
 * @class Ticker
 */
export default class Ticker {

    /**
     * Tick fps
     * @type {number}
     */
    private _fps: number = 60;

    private _intervalPerSec: number = 1000 / 60;

    private _tickTime: number;

    private _tickerId: number = -1;

    /**
     * Time-stamp from start time-stamp
     * @type {Number}
     * @private
     */
    private _t: number;

    /**
     * Start time-stamp
     * @type {Number}
     * @private
     */
    private _st: number;

    /**
     * Last time-stamp
     * @type {Number}
     * @private
     */
    private _lt: number;

    /**
     * Delta time-stamp
     * @type {Number}
     * @private
     */
    private _dt: number;

    /**
     * Current time-stamp
     * @type {Number}
     * @private
     */
    private _ct: number;

    /**
     * Callback fun
     * @type {Function}
     * @private
     */
    private _cb: Function|null;

    private _isRunning: boolean;

    constructor() {
        this.fps = 60;
        this._t = 0;
        this._st = -1;
        this._lt = 0;
        this._dt = 0;
        this._ct = 0;
        this._tickTime = 0;
        this._cb = null;
        this._isRunning = false;
        this._run = this._run.bind(this);
    }

    reset() {
        this._st = -1;
    }

    run() {
        if (this._isRunning) return;
        this._isRunning = true;
        if (!this._st) {
            this._st = Date.now();
        }
        this._lt = Date.now();
        this._run();
    }

    _run() {
        this._ct = Date.now();
        this._dt = this._ct - this._lt;
        this._t = this._ct - this._st;
        this._lt = this._ct;
        this._tickTime += this._dt;
        if (this._tickTime > this._intervalPerSec) {
            this._isRunning && this._cb && this._cb(this);
            this._tickTime -= this._intervalPerSec;
        }
        if (this._isRunning) { this._tickerId = requestAnimationFrame(this._run) }
    }

    stop() {
        this._isRunning = false;
        cancelAnimationFrame(this._tickerId);
    }

    get isRunning() {
        return this._isRunning;
    }

    get fps(): number {
        return this._fps;
    }

    set fps(v: number) {
        if (this._fps !== v) {
            this._fps = v;
            this._intervalPerSec = 1 / this._fps;
        }
    }

    set cb(f: Function) {
        this._cb = f;
    }

    get t(): number {
        return this._t;
    }

    get dt(): number {
        return this._dt;
    }

    get st(): number {
        return this._st;
    }

    get ct(): number {
        return this._ct;
    }
}