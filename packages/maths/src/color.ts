// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export enum ColorFormat{
    NONE,
    HEX,
    RGB,
    HSL,
    HSV
}

export default class Color {

    private static _temp1 = [0, 0, 0, 1];
    private static _temp2 = [0, 0, 0, 1];

    static create() {
        return new Array<number>(4);
    }

    static reset(v: RGBA) {
        v[0] = v[1] = v[2] = v[3] = 0;
        return v;
    }

    static alpha(v: ColorRawData) {
        Color.set(v, this._temp1);
        return this._temp1[3];
    }

    static hue2rgb(p: number, q: number, t: number): number {
        if (t < 0) { t += 1 }
        if (t > 1) { t -= 1 }
        if (t < 1 / 6) { return p + (q - p) * 6 * t }
        if (t < 1 / 2) { return q }
        if (t < 2 / 3) { return p + (q - p) * (2 / 3 - t) * 6 }
        return p * 255;
    }

    static luminosity(color: RGBA, fs = 255) {
        return 0.2126 * Math.pow(color[0] / fs, 2.2) + 0.7152 * Math.pow(color[1] / fs, 2.2) + 0.0722 * Math.pow(color[2] / fs, 2.2);
    }

    static colorFormat(v: ColorRawData) {
        if (typeof v === 'string') {
            let str: string = v.toLowerCase();
            let hexRegex = /^#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/g;
            let rgbRegex = /^rgba?\((\s*([0-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\s*,){2}\s*([0-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\s*(,\s*((0(.\d+)?)|(1(.0+)?))\s*)?\)$/g;
            let hslRegex = /^hsla?\((\s*((0(.\d+)?)|(1(.0+)?))\s*,){2}\s*((0(.\d+)?)|(1(.0+)?))\s*(,\s*((0(.\d+)?)|(1(.0+)?))\s*)?\)$/g;
            let hsvRegex = /^hsva?\((\s*((0(.\d+)?)|(1(.0+)?))\s*,){2}\s*((0(.\d+)?)|(1(.0+)?))\s*(,\s*((0(.\d+)?)|(1(.0+)?))\s*)?\)$/g;
            if (hexRegex.test(str)) return ColorFormat.HEX;
            else if (rgbRegex.test(str)) return ColorFormat.RGB;
            else if (hslRegex.test(str)) return ColorFormat.HSL;
            else if (hsvRegex.test(str)) return ColorFormat.HSV;
            else return ColorFormat.NONE;
        } else if (typeof v === 'number') {
            // RGB in Hex
            return ColorFormat.HEX;
        } else if (Array.isArray(v)) {
            // RGB in number array
            return ColorFormat.RGB;
        } else {
            if (v.hasOwnProperty('r') && v.hasOwnProperty('g') && v.hasOwnProperty('b')) { return ColorFormat.RGB }
            else if (v.hasOwnProperty('h') && v.hasOwnProperty('s') && v.hasOwnProperty('l')) { return ColorFormat.HSL }
            else if (v.hasOwnProperty('h') && v.hasOwnProperty('s') && v.hasOwnProperty('v')) { return ColorFormat.HSV }
            else
            { return ColorFormat.NONE }
        }
    }

    static sub(c1: RGBA, c2: RGBA, out?: RGBA) {
        out = out || c1;
        out[0] = c1[0] - c2[0];
        out[1] = c1[1] - c2[1];
        out[2] = c1[2] - c2[2];
        out[3] = c1[3] - c2[3];
        return out;
    }

    static add(c1: RGBA, c2: RGBA, out?: RGBA) {
        out = out || c1;
        out[0] = c1[0] + c2[0];
        out[1] = c1[1] + c2[1];
        out[2] = c1[2] + c2[2];
        out[3] = c1[3] + c2[3];
        return out;
    }

    static mul(c1: RGBA, c2: RGBA|number, out?: RGBA) {
        out = out || c1;
        if (typeof c2 === 'number') {
            out[0] = c1[0] * c2;
            out[1] = c1[1] * c2;
            out[2] = c1[2] * c2;
            out[3] = c1[3] * c2;
        } else {
            out[0] = c1[0] * c2[0];
            out[1] = c1[1] * c2[1];
            out[2] = c1[2] * c2[2];
            out[3] = c1[3] * c2[3];
        }
        return out;
    }

    static clone(c: RGBA, out: RGBA) {
        out[0] = c[0];
        out[1] = c[1];
        out[2] = c[2];
        out[3] = c[3] !== undefined ? c[3] : 1;
        return out;
    }

    static normalize(c: RGBA, out?: RGBA) {
        out = out || c;
        out[0] = c[0] / 255;
        out[1] = c[1] / 255;
        out[2] = c[2] / 255;
        out[3] = c[3];
        return out;
    }

    static tint(c: RGBA, percent: number, out?: RGBA) {
        out = out || c;
        const t = percent < 0 ? 0 : 255;
        percent = percent < 0 ? percent * -1 : percent;
        out[0] = c[0] + (t - c[0]) * percent;
        out[1] = c[1] + (t - c[1]) * percent;
        out[2] = c[2] + (t - c[2]) * percent;
        if (out[0] > 255)out[0] = 255;
        else if (out[0] < 0)out[0] = 0;
        if (out[1] > 255)out[1] = 255;
        else if (out[1] < 0)out[1] = 0;
        if (out[2] > 255)out[2] = 255;
        else if (out[2] < 0)out[2] = 0;
        out[3] = c[3];
        return out;
    }

    static shade(c: RGBA, percent: number, out?: RGBA) {
        return this.tint(c, -percent, out);
    }

    static fade(c: RGBA, percent: number, out?: RGBA) {
        out = out || c;
        out[0] = c[0];
        out[1] = c[1];
        out[2] = c[2];
        out[3] = c[3] * percent;
        return out;
    }

    static isDark(c: RGBA, threshold = 0.43) {
        const luma = this.luminosity(c);
        if (luma > threshold) return true;
        return false;
    }

    static contrast(c: RGBA, d: ColorRawData = '#000', l: ColorRawData = '#fff', threshold = 0.43) {
        const luma = this.luminosity(c);
        if (luma > threshold) return d;
        else return l;
    }

    static fromHEX(hex: string|number, out?: RGBA) {
        out = out || [0, 0, 0, 1];
        if (typeof hex === 'number') {
            hex = '#' + hex.toString().replace('0x', '');
        }
        if (/^#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/g.test(hex)) {
            hex = hex.replace(/^#/, '');
            let num = 0;
            if (hex.length === 3) {
                num = parseInt(hex.split('').reduce((c, v) => {
                    return c + v + v;
                }, ''), 16);
                out[3] = 1;
            }
            else if (hex.length === 6) {
                num = parseInt(hex, 16);
                out[3] = 1;
            } else if (hex.length === 8) {
                out[3] = parseInt(hex.substr(0, 2), 16) / 255;
                num = parseInt(hex.substring(2, hex.length), 16);
            }
            out[0] = num >> 16;
            out[1] = num >> 8 & 255;
            out[2] = num & 255;
        }
        return out;
    }

    static toHEX(c: RGBA, a?: boolean) {
        let v: number = ~~(c[2] + (c[1] << 8) + (c[0] << 16));
        let colorString = v
            .toString(16)
            .toLowerCase();
        if (a) {
            colorString = (c[3] * 255).toString(16) + colorString;
        }
        return '#' + colorString;
    }

    static fromRGB(rgb: RGBA|string|{r: number; g: number; b: number; a?: number}, out?: RGBA) {
        out = out || [0, 0, 0, 1];
        if (typeof rgb === 'string') {
            rgb = rgb.replace(/[rgba?(]|\)|\s/g, '').split(',').map((v) => Number(v));
            this.clone(rgb, out);
        } else if (Array.isArray(rgb)) {
            this.clone(rgb, out);
        } else {
            out[0] = rgb.r;
            out[1] = rgb.g;
            out[2] = rgb.b;
            out[3] = rgb.a !== undefined ? rgb.a : 1;
        }
        return out;
    }

    static toString(data: ColorRawData, alpha: boolean = true) {
        if (typeof data === 'string') return data;
        Color.set(data, Color._temp1);
        if (alpha) { return `rgba(${~~Color._temp1[0]}, ${~~Color._temp1[1]}, ${~~Color._temp1[2]}, ${Color._temp1[3]})` }
        return `rgb(${~~Color._temp1[0]}, ${~~Color._temp1[1]}, ${~~Color._temp1[2]})`;
    }

    static fromHSV(hsv: string|{h: number; s: number; v: number; a?: number}, out?: RGBA) {
        out = out || [0, 0, 0, 1];
        let h = 0; let s = 0; let v = 0; let
            a = 0;
        if (typeof hsv === 'string') {
            let arr = hsv.replace(/[hsla?(]|\)|\s/g, '').split(',');
            h = Number(arr[0]);
            s = Number(arr[1]);
            v = Number(arr[2]);
            a = arr[3] !== undefined ? Number(arr[3]) : 1;
        } else {
            h = hsv.h;
            s = hsv.s;
            v = hsv.v;
            a = hsv.a || 1;
        }

        let i = Math.floor(h * 6);
        let f = h * 6 - i;
        let p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: out[0] = v; out[1] = t; out[2] = p; break;
            case 1: out[0] = q; out[1] = v; out[2] = p; break;
            case 2: out[0] = p; out[1] = v; out[2] = t; break;
            case 3: out[0] = p; out[1] = q; out[2] = v; break;
            case 4: out[0] = t; out[1] = p; out[2] = v; break;
            case 5: out[0] = v; out[1] = p; out[2] = q; break;
        }
        out[0] *= 255;
        out[1] *= 255;
        out[2] *= 255;
        out[3] = a;
        return out;
    }

    static fromHSL(hsl: string|{h: number; s: number; l: number; a?: number}, out?: RGBA) {
        out = out || [0, 0, 0, 1];
        let h = 0; let s = 0; let l = 0; let
            a = 0;
        if (typeof hsl === 'string') {
            let arr = hsl.replace(/[hsla?(]|\)|\s/g, '').split(',');
            h = Number(arr[0]);
            s = Number(arr[1]);
            l = Number(arr[2]);
            a = arr[3] !== undefined ? Number(arr[3]) : 1;
        } else {
            h = hsl.h;
            s = hsl.s;
            l = hsl.l;
            a = hsl.a || 1;
        }
        if (s === 0) {
            out[0] = out[1] = out[2] = l;
        }
        else {
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            out[0] = this.hue2rgb(p, q, h + 1 / 3);
            out[1] = this.hue2rgb(p, q, h);
            out[2] = this.hue2rgb(p, q, h - 1 / 3);
            out[3] = a;
        }
        return out;
    }

    static toHSV(c: RGBA) {
        let r = c[0] / 255;
        let g = c[1] / 255;
        let b = c[2] / 255;
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let h = 0;
        let v = max;
        let d = max - min;
        let s = max === 0 ? 0 : d / max;

        if (max === min) {
            h = 0;
        }
        else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: h, s: s, v: v, a: c[3] };
    }

    static toHSL(c: RGBA) {
        let r = c[0] / 255;
        let g = c[1] / 255;
        let b = c[2] / 255;
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let l = (max + min) / 2;
        let h = 0;
        let s;

        if (max === min) {
            h = s = 0; // achromatic
        }
        else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return { h: h, s: s, l: l, a: c[3] };
    }

    static set(params: ColorRawData, out: RGBA) {
        let f = this.colorFormat(params);
        if (f === ColorFormat.NONE) return out;
        else if (f === ColorFormat.HEX) return this.fromHEX(params as any, out);
        else if (f === ColorFormat.RGB) return this.fromRGB(params as any, out);
        else if (f === ColorFormat.HSV) return this.fromHSV(params as any, out);
        else if (f === ColorFormat.HSL) return this.fromHSL(params as any, out);
        return out;
    }

    static equals(c1: ColorRawData, c2: ColorRawData) {
        this.set(c1, this._temp1);
        this.set(c2, this._temp2);
        return this._temp1[0] === this._temp2[0] &&
            this._temp1[1] === this._temp2[1] &&
            this._temp1[2] === this._temp2[2] &&
            this._temp1[3] === this._temp2[3];
    }
}