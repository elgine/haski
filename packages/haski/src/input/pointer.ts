// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Emitter from '@core/emitter';

export default class Pointer extends Emitter {

    static DOWN: string = 'down';
    static MOVE: string = 'move';
    static UP: string = 'up';

    public enable: boolean = true;

    /**
     * Current position
     */
    public curX: number = 0;
    public curY: number = 0;

    /**
     * Previous position
     */
    public lastX: number = 0;
    public lastY: number = 0;

    /**
     * Mousedown position
     */
    public downX: number = 0;
    public downY: number = 0;

    /**
     * Delta value between last position and current position
     */
    public deltaX: number = 0;
    public deltaY: number = 0;

    /**
     * Delta value between mousedown position and current position
     * Only validated in drag mode
     */
    public moveX: number = 0;
    public moveY: number = 0;

    /**
     * Timestamp information for drag mode
     */
    public duration: number = 0;
    public downTimestamp: number = 0;
    public upTimestamp: number = 0;

    /**
     * Has mouse down?
     */
    public hasDowned: boolean = false;

    clone(p: Pointer) {
        for (let k in p) {
            (this)[k] = (p)[k];
        }
    }

    handleMove(e: {x: number; y: number}) {
        this.lastX = this.curX;
        this.lastY = this.curY;
        this.curX = e.x;
        this.curY = e.y;
        this.deltaX = this.curX - this.lastX;
        this.deltaY = this.curY - this.lastY;
        if (this.hasDowned) {
            this.moveX = this.curX - this.downX;
            this.moveY = this.curY - this.downY;
        }
    }

    down(e: {x: number; y: number}) {
        if (!this.enable || this.hasDowned) return;
        this.hasDowned = true;
        this.downTimestamp = Date.now();
        this.duration = 0;
        this.moveX = 0;
        this.moveY = 0;
        this.downX = e.x;
        this.downY = e.y;
        this.handleMove(e);
        this.emit(Pointer.DOWN, this);
    }

    move(e: {x: number; y: number}) {
        if (!this.enable) return;
        this.handleMove(e);
        this.emit(Pointer.MOVE, this);
    }

    up(e: {x: number; y: number}) {
        if (!this.enable || !this.hasDowned) return;
        this.handleMove(e);
        if (this.hasDowned) {
            this.upTimestamp = Date.now();
            this.duration = this.upTimestamp - this.downTimestamp;
            this.hasDowned = false;
        }
        this.emit(Pointer.UP, this);
    }
}