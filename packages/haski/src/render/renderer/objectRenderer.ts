// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import RenderObject from '../../renderObject/renderObject';
import Renderer from './renderer';

export default interface ObjectRenderer<T extends RenderObject>{
    readonly name: string;
    render(renderer: Renderer, node: T): void;
}