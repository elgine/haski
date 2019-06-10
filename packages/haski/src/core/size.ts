// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Emitter from '@core/emitter';
import observable from '@core/observable';

export default class Size extends Emitter {

    static ON_CHANGE = 'ON_CHANGE';

    @observable({ onDirty: 'onDirty' })
    width: number = 0;

    @observable({ onDirty: 'onDirty' })
    height: number = 0;

    constructor(width?: number, height?: number) {
        super();
        this.width = width || 0;
        this.height = height || 0;
    }

    clone(v: {width: number; height: number}) {
        this.width = v.width;
        this.height = v.height;
    }

    setSize(w: number, h: number) {
        this.width = w;
        this.height = h;
    }

    onDirty() {
        this.emit(Size.ON_CHANGE, this);
    }
}