import Entity from './entity';
import Component from './component';
import EntityComponentSet from './entityComponentSet';
import Group from './group';
import groupHash from './groupHash';
import Signal from '@core/signal';

export default class EntityManager {

    public readonly onComponentAdded: Signal = new Signal();
    public readonly onComponentRemoved: Signal = new Signal();
    private _entityDict: Dictionary<Entity> = {};
    private _entityComponentDict: Dictionary<EntityComponentSet> = {};
    private _groupDict: Dictionary<Group> = {};

    createEntity() {
        let entity = new Entity(this);
        this._entityDict[entity.id] = entity;
        return entity;
    }

    destroyEntity(eid: string) {
        let e = this._entityDict[eid];
        if (e) {
            this.removeAllComps(eid);
            delete this._entityDict[eid];
        }
    }

    getEntities(...compTypeArr: string[]) {
        return this.createGroup(...compTypeArr).entities;
    }

    createGroup(...compTypeArr: string[]) {
        let gid = groupHash(compTypeArr);
        if (this._groupDict[gid]) return this._groupDict[gid];
        let group = new Group(compTypeArr);
        this._groupDict[group.id] = group;
        Object.values(this._entityDict).forEach((e) => {
            group.addEntityIfMatch(e);
        });
        return group;
    }

    getGroup(...compTypeArr: string[]) {
        return this._groupDict[groupHash(compTypeArr)] || this.createGroup(...compTypeArr);
    }

    removeGroup(...compTypeArr: string[]) {
        let gid = groupHash(compTypeArr);
        delete this._groupDict[gid];
    }

    addComp(eid: string, comp: Component) {
        let e = this._entityDict[eid];
        if (!e) return;
        if (!this._entityComponentDict[eid]) {
            this._entityComponentDict[eid] = new EntityComponentSet(eid);
        }
        if (this._entityComponentDict[eid].hasComp(comp.type)) return;
        this._entityComponentDict[eid].addComp(comp);
        this._updateGroupWhenAddComp(e);
        this._onComponentAdded(e, comp);
    }

    getComp<T extends Component>(eid: string, cType: string) {
        if (this._entityComponentDict[eid]) { return this._entityComponentDict[eid].getComp(cType) as T }
    }

    hasComp(eid: string, cType: string) {
        return this._entityComponentDict[eid] && this._entityComponentDict[eid].hasComp(cType);
    }

    removeComp(eid: string, cType: string) {
        let e = this._entityDict[eid];
        if (!e || !this._entityComponentDict[eid]) return;
        if (!this._entityComponentDict[eid].hasComp(cType)) return;
        const comp = this._entityComponentDict[eid].getComp(cType);
        this._entityComponentDict[eid].removeComp(cType);
        this._updateGroupWhenRemoveComp(e);
        this._onComponentRemoved(e, comp);
    }

    removeAllComps(eid: string) {
        let e = this._entityDict[eid];
        delete this._entityComponentDict[eid];
        this._updateGroupWhenRemoveComp(e);
    }

    entity(id: string) {
        return this._entityDict[id];
    }

    entityComponentSet(id: string) {
        return this._entityComponentDict[id];
    }

    private _updateGroupWhenAddComp(e: Entity) {
        Object.values(this._groupDict).forEach((g) => g.addEntityIfMatch(e));
    }

    private _updateGroupWhenRemoveComp(e: Entity) {
        Object.values(this._groupDict).forEach((g) => g.removeEntityIfNotMatch(e));
    }

    private _onComponentAdded(entity: Entity, component: Component) {
        const eid = entity.id;
        Object.values(this._groupDict).filter((group: Group) => group.componentTypeArr.indexOf(component.type) > -1).forEach((group) => {
            group.addEntityIfMatch(this._entityDict[eid]);
        });
        this.onComponentAdded.emit({ entity, component });
    }

    private _onComponentRemoved(entity: Entity, component: Component) {
        const eid = entity.id;
        Object.values(this._groupDict).filter((group: Group) => group.componentTypeArr.indexOf(component.type) > -1).forEach((group) => {
            group.removeEntityIfNotMatch(this._entityDict[eid]);
        });
        this.onComponentRemoved.emit({ entity, component });
    }
}