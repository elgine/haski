// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Pointer from './pointer';

export default class TouchPointer extends Pointer {

    public identifier: number = 0;
    public radiusX: number = 0;
    public radiusY: number = 0;
    public rotationAngle: number = 0;
    public force: number = 0;

    constructor(identifier: number) {
        super();
        this.identifier = identifier;
    }

    clone(touchPointer: TouchPointer) {
        super.clone(touchPointer);
        this.radiusX = touchPointer.radiusX;
        this.radiusY = touchPointer.radiusY;
        this.rotationAngle = touchPointer.rotationAngle;
        this.force = touchPointer.force;
    }
}