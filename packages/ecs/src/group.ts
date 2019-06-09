import groupHash from './groupHash';
import Entity from './entity';

export default class Group {

    public readonly componentTypeArr: string[];
    public readonly id: string;
    private _entities: Entity[] = [];

    constructor(typeArr: string[]) {
        this.componentTypeArr = typeArr.slice();
        this.id = groupHash(this.componentTypeArr);
    }

    addEntityIfMatch(entity: Entity) {
        if (this.match(entity) && this._entities.indexOf(entity) < 0) {
            this._entities.push(entity);
        }
    }

    removeEntityIfNotMatch(entity: Entity) {
        if (!this.match(entity)) {
            let index = this._entities.indexOf(entity);
            if (index > -1) { this._entities.splice(index, 1) }
        }
    }

    match(e: Entity) {
        return this.componentTypeArr.every((compType) => e.hasComponent(compType));
    }

    get entities() {
        return this._entities;
    }
}