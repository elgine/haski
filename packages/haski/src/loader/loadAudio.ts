export default (url: string): Promise<HTMLAudioElement> => {
    return new Promise((resolve, reject) => {
        let audio = new Audio();
        audio.src = url;
        audio.onloadedmetadata = (e) => resolve(audio);
        audio.onerror = (e) => reject(e);
    });
};