// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Pool from '@core/pool';
import Color from '@maths/color';
import { sgn } from '@utils/sgn';
import Vector2d from '@maths/vector2d';
import Transform2d from '@maths/transform2d';
import { AABB2d } from '@maths/bounds';
import clamp from '@maths/clamp';
import Texture from '../../core/texture';
import RenderObject from '../../core/renderObject';

export interface RandomValueParams<T>{
    delta: T;
    value: T;
}

export interface TimelineValue<T>{
    time: number;
    value: T;
}

export interface TimelineValueParams<T> extends TimelineValue<T>{
    delta: T;
}

export interface ParticleEmitterParams{
    life: RandomValueParams<number>;
    angle: RandomValueParams<number>;
    radialAccel: TimelineValueParams<number>[];
    tangentialAccel: TimelineValueParams<number>[];
    size: RandomValueParams<number>;
    position: number[];
    speed: RandomValueParams<number>;
    scale: TimelineValueParams<number>[];
    rotation: TimelineValueParams<number>[];
    color: TimelineValueParams<RGBA>[];
    emissionCounter: number;
    emissionRate: number;
    gravity: number[];
    maxCount: number;
    duration: number;
    additive: boolean;
    texture?: Texture;
    texBounds?: IAABB2d;
}

const cloneParticleEmitterParmas = (source: AnyOf<ParticleEmitterParams>, dest: ParticleEmitterParams) => {
    for (let key in source) {
        if ((source as any)[key] !== undefined) { (dest as any)[key] = (source as any)[key] }
    }
};

const numberValueGenerator = (v: RandomValueParams<number>) => {
    return v.value + (v.delta || 0) * random1();
};

const colorValueGenerator = (v: RandomValueParams<RGBA>) => {
    let seed = random1();
    return v.value.map((cItem, i) => {
        return cItem + (v.delta ? v.delta[i] : 0) * seed;
    });
};

const generateTimelineValueArr = <T>(timeline: TimelineValueParams<T>[], valueGenerator: (v: RandomValueParams<T>) => T): TimelineValue<T>[] => {
    return timeline.map((item) => {
        return {
            value: valueGenerator(item),
            time: item.time
        };
    });
};

const findTimelineValueIndex = <T>(timeline: TimelineValue<T>[], time: number) => {
    return timeline.findIndex((v) => v.time >= time);
};

const colorInterpoaltor = (from: TimelineValue<RGBA>, to: TimelineValue<RGBA>, time: number, out?: RGBA) => {
    out = out || [0, 0, 0, 1];
    out[0] = clamp(0, 255, from.value[0] + (to.value[0] - from.value[0]) * time);
    out[1] = clamp(0, 255, from.value[1] + (to.value[1] - from.value[1]) * time);
    out[2] = clamp(0, 255, from.value[2] + (to.value[2] - from.value[2]) * time);
    out[3] = clamp(0, 1, from.value[3] + (to.value[3] - from.value[3]) * time);
    return out;
};

const numberInterpolator = (from: TimelineValue<number>, to: TimelineValue<number>, time: number) => {
    return from.value + (to.value - from.value) * time;
};

type ParticleParamInterpolator<T> = (from: TimelineValue<T>, to: TimelineValue<T>, time: number, out?: T) => T;

const interpolateTimelineValueArr = <T>(timeline: TimelineValue<T>[], time: number, interpoaltor: ParticleParamInterpolator<T>, out?: T) => {
    let to = findTimelineValueIndex(timeline, time);
    let from = to > 0 ? to - 1 : to;
    if (from === to) {
        if (from === -1) return timeline[0] ? timeline[0].value : null;
        return timeline[to].value;
    } else {
        return interpoaltor(timeline[from], timeline[to], time, out);
    }
};

const random1 = () => {
    return sgn(Math.random(), 0.5) * Math.random();
};

export class Particle extends Transform2d {

    public width: number = 0;
    public height: number = 0;
    public maxLife: number = 0;
    public life: number = 0;
    public speed: number = 0;
    public color: RGBA = [0, 0, 0, 1];
    public radialAccelList: TimelineValue<number>[] = [];
    public tangentialAccelList: TimelineValue<number>[] = [];
    public scaleList: TimelineValue<number>[] = [];
    public rotationList: TimelineValue<number>[] = [];
    public colorList: TimelineValue<RGBA>[] = [];

    reset() {
        super.reset();
        Color.reset(this.color);
        this.width = this.height = 0;
        this.maxLife = this.life = 0;
        this.speed = 0;
        this.radialAccelList = [];
        this.tangentialAccelList = [];
        this.scaleList = [];
        this.rotationList = [];
        this.colorList = [];
    }
}

export default class ParticleEmitter extends RenderObject {
    public readonly type: string = 'particleEmitter';
    public params: ParticleEmitterParams = {
        position: [0, 0],
        speed: {
            value: 0,
            delta: 0
        },
        rotation: [],
        color: [],
        scale: [],
        angle: {
            delta: 0,
            value: 0
        },
        radialAccel: [],
        tangentialAccel: [],
        size: {
            delta: 0,
            value: 10
        },
        life: {
            value: 1000,
            delta: 0
        },
        emissionRate: 1000,
        emissionCounter: 500,
        gravity: [0, 0],
        maxCount: 300,
        duration: 1000,
        additive: false,
        texture: undefined,
        texBounds: undefined
    };

    private _particlePool: Pool<Particle> = new Pool(Particle);

    private _time: number = 0;
    private _duration: number = 1000;
    private _emissionRate: number = 100;
    private _emissionCounter: number = 500;
    private _maxCount: number = 300;
    private _gravity: number[] = [0, 0];
    private _running: boolean = false;
    private _finished: boolean = false;
    private _direction: number[] = [0, 0];
    private _radial: number[] = [0, 0];
    private _tangential: number[] = [0, 0];
    private _force: number[] = [0, 0];

    constructor() {
        super();
        this.reset();
    }

    reset() {
        this._time = 0;
        this._emissionCounter = this.params.emissionCounter;
        this._emissionRate = this.params.emissionRate;
        this._duration = this.params.duration;
        this._maxCount = this.params.maxCount;
        Vector2d.clone(this.params.gravity, this._gravity);
        Vector2d.reset(this._direction);
        Vector2d.reset(this._force);
        Vector2d.reset(this._tangential);
        Vector2d.reset(this._radial);
    }

    set(params: AnyOf<ParticleEmitterParams>) {
        cloneParticleEmitterParmas(params, this.params);
        this._emissionCounter = this.params.emissionCounter;
        this._emissionRate = this.params.emissionRate;
        this._duration = this.params.duration;
        this._maxCount = this.params.maxCount;
        Vector2d.clone(this.params.gravity, this._gravity);
    }

    tick(dt: number) {
        if (!this._running) return;
        let sec = dt * 0.001; let
            rate = 1000 / this._emissionRate;
        if (this._particlePool.activeCount < this._maxCount) {
            this._emissionCounter += dt;
        }
        if (this._duration !== -1 && this._time > this._duration && this._particlePool.activeCount <= 0) {
            this.stop();
            return;
        }
        while (this._particlePool.activeCount < this._maxCount && this._emissionCounter > rate &&
            (this._duration === -1 || (this._duration !== -1 && this._time < this._duration))) {
            this._createParticle();
            this._emissionCounter -= rate;
        }
        this._time += dt;
        let velocity: Vec2d = [0, 0];
        let p = 0;
        this._particlePool.active.forEach((particle: Particle, i) => {
            if (particle.life > 0) {
                p = 1 - particle.life / particle.maxLife;
                let radialAccel = interpolateTimelineValueArr(particle.radialAccelList, p, numberInterpolator) || 0;
                let tangentialAccel = interpolateTimelineValueArr(particle.tangentialAccelList, p, numberInterpolator) || 0;
                this._direction[0] = particle.tx;
                this._direction[1] = particle.ty;
                Vector2d.normalize(this._direction);
                Vector2d.mul(Vector2d.clone(this._direction, this._radial), radialAccel);
                Vector2d.clone(this._radial, this._tangential);
                let newY = this._tangential[0];
                this._tangential[0] = -this._tangential[1];
                this._tangential[1] = newY;
                Vector2d.mul(this._tangential, tangentialAccel);
                Vector2d.mul(Vector2d.normalize(Vector2d.add(Vector2d.add(Vector2d.clone(this._radial, this._force), this._tangential), this._gravity)), particle.speed, velocity);
                particle.tx += velocity[0] * sec;
                particle.ty += velocity[1] * sec;

                let scale = interpolateTimelineValueArr(particle.scaleList, p, numberInterpolator);
                if (scale) {
                    particle.sx = scale;
                    particle.sy = scale;
                }
                let rotation = interpolateTimelineValueArr(particle.rotationList, p, numberInterpolator);
                if (rotation) {
                    particle.r = rotation;
                }
                interpolateTimelineValueArr(particle.colorList, p, colorInterpoaltor, particle.color);
                particle.life -= dt;
            } else {
                this._destroyParticle(particle);
            }
        });
        this.setLocalBoundsDirty(true);
        this.setRenderDirty(true);
    }

    run() {
        if (this._running) return;
        this._running = true;
    }

    stop() {
        this._running = false;
    }

    dispose() {
        this._particlePool.dispose();
    }

    protected _doComputeLocalBounds(v: AABB2d) {
        let bounds: AABB2d = new AABB2d();
        this.particles.forEach((particle, i) => {
            bounds.set(0, 0, particle.width, particle.height).transform(particle.matrix);
            if (i === 0) {
                v.clone(bounds);
            } else {
                v.union(bounds);
            }
        });
    }

    private _destroyParticle(particle: Particle) {
        particle.reset();
        this._particlePool.release(particle);
    }

    private _createParticle() {
        const { life, size, scale, rotation, color, radialAccel, tangentialAccel, position, speed } = this.params;
        let particle = this._particlePool.obtain();
        let lifeValue = numberValueGenerator(life);
        lifeValue = lifeValue > 0 ? lifeValue : 0;
        particle.maxLife = particle.life = lifeValue;

        let sizeValue = numberValueGenerator(size);
        sizeValue = clamp(1, Number.MAX_VALUE, sizeValue);
        particle.width = sizeValue;
        particle.height = sizeValue;
        particle.radialAccelList = generateTimelineValueArr(radialAccel, numberValueGenerator);
        particle.tangentialAccelList = generateTimelineValueArr(tangentialAccel, numberValueGenerator);
        particle.scaleList = generateTimelineValueArr(scale, numberValueGenerator);
        particle.rotationList = generateTimelineValueArr(rotation, numberValueGenerator);
        particle.colorList = generateTimelineValueArr(color, colorValueGenerator);
        particle.speed = numberValueGenerator(speed);
        particle.tx = position[0] * random1();
        particle.ty = position[1] * random1();
        particle.px = particle.width * 0.5;
        particle.py = particle.height * 0.5;
    }

    get particles() {
        return this._particlePool.active;
    }

    get finished() {
        return this._finished;
    }
}