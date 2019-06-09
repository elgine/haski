// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export default () => {
    return window['ontouchstart'] || document['ontouchstart'] || window.navigator.msPointerEnabled;
};