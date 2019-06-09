import Component from './component';

export default class EntityComponentSet {

    public readonly eid: string;
    private _componentDict: Dictionary<Component> = {};

    constructor(eid: string) {
        this.eid = eid;
    }

    addComp(comp: Component) {
        this._componentDict[comp.type] = comp;
    }

    getComp(type: string) {
        return this._componentDict[type];
    }

    hasComp(type: string) {
        return this._componentDict[type] !== undefined;
    }

    removeComp(type: string) {
        delete this._componentDict[type];
    }

    forEach(cb: Function) {
        for (let cType in this._componentDict) {
            cb(this._componentDict[cType], cType);
        }
    }

    get components() {
        return Object.values(this._componentDict);
    }
}