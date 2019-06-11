// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Key, Device } from '@haski/input/input';
import Keyboard from '@haski/input/keyboard';

export default interface Control{
    cooldownTime: number;
    cooldown: number;
    keys: number[];
}

export interface ControlParams{
    cooldown?: number;
    keys?: number[];
}

export const ACTION_PLACE = 'place';

export const createControl = () => {
    return {
        cooldown: 500,
        cooldownTime: 0,
        keys: []
    };
};

export const defaultControl = () => {
    return {
        cooldown: 500,
        cooldownTime: 0,
        keys: [
            Keyboard.ENTER,
            Keyboard.SPACE
        ]
    };
};