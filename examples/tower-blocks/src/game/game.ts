// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Input, { Device } from '@haski/input/input';
import Ticker from '@core/ticker';
import autobind from 'autobind-decorator';
import Stage from '@haski/core/stage';
import Renderer, { RendererParams } from '@haski/renderer/renderer';
import rendererFactory from '@haski/renderer/rendererFactory';
import SystemManager from './systems/systemManager';
import BlockManager from './blockManager';
import Lighting, { LightingParams, defaultLighting, createLighting } from './lighting';
import Block from './block';
import Vector3d from '@maths/vector3d';
import GameState from './gameState';
import BlockConfig, { defaultBlockConfig, createBlockConfig } from './blockConfig';
import Control, { ControlParams, defaultControl, ACTION_PLACE, createControl } from './control';
import GamePlayingState from './gamePlayingState';
import Signal from '@core/signal';
import Physics, { defaultPhysics, PhysicsParams, createPhysics } from './physics';
import TweenManager from './tweenManager';
import Fall, { FallParams, defaultFall, createFall } from './fall';
import Swing, { defaultSwing, SwingParams, createSwing } from './swing';

export interface ViewportParams{
    size?: {width: number; height: number};
}

export interface GameParams{
    backgroundColor?: string;
    control?: ControlParams;
    fall?: FallParams;
    swing?: SwingParams;
    physics?: PhysicsParams;
    lighting?: LightingParams;
    viewport?: ViewportParams;
}

export interface GameConstructorParams{
    renderer?: RendererParams;
    blockConfig?: BlockConfig;
}

export default class Game {

    public readonly onControlChange: Signal = new Signal();
    public readonly onLevelChange: Signal = new Signal();
    public readonly onEnd: Signal = new Signal();
    public readonly input: Input;
    public readonly ticker: Ticker;
    public readonly stage: Stage;
    public readonly tweenManager: TweenManager;
    public readonly control: Control = createControl();
    public readonly fall: Fall = createFall();
    public readonly swing: Swing = createSwing();
    public readonly lighting: Lighting = createLighting();
    public readonly physics: Physics = createPhysics();
    public readonly blockConfig: BlockConfig = createBlockConfig();
    public readonly renderer: Renderer;
    public readonly systemManager: SystemManager;
    public readonly blockManager: BlockManager;
    public playingState: GamePlayingState = GamePlayingState.FREE;
    private _state: GameState = GameState.STOPPED;

    constructor(constructorParams: GameConstructorParams = {}) {
        this.ticker = new Ticker();
        this.stage = new Stage();
        let renderer = rendererFactory(constructorParams.renderer);
        if (!renderer) throw new Error("This browser doesn't canvas");
        this.renderer = renderer;
        this.input = new Input();
        this.tweenManager = new TweenManager();
        this.blockManager = new BlockManager();
        this.systemManager = new SystemManager();
        this.ticker.cb = this._onTick;
        this.blockManager.onBlockCreated.on(this._onBlockCreated);
        this.blockManager.onBlockDestroyed.on(this._onBlockDestroyed);
        this.input.registerAction(ACTION_PLACE, [
            { type: Device.MOUSE, keyCode: 0 },
            { type: Device.TOUCH, keyCode: 0 }
        ]);
        this.input.initialize(this.renderer.rawData);
        this.blockConfig = constructorParams.blockConfig || defaultBlockConfig();
        this.blockManager.initialize({
            color: this.blockConfig.defaultColor,
            size: this.blockConfig.defaultSize,
            pos: [0, 0, 0]
        });
        this.updateCenter();
    }

    updateCenter() {
        this.stage.root.tx = this.renderer.size.width * 0.5;
        this.stage.root.ty = this.renderer.size.height * 0.5;
    }

    setParams(params: GameParams) {
        params = this._mergeDefaultParams(params);
        params.backgroundColor && this.setBackgroundColor(params.backgroundColor);
        params.control && this.setControl(params.control);
        params.lighting && this.setLighting(params.lighting);
        params.physics && this.setPhysics(params.physics);
        params.swing && this.setSwing(params.swing);
        params.fall && this.setFall(params.fall);
    }

    setPhysics(physics: PhysicsParams) {
        if (physics.gravity) {
            this.physics.gravity = physics.gravity;
        }
    }

    setBackgroundColor(v: string) {
        this.renderer.backgroundColor = v;
    }

    setControl(control: ControlParams) {
        if (control.cooldown) {
            this.control.cooldown = control.cooldown;
        }
        if (control.keys) {
            this.input.unregisterAction(ACTION_PLACE, this.control.keys.map((keyCode) => {
                return {
                    type: Device.KEYBOARD,
                    keyCode
                };
            }));
            this.control.keys = control.keys;
            this.input.registerAction(ACTION_PLACE, this.control.keys.map((keyCode) => {
                return {
                    type: Device.KEYBOARD,
                    keyCode
                };
            }));
            this.onControlChange.emit(this.control.keys);
        }
    }

    setLighting(lighting: LightingParams) {
        if (lighting.ambientLightOffset) { Vector3d.clone(lighting.ambientLightOffset, this.lighting.ambientLightOffset) }
        if (lighting.ambientLightColorDiff) { this.lighting.ambientLightColorDiff = lighting.ambientLightColorDiff }
    }

    setSwing(swing: SwingParams) {
        if (swing.swingTripDuration) {
            this.swing.swingTripDuration = swing.swingTripDuration;
        }
        if (swing.swingTripLengthRatio) {
            this.swing.swingTripLengthRatio = swing.swingTripLengthRatio;
        }
    }

    setFall(fall: FallParams) {
        if (fall.rotationSpeed) {
            this.fall.rotationSpeed = fall.rotationSpeed;
        }
        if (fall.height) {
            this.fall.height = fall.height;
        }
    }

    start() {
        if (this.playingState === GamePlayingState.FREE || this.playingState === GamePlayingState.END) {
            this.playingState = GamePlayingState.PREPARE;
        }
    }

    stop() {
        this._state = GameState.STOPPED;
        this.ticker.stop();
    }

    run() {
        this._state = GameState.PLAYING;
        this.ticker.run();
    }

    get state() {
        return this._state;
    }

    private _mergeDefaultParams(params: GameParams) {
        return {
            control: defaultControl(),
            fall: defaultFall(),
            blockConfig: defaultBlockConfig(),
            swing: defaultSwing(),
            lighting: defaultLighting(),
            physics: defaultPhysics(), ...params
        };
    }

    @autobind
    private _onBlockCreated(block: Block) {
        this.stage.addChild(block.view);
    }

    @autobind
    private _onBlockDestroyed(block: Block) {
        this.stage.root.removeChild(block.view);
    }

    @autobind
    private _onTick() {
        this.systemManager.tick(this);
        this.renderer.renderStageToTarget(this.stage);
    }
}