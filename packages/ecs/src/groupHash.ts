import hash from './hash';

export default (arr: string[]) => {
    return arr.reduce((sum: number, type: string) => {
        return sum * 33 + hash(type);
    }, 5381).toString();
};