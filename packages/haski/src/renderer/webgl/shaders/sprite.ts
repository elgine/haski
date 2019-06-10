import { genTextureForEach, VSTemplate, FSTemplate } from './template';

export const spriteVS = () => {
    return VSTemplate(
        `
            attribute float aTextureId;
            attribute vec4 aTexCoordInfo;
            attribute vec4 aTint;
            varying float vTextureId;
            varying vec4 vTexCoordInfo;
            varying vec4 vTint;
        `,
        `
            vTextureId = aTextureId;
            vTexCoordInfo = aTexCoordInfo;
            vTint = aTint;
        `
    );
};

export const spriteFS = (maxTexNum: number = 16) => {
    return FSTemplate(`
            uniform sampler2D uTextures[${maxTexNum}];
            varying float vTextureId;
            varying vec4 vTexCoordInfo;
            varying vec4 vTint;
        `, `
            vec2 texCoord = vTexCoordInfo.xy / vTexCoordInfo.zw;
            ${genTextureForEach(maxTexNum)}
            color *= vTint;
        `);
};