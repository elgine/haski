// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export const supportCanvas = () => {
    let c = document.createElement('canvas');
    if (!c) return false;
    let tempCtx = c.getContext('2d');
    return tempCtx !== null;
};

export const supportWebGL = () => {
    let c = document.createElement('canvas');
    if (!c) return false;
    return (c.getContext('webgl') || c.getContext('experimental-webgl')) !== null;
};

export const getCanvasRenderingContext = (el: HTMLCanvasElement, params?: any) => {
    let ctx = el.getContext('2d', params);
    if (!ctx) throw new Error("Current browser dones't support canvas");
    return ctx;
};

export const getWebGLRenderingContext = (el: HTMLCanvasElement, params?: any) => {
    params = params || { antialias: true };
    let ctx = el.getContext('experimental-webgl', params) || el.getContext('webgl', params);
    if (!ctx) throw new Error("Current browser doesn't support webgl");
    return ctx;
};

export const createCanvas = (rw: number = 400, rh: number = 300, absolute: boolean = false, fill: boolean = false) => {
    let canvas = document.createElement('canvas');
    if (!canvas) throw new Error("This browser doesn't support canvas element");
    canvas.width = rw;
    canvas.height = rh;
    if (absolute) {
        canvas.style.position = 'absolute';
    }
    if (fill) {
        canvas.style.width = '100%';
        canvas.style.height = '100%';
    }
    return canvas;
};