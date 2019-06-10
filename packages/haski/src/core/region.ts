// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import observable from '@core/observable';
import Size from './size';

export default class Region extends Size {

    @observable({ onDirty: 'onDirty' })
    x: number = 0;

    @observable({ onDirty: 'onDirty' })
    y: number = 0;

    clone(v: IAABB2d) {
        super.clone(v);
        this.x = v.x;
        this.y = v.y;
    }

    setRegion(x: number, y: number, width: number, height: number) {
        super.setSize(width, height);
        this.x = x;
        this.y = y;
    }
}