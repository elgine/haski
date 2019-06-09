// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export default class Signal {

    protected _handlers: Set<Function> = new Set<Function>();

    on(handler: Function) {
        this._handlers.add(handler);
    }

    off(handler: Function) {
        this._handlers.delete(handler);
    }

    emit(data: any = {}) {
        this._handlers.forEach((value: Function) => {
            value(data);
        });
    }

    dispose() {
        this._handlers.clear();
    }
}