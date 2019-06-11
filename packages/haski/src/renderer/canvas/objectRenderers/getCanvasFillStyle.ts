// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { FillStyle, isPattern, isGradient } from '../../../graphics/fillStyle';
import Pattern from '../../../graphics/pattern';
import { Gradient, isLinearGradient, LinearGradient, RadialGradient } from '../../../graphics/gradient';
import Matrix2d from '@maths/matrix2d';
import Color from '@maths/color';

export default (ctx: CanvasRenderingContext2D, fillStyle: FillStyle) => {
    let canvasFillStyle: string | CanvasGradient | CanvasPattern = 'rgba(0, 0, 0, 0)';
    if (isPattern(fillStyle)) {
        fillStyle = fillStyle as Pattern;
        let canvasPattern = ctx.createPattern(fillStyle.texture.rawData, fillStyle.repeat || 'no-repeat');
        if (canvasPattern) {
            if (fillStyle.matrix) { canvasPattern.setTransform(Matrix2d.toSVGMatrix(fillStyle.matrix, {})) }
            canvasFillStyle = canvasPattern;
        }
    } else if (isGradient(fillStyle)) {
        let g = fillStyle as Gradient;
        let canvasGradient: CanvasGradient;
        let isLinear = isLinearGradient(g);
        if (isLinear) {
            let lg = g as LinearGradient;
            canvasGradient = ctx.createLinearGradient(lg.s[0], lg.s[1], lg.e[0], lg.e[1]);
        } else {
            let rg = g as RadialGradient;
            canvasGradient = ctx.createRadialGradient(
                rg.sc[0], rg.sc[1], rg.sr,
                rg.ec[0], rg.ec[1], rg.er
            );
        }
        g.colors.forEach((c, i) => canvasGradient.addColorStop(g.stops[i], c));
        canvasFillStyle = canvasGradient;
    } else {
        canvasFillStyle = Color.toString(fillStyle as any);
    }
    return canvasFillStyle;
};