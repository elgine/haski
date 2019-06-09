import uuid from 'uuid/v4';
import EntityManager from './entityManager';
import Component from './component';

export default class Entity {

    public readonly id: string = uuid();
    public readonly entityManager: EntityManager;

    constructor(entityManager: EntityManager) {
        this.entityManager = entityManager;
    }

    addComponent(comp: Component) {
        this.entityManager.addComp(this.id, comp);
    }

    getComponent<T extends Component>(compType: string): T|undefined {
        return this.entityManager.getComp(this.id, compType);
    }

    removeComponent(compType: string) {
        this.entityManager.removeComp(this.id, compType);
    }

    hasComponent(compType: string) {
        return this.entityManager.hasComp(this.id, compType);
    }

    getComponents() {
        return this.entityManager.entityComponentSet(this.id);
    }
}