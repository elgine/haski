import { VSTemplate, FSTemplate } from './template';

export const gradientVS = () => {
    return VSTemplate(`
            attribute vec3 aStart;
            attribute vec3 aEnd;
            attribute float aStop1;
            attribute float aStop2;
            attribute float aStop3;
            attribute float aStop4;
            attribute vec4 aStopColor1;
            attribute vec4 aStopColor2;
            attribute vec4 aStopColor3;
            attribute vec4 aStopColor4;

            varying vec3 vStart;
            varying vec3 vEnd;
            varying float vStop1;
            varying float vStop2;
            varying float vStop3;
            varying float vStop4;
            varying vec4 vStopColor1;
            varying vec4 vStopColor2;
            varying vec4 vStopColor3;
            varying vec4 vStopColor4;
        `, `
            vStart = aStart;
            vEnd = aEnd;
            vStop1 = aStop1;
            vStop2 = aStop2;
            vStop3 = aStop3;
            vStop4 = aStop4;
            vStopColor1 = aStopColor1;
            vStopColor2 = aStopColor2;
            vStopColor3 = aStopColor3;
            vStopColor4 = aStopColor4;
        `);
};

export const gradientFS = () => {
    return FSTemplate(`
            varying vec3 vStart;
            varying vec3 vEnd;
            varying float vStop1;
            varying float vStop2;
            varying float vStop3;
            varying float vStop4;
            varying vec4 vStopColor1;
            varying vec4 vStopColor2;
            varying vec4 vStopColor3;
            varying vec4 vStopColor4;
        `, `
            float p = 0.0, t = 0.0;
            vec2 dir = vEnd.xy - vStart.xy;
            vec2 vec = vLocalPos - vStart.xy;
            float dirDotSelf = dot(dir, dir);
            float vecDotSelf = dot(vec, vec);
            float vecDotDir = dot(vec, dir);
            if(vStart[2] <= 0.0 && vEnd[2] <= 0.0){
                t = vecDotDir / dirDotSelf;
            }else{                           
                float x1 = vStart.x;
                float y1 = vStart.y;
                float r1 = vStart.z;
                float x2 = vEnd.x;
                float y2 = vEnd.y;
                float r2 = vEnd.z;    
                float x = vLocalPos.x;
                float y = vLocalPos.y;   
                float xd = x2 - x1;
                float yd = y2 - y1;
                float rd = r2 - r1;
                float a = xd * xd + yd * yd - rd * rd;
                float b = -2.0 * x * xd + 2.0 * xd * x1 - 2.0 * y * yd + 2.0 * yd * y1 - 2.0 * rd * r1;
                float c = x * x - 2.0 * x * x1 + x1 * x1 + y * y - 2.0 * y * y1 + y1 * y1 - r1 * r1;
                t = (-b + sqrt(b * b - 4.0 * a * c)) / (2.0 * a);    
                float r = mix(r1, r2, t);
                if(r < min(r1, r2) || r > max(r1, r2)){
                    t = (-b - sqrt(b * b - 4.0 * a * c)) / (2.0 * a);  
                }                 
            }
            if(t < vStop1){
                color = vStopColor1;
            }else if(t < vStop2){
                p = (t - vStop1)/(vStop2 - vStop1);
                color = mix(vStopColor1, vStopColor2, p);
            }else if (t < vStop3){
                p = (t - vStop2)/(vStop3 - vStop2);
                color = mix(vStopColor2, vStopColor3, p);
            }else if (t < vStop4){
                p = (t - vStop3)/(vStop4 - vStop3);
                color = mix(vStopColor3, vStopColor4, p);
            }else{
                color = vStopColor4;
            }
        `);
};