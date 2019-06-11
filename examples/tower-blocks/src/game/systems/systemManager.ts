// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Game from '../game';
import renderSystem from './renderSystem';
import fallSystem from './fallSystem';
import inputSystem from './inputSystem';
import nextSystem from './nextSystem';
import initSystem from './initSystem';
import placeSystem from './placeSystem';
import swingSystem from './swingSystem';
import animateSystem from './animateSystem';

export default class SystemManager {

    public readonly systems: Function[] = [
        initSystem,
        inputSystem,
        swingSystem,
        fallSystem,
        nextSystem,
        placeSystem,
        animateSystem,
        renderSystem
    ];

    tick(game: Game) {
        this.systems.forEach((system) => system(game));
    }
}