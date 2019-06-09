type AnyOf<T> = {
    [K in keyof T]?:T[K];
};
type TextureRawData = HTMLCanvasElement|HTMLImageElement|HTMLVideoElement;
interface BaseTexture{
    readonly path:string;
    readonly rawData:TextureRawData;
}
type Dictionary<T> = {[name:string]:T};
type Constructor<T> = {new (...args:any[]):T};
type NativeFloatArray = number[];
type Mat2d = NativeFloatArray;
type Mat3d = NativeFloatArray;
type Vec2d = NativeFloatArray;
type Vec3d = NativeFloatArray;
type AxisRad = NativeFloatArray;
type Quat = NativeFloatArray;
type ITransform2d = {
    translation:Vec2d;
    scale:Vec2d;
    skew:Vec2d;
    rotation:number;
}
type ITransform3d = {
    translation:Vec3d;
    scale:Vec3d;
    skew:Vec3d;
    rotation:Quat;
}
type IObject3d = {center:Vec3d, faces:Vec3d[][]};
type IObject2d = {x:number, y:number, width?:number, height?:number};
type ICollider2d = {center:Vec2d, corners:Vec2d[], axises:Vec2d[]};
type IAABB2d = {x:number, y:number, width:number, height:number};
type IOBB2d = {center:Vec2d, width:number, height:number, rotation:number};
type ColorRawData = 
    {r:number, g:number, b:number, a?:number} |
    {h:number, s:number, l:number, a?:number} |
    {h:number, s:number, v:number, a?:number} | 
    RGBA | string | number | number[];
type RGBA = NativeFloatArray;