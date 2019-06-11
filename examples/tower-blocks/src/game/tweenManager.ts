// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import TWEEN, { Tween } from '@tweenjs/tween.js';

export default class TweenManager {

    private _tween: Map<any, Tween> = new Map<any, Tween>();

    animate(target: any, args: any, dur: number, onUpdate?: (target: any) => void, onComplete?: (target: any) => void) {
        let tween = new Tween(target).to(args, dur);
        if (onUpdate) {
            tween.onUpdate(onUpdate);
        }
        if (onComplete) {
            tween.onComplete(onComplete);
        }
        tween.start();
        this._tween.set(target, tween);
    }

    contains(target: any) {
        return this._tween.has(target);
    }

    remove(target: any) {
        let tween = this._tween.get(target);
        if (tween) {
            tween.stop();
            TWEEN.remove(tween);
        }
    }
}