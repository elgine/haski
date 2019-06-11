import randomColorOffset from './randomColorOffset';

// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export default interface BlockConfig{
    defaultSize: {width: number; height: number; depth: number};
    defaultColor: ColorRawData;
    colorOffset: number;
}

export interface BlockConfigParams{
    defaultSize?: {width: number; height: number; depth: number};
    defaultColor?: ColorRawData;
    colorOffset?: number;
}

export const createBlockConfig = () => {
    return {
        defaultSize: { width: 0, height: 0, depth: 0 },
        defaultColor: '#333344',
        colorOffset: 0
    };
};

export const defaultBlockConfig = () => {
    return {
        defaultSize: { width: 128, height: 32, depth: 128 },
        defaultColor: '#333344',
        colorOffset: randomColorOffset()
    };
};