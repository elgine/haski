// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import RendererType from './rendererType';
import { supportWebGL, supportCanvas } from '@utils/canvas';

/**
 * Is device detected?
 */
let detected = false;

let rendererRecommend: RendererType = RendererType.WEBGL;

export default () => {
    if (detected) return rendererRecommend;
    if (supportWebGL()) {
        rendererRecommend = RendererType.WEBGL;
        return RendererType.WEBGL;
    }
    else if (supportCanvas()) {
        rendererRecommend = RendererType.CANVAS;
        return RendererType.CANVAS;
    }
    return -1;
};