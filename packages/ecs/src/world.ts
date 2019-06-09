import autobind from 'autobind-decorator';
import Signal from '@core/signal';
import Ticker from '@core/ticker';
import { System, StartupSystem, UpdateSystem, EndingSystem, SystemType } from './system';
import EntityManager from './entityManager';

export default class World extends EntityManager {

    public readonly onStart: Signal = new Signal();
    public readonly onEnd: Signal = new Signal();
    public readonly ticker: Ticker;
    private _startups: StartupSystem[] = [];
    private _endings: EndingSystem[] = [];
    private _updates: UpdateSystem[] = [];

    constructor() {
        super();
        this.ticker = new Ticker();
        this.ticker.cb = this._onTick;
    }

    addSystem(system: System) {
        if (system.type === SystemType.STARTUP) {
            this._startups.push(system as any);
        } else if (system.type === SystemType.ENDING) {
            this._endings.push(system as any);
        } else {
            this._updates.push(system as any);
        }
        system.onAddedToWorld(this);
    }

    removeSystem(system: System) {
        let index = -1;
        if (system.type === SystemType.STARTUP) {
            index = this._startups.indexOf(system as any);
            if (index > -1) {
                this._startups.splice(index, 1);
            }
        } else if (system.type === SystemType.ENDING) {
            index = this._endings.indexOf(system as any);
            if (index > -1) {
                this._endings.splice(index, 1);
            }
        } else {
            index = this._updates.indexOf(system as any);
            if (index > -1) {
                this._updates.splice(index, 1);
            }
        }
        system.onRemovedFromWorld(this);

    }

    start() {
        this._startups.forEach((sys) => sys.start());
        this.onStart.emit(this);
        this.ticker.run();
    }

    end() {
        this.ticker.stop();
        this._endings.forEach((sys) => sys.end());
        this.onEnd.emit(this);
    }

    protected update(dt: number) {
        this._updates.forEach((sys) => sys.update(dt));
    }

    protected preupdate() {

    }

    protected postupdate() {

    }

    @autobind
    private _onTick() {
        this.preupdate();
        this.update(this.ticker.dt);
        this.postupdate();
    }
}