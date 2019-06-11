export default (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
    });
};