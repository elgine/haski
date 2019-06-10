// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Sprite from './sprite';
import Texture from '../core/texture';
import Signal from '@core/signal';

export interface SpriteFrame{
    name?: string;
    region: IAABB2d;
    texture?: Texture;
}

export interface SpriteFrameGroup{
    name: string;
    frames: SpriteFrame[]|IAABB2d[];
    frameCount: number;
    texture?: Texture;
}

export default class Spritesheet extends Sprite {

    readonly onLoop: Signal = new Signal();
    readonly onFrameChange: Signal = new Signal();
    readonly onFrameEnd: Signal = new Signal();
    fps: number = 60;
    reverse: boolean = false;
    loop: boolean = false;
    private _groups: Dictionary<SpriteFrameGroup> = {};
    private _curGroup!: SpriteFrameGroup;
    private _time: number = 0;
    private _frameIndex: number = -1;
    private _running: boolean = false;
    private _finished: boolean = false;

    set(groups: SpriteFrameGroup[]) {
        groups.forEach((group) => this.addGroup(group));
    }

    addGroup(group: SpriteFrameGroup) {
        this._groups[group.name] = group;
    }

    tick(time: number) {
        time = time < 0 ? 0 : time;
        if (!this._curGroup) return;
        const msecPerFrame = 1000 / this.fps;
        const group = this._curGroup;
        this._time = time;
        let frameIndex = (~~(time / msecPerFrame));
        let loopEnd = frameIndex > group.frameCount;
        if (this.loop) {
            frameIndex %= group.frameCount;
            this._finished = false;
        } else if (frameIndex >= group.frameCount - 1) {
            frameIndex = group.frameCount - 1;
            this._finished = true;
            this.onFrameEnd.emit(this);
        }
        this._frameIndex = frameIndex;
        if (group.frames[this._frameIndex].hasOwnProperty('region')) {
            this.textureRegion.clone((group.frames[this._frameIndex] as any).region);
        } else {
            this.textureRegion.clone(group.frames[this._frameIndex] as any);
        }
        this.size.clone(this.textureRegion);
        this.setRenderDirty(true);
        this.onFrameChange.emit(this);
        if (loopEnd) {
            this.onLoop.emit(this);
        }
    }

    setGroup(name: string) {
        if ((this._curGroup && this._curGroup.name === name) || !this._groups[name]) return;
        this._curGroup = this._groups[name];
        this.reset();
        if (this._curGroup) {
            if (this._curGroup.frames[this._frameIndex].hasOwnProperty('region')) {
                this.textureRegion.clone((this._curGroup.frames[this._frameIndex] as any).region);
            } else {
                this.textureRegion.clone(this._curGroup.frames[this._frameIndex] as any);
            }
        }
        this.setRenderDirty(true);
    }

    update(dt: number) {
        this.tick(this._time + (this.reverse ? -1 : 1) * dt);
    }

    run() {
        this._running = true;
    }

    stop() {
        this._running = false;
    }

    reset() {
        this._time = 0;
        this._frameIndex = 0;
        this._finished = false;
    }

    get time() {
        return this._time;
    }

    get finished() {
        return this._finished;
    }

    get running() {
        return this._running;
    }

    get frameIndex() {
        return this._frameIndex;
    }

    get curGroup() {
        return this._curGroup;
    }
}