import { VSTemplate, FSTemplate, genTextureForEach } from './template';

export const patternVS = () => {
    return VSTemplate(`
            attribute float aTextureId;
            attribute vec4 aTexSizeRepeat;
            attribute vec2 aTexLeftTop;
            attribute vec2 aTexRightTop;
            attribute vec2 aTexRightBottom;
            varying float vTextureId;
            varying vec4 vTexSizeRepeat;
            varying vec2 vTexLeftTop;
            varying vec2 vTexRightTop;
            varying vec2 vTexRightBottom;
        `, `
            vTextureId = aTextureId;
            vTexSizeRepeat = aTexSizeRepeat;
            vTexLeftTop = aTexLeftTop;
            vTexRightTop = aTexRightTop;
            vTexRightBottom = aTexRightBottom;
        `);
};

export const patternFS = (maxTexNum: number) => {
    return FSTemplate(`
            uniform sampler2D uTextures[${maxTexNum}];
            varying float vTextureId;
            varying vec4 vTexSizeRepeat;
            varying vec2 vTexLeftTop;
            varying vec2 vTexRightTop;
            varying vec2 vTexRightBottom;
        `, `
            bool repeatX = vTexSizeRepeat.z > 0.0;
            bool repeatY = vTexSizeRepeat.w > 0.0;
            vec2 texSize = vTexSizeRepeat.xy;

            // Get horizontal and vertical axis
            vec2 hAxis = vTexRightTop - vTexLeftTop;
            vec2 vAxis = vTexRightBottom - vTexRightTop;
            float aw = sqrt(dot(hAxis, hAxis));
            float ah = sqrt(dot(vAxis, vAxis));
            // Normalize
            hAxis = normalize(hAxis);
            vAxis = normalize(vAxis);
            float originH = dot(vTexLeftTop, hAxis);
            float originV = dot(vTexRightTop, vAxis);
            
            float dotH = dot(vLocalPos, hAxis);
            float dotV = dot(vLocalPos, vAxis);

            if((!repeatX && (dotH < originH || dotH > originH + aw)) || (!repeatY && (dotV < originV || dotV > originV + ah)))
                discard;
            dotH = mod(dotH, aw);
            if(dotH < 0.0)dotH += aw;
            dotV = mod(dotV, ah);
            if(dotV < 0.0)dotV += ah;
            vec2 texCoord = vec2(dotH / aw, dotV / ah);
            ${genTextureForEach(maxTexNum)}
        `);
};