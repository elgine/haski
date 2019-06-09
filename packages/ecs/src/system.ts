import World from './world';

export enum SystemType{
    STARTUP,
    UPDATE,
    ENDING
}

export interface System<T extends World = World>{
    readonly type: SystemType;
    world: T;
    onAddedToWorld(w: T): void;
    onRemovedFromWorld(w: T): void;
}

export class SystemBase<T extends World = World> {

    public world!: T;

    onAddedToWorld(w: T) {
        this.world = w;
    }

    onRemovedFromWorld(w: T) {
        (this as any).world = null;
    }
}

export class StartupSystem<T extends World = World> extends SystemBase<T> implements System<T> {
    public readonly type: SystemType = SystemType.STARTUP;
    start() {}
}

export class EndingSystem<T extends World = World> extends SystemBase<T> implements System<T> {
    public readonly type: SystemType = SystemType.ENDING;
    end() {}
}

export class UpdateSystem<T extends World = World> extends SystemBase<T> implements System<T> {
    public readonly type: SystemType = SystemType.UPDATE;
    update(dt: number) {}
}

export default {
    SystemType,
    StartupSystem,
    EndingSystem,
    UpdateSystem
};