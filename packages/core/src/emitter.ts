// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export default class Emitter {

    protected _handlers: Map<string, Set<Function>>;

    constructor() {
        this._handlers = new Map<string, Set<Function>>();
    }

    has(name: string) {
        return this._handlers.has(name);
    }

    on(eventName: any, handler: Function) {
        let handlers: Set<Function>;
        if (this._handlers.has(eventName)) {
            let handlers = this._handlers.get(eventName);
            if (handlers) {
                handlers.add(handler);
            }
        } else {
            handlers = new Set<Function>();
            handlers.add(handler);
            this._handlers.set(eventName, handlers);
        }
    }

    emit(name: string, ...data: Array<any>) {
        if (this._handlers.has(name)) {
            let handlers = this._handlers.get(name);
            if (handlers) {
                handlers.forEach((h) => {
                    h(...data);
                });
            }
        }
    }

    off(eventName: string, dispatcher: Function) {
        if (!dispatcher) { this._handlers.delete(eventName) }
        else {
            let ds = this._handlers.get(eventName);
            if (ds) {
                ds.delete(dispatcher);
            }
        }
    }

    dispose() {
        this._handlers.forEach((set) => {
            set.clear();
        });
        this._handlers.clear();
    }
}