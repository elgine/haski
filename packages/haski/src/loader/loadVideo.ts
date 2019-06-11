export default (url: string): Promise<HTMLVideoElement> => {
    return new Promise((resolve, reject) => {
        let video = document.createElement('video');
        video.src = url;
        video.onloadedmetadata = () => resolve(video);
        video.onerror = (e) => reject(e);
    });
};