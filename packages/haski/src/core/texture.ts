import Resource from './resource';
import GLTexture from '@gl/glTexture';

export default class Texture<T = TextureRawData> implements Resource<T> {

    /**
     * Texture source path
     * @type {string}
     */
    public readonly path: string;

    /**
     * Source
     * @type {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement}
     */
    public readonly rawData!: T;

    /**
     * WebGL texture id set after uploaded
     */
    public readonly glTexture: GLTexture = new GLTexture();

    constructor(path: string, data: T) {
        this.path = path;
        this.rawData = data;
    }
}