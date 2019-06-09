// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export default class Ease {
    static LINEAR: string = 'linear';
    static IN_QUAD: string = 'inQuad';
    static OUT_QUAD: string = 'outQuad';
    static IN_QUT_QUAD: string = 'inOutQuad';
    static IN_CUBE: string = 'inCube';
    static OUT_CUBE: string = 'outCube';
    static IN_OUT_CUBE: string = 'inOutCube';
    static IN_QUART: string = 'inQuart';
    static OUT_QUART: string = 'outQuart';
    static IN_OUT_QUART: string = 'inOutQuart';
    static IN_QUINT: string = 'inQuint';
    static OUT_QUINT: string = 'outQuint';
    static IN_OUT_QUINT: string = 'inOutQuint';
    static IN_SINE: string = 'inSine';
    static OUT_SINE: string = 'outSine';
    static IN_OUT_SINE: string = 'inOutSine';
    static IN_EXPO: string = 'inExpo';
    static OUT_EXPO: string = 'outExpo';
    static IN_OUT_EXPO: string = 'inOutExpo';
    static IN_CIRC: string = 'inCirc';
    static OUT_CIRC: string = 'outCirc';
    static IN_OUT_CIRC: string = 'inOutCirc';
    static IN_BACK: string = 'inBack';
    static OUT_BACK: string = 'outBack';
    static IN_OUT_BACK: string = 'inOutBack';
    static IN_BOUNCE: string = 'inBounce';
    static OUT_BOUNCE: string = 'outBounce';
    static IN_OUT_BOUNCE: string = 'inOutBounce';
    static IN_ELASTIC: string = 'inElastic';
    static OUT_ELASTIC: string = 'outElastic';
    static IN_OUT_ELASTIC: string = 'inOutElastic';

    static types: {[name: string]: Function};

    static process(type: string, n: number): number {
        if (Ease.types[type]) { return Ease.types[type](n) }
        return 1;
    }

    static linear(n: number): number {
        return n;
    }

    static inQuad(n: number): number {
        return n * n;
    }

    static outQuad(n: number): number {
        return n * (2 - n);
    }

    static inOutQuad(n: number): number {
        n *= 2;
        if (n < 1) return 0.5 * n * n;
        return -0.5 * (--n * (n - 2) - 1);
    }

    static inCube(n: number): number {
        return n * n * n;
    }

    static outCube(n: number): number {
        return --n * n * n + 1;
    }

    static inOutCube(n: number): number {
        n *= 2;
        if (n < 1) return 0.5 * n * n * n;
        return 0.5 * ((n -= 2) * n * n + 2);
    }

    static inQuart(n: number): number {
        return n * n * n * n;
    }

    static outQuart(n: number): number {
        return 1 - (--n * n * n * n);
    }

    static inOutQuart(n: number): number {
        n *= 2;
        if (n < 1) return 0.5 * n * n * n * n;
        return -0.5 * ((n -= 2) * n * n * n - 2);
    }

    static inQuint(n: number): number {
        return n * n * n * n * n;
    }

    static outQuint(n: number): number {
        return --n * n * n * n * n + 1;
    }

    static inOutQuint(n: number): number {
        n *= 2;
        if (n < 1) return 0.5 * n * n * n * n * n;
        return 0.5 * ((n -= 2) * n * n * n * n + 2);
    }

    static inSine(n: number): number {
        return 1 - Math.cos(n * Math.PI / 2);
    }

    static outSine(n: number): number {
        return Math.sin(n * Math.PI / 2);
    }

    static inOutSine(n: number): number {
        return 0.5 * (1 - Math.cos(Math.PI * n));
    }

    static inExpo(n: number): number {
        return n === 0 ? 0 : Math.pow(1024, n - 1);
    }

    static outExpo(n: number): number {
        return n === 1 ? n : 1 - Math.pow(2, -10 * n);
    }

    static inOutExpo(n: number): number {
        if (n === 0) return 0;
        if (n === 1) return 1;
        if ((n *= 2) < 1) return 0.5 * Math.pow(1024, n - 1);
        return 0.5 * (-Math.pow(2, -10 * (n - 1)) + 2);
    }

    static inCirc(n: number): number {
        return 1 - Math.sqrt(1 - n * n);
    }

    static outCirc(n: number): number {
        return Math.sqrt(1 - (--n * n));
    }

    static inOutCirc(n: number): number {
        n *= 2;
        if (n < 1) return -0.5 * (Math.sqrt(1 - n * n) - 1);
        return 0.5 * (Math.sqrt(1 - (n -= 2) * n) + 1);
    }

    static inBack(n: number): number {
        let s = 1.70158;
        return n * n * ((s + 1) * n - s);
    }

    static outBack(n: number): number {
        let s = 1.70158;
        return --n * n * ((s + 1) * n + s) + 1;
    }

    static inOutBack(n: number): number {
        let s = 1.70158 * 1.525;
        if ((n *= 2) < 1) return 0.5 * (n * n * ((s + 1) * n - s));
        return 0.5 * ((n -= 2) * n * ((s + 1) * n + s) + 2);
    }

    static inBounce(n: number): number {
        return 1 - Ease.outBounce(1 - n);
    }

    static outBounce(n: number): number {
        if (n < (1 / 2.75)) {
            return 7.5625 * n * n;
        } else if (n < (2 / 2.75)) {
            return 7.5625 * (n -= (1.5 / 2.75)) * n + 0.75;
        } else if (n < (2.5 / 2.75)) {
            return 7.5625 * (n -= (2.25 / 2.75)) * n + 0.9375;
        } else {
            return 7.5625 * (n -= (2.625 / 2.75)) * n + 0.984375;
        }
    }

    static inOutBounce(n: number): number {
        if (n < 0.5) return Ease.inBounce(n * 2) * 0.5;
        return Ease.outBounce(n * 2 - 1) * 0.5 + 0.5;
    }

    static inElastic(n: number): number {
        let s; let a = 0.1; let
            p = 0.4;
        if (n === 0) return 0;
        if (n === 1) return 1;
        if (!a || a < 1) { a = 1; s = p / 4 }
        else { s = p * Math.asin(1 / a) / (2 * Math.PI) }
        return -(a * Math.pow(2, 10 * (n -= 1)) * Math.sin((n - s) * (2 * Math.PI) / p));
    }

    static outElastic(n: number): number {
        let s; let a = 0.1; let
            p = 0.4;
        if (n === 0) return 0;
        if (n === 1) return 1;
        if (!a || a < 1) { a = 1; s = p / 4 }
        else { s = p * Math.asin(1 / a) / (2 * Math.PI) }
        return (a * Math.pow(2, -10 * n) * Math.sin((n - s) * (2 * Math.PI) / p) + 1);
    }

    static inOutElastic(n: number): number {
        let s; let a = 0.1; let
            p = 0.4;
        if (n === 0) return 0;
        if (n === 1) return 1;
        if (!a || a < 1) { a = 1; s = p / 4 }
        else { s = p * Math.asin(1 / a) / (2 * Math.PI) }
        if ((n *= 2) < 1) return -0.5 * (a * Math.pow(2, 10 * (n -= 1)) * Math.sin((n - s) * (2 * Math.PI) / p));
        return a * Math.pow(2, -10 * (n -= 1)) * Math.sin((n - s) * (2 * Math.PI) / p) * 0.5 + 1;
    }
}

Ease.types = {
    [Ease.LINEAR]: Ease.linear,
    [Ease.IN_QUAD]: Ease.inQuad,
    [Ease.OUT_QUAD]: Ease.outQuad,
    [Ease.IN_QUT_QUAD]: Ease.inOutQuad,
    [Ease.IN_CUBE]: Ease.inCube,
    [Ease.OUT_CUBE]: Ease.outCube,
    [Ease.IN_OUT_CUBE]: Ease.inOutCube,
    [Ease.IN_QUART]: Ease.inQuart,
    [Ease.OUT_QUART]: Ease.outQuart,
    [Ease.IN_OUT_QUART]: Ease.inOutQuart,
    [Ease.IN_QUINT]: Ease.inQuint,
    [Ease.OUT_QUINT]: Ease.outQuint,
    [Ease.IN_OUT_QUINT]: Ease.inOutQuint,
    [Ease.IN_SINE]: Ease.inSine,
    [Ease.OUT_SINE]: Ease.outSine,
    [Ease.IN_OUT_SINE]: Ease.inOutSine,
    [Ease.IN_EXPO]: Ease.inExpo,
    [Ease.OUT_EXPO]: Ease.outExpo,
    [Ease.IN_OUT_EXPO]: Ease.inOutExpo,
    [Ease.IN_CIRC]: Ease.inCirc,
    [Ease.OUT_CIRC]: Ease.outCirc,
    [Ease.IN_OUT_CIRC]: Ease.inOutCirc,
    [Ease.IN_BACK]: Ease.inBack,
    [Ease.OUT_BACK]: Ease.outBack,
    [Ease.IN_OUT_BACK]: Ease.inOutBack,
    [Ease.IN_BOUNCE]: Ease.inBounce,
    [Ease.OUT_BOUNCE]: Ease.outBounce,
    [Ease.IN_OUT_BOUNCE]: Ease.inOutBounce,
    [Ease.IN_ELASTIC]: Ease.inElastic,
    [Ease.OUT_ELASTIC]: Ease.outElastic,
    [Ease.IN_OUT_ELASTIC]: Ease.inOutElastic
};