// Copyright (c) 2019 Elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export const regexpIndexOf = (regex: RegExp, str: string) => {
    return str.search(regex);
};

export const regexpLastIndexOf = (regex: RegExp, str: string) => {
    let result;
    let lastIndexOf = -1;
    while ((result = regex.exec(str)) !== null) {
        lastIndexOf = result.index;
        regex.lastIndex++;
    }
    return lastIndexOf;
};