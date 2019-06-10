// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Path from './path';
import { FillStyle } from '../base/fillStyle';
import PathDrawingStyle from '../base/pathDrawingStyle';
import PathData from './pathData';
import StrokePathData from './strokePathData';
import FillPathData from './fillPathData';
import Signal from '@core/signal';

export default class GraphicsData {

    public readonly wm: Mat2d;
    public paths: PathData[] = [];

    public readonly onDirty: Signal = new Signal();
    public readonly onBoundsDirty: Signal = new Signal();

    constructor(wm: Mat2d) {
        this.wm = wm;
    }

    onWorldMatrixDirty() {
        this.paths.forEach((path) => path.setWorldVerticesDirty(true));
    }

    stroke(path: Path, fillStyle: FillStyle, drawingStyle: PathDrawingStyle) {
        let pathData = new StrokePathData(this.wm, path.subPaths);
        pathData.drawingStyle = drawingStyle;
        pathData.fillStyle = fillStyle;
        this.paths.push(pathData);
        this.onDirty.emit(this);
        this.onBoundsDirty.emit(this);
    }

    fill(path: Path, fillStyle: FillStyle) {
        let pathData = new FillPathData(this.wm, path.subPaths);
        pathData.fillStyle = fillStyle;
        this.paths.push(pathData);
        this.onDirty.emit(this);
        this.onBoundsDirty.emit(this);
    }

    clear() {
        this.paths.length = 0;
    }
}