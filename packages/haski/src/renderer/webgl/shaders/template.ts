export const VSTemplate = (otherDefination: string = '', otherProcess: string = '') => {
    return `
        precision mediump float;
        attribute vec4 aPosition;
        uniform float uViewWidth;
        uniform float uViewHeight;
        ${otherDefination}
        attribute float aOpacity;
        varying float vOpacity;
        varying vec2 vLocalPos;
        void main(){
            vec3 position = vec3(aPosition.xy, -1.0);
            position.x = position.x/uViewWidth * 2.0 - 1.0;
            position.y = 1.0 - position.y/uViewHeight * 2.0;
            vOpacity = aOpacity;
            vLocalPos = aPosition.zw;
            ${otherProcess}
            gl_Position = vec4(position, 1.0);
        }
    `;
};

export const FSTemplate = (otherDefination: string = '', otherProcess: string = '') => {
    return `
        precision mediump float;
        varying vec2 vLocalPos;
        varying float vOpacity;
        ${otherDefination}
        void main(){
            vec4 color = vec4(1.0, 1.0, 1.0, 1.0);
            ${otherProcess}
            color[3] *= vOpacity;
            gl_FragColor = color;
        }
    `;
};

export const genTextureForEach = (num: number = 16) => {
    let str = '';
    for (let i = 0; i < num; i++) {
        if (i === num - 1) {
            str += 'else';
        } else {
            if (i !== 0) {
                str += 'else ';
            }
            str += `if(${i}.0 == vTextureId)`;
        }
        str += `{
            color *= texture2D(uTextures[${i}], texCoord);
        }`;
    }
    return str;
};