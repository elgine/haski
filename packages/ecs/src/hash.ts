export default (str: string) => {
    let h = 0; let l = str.length; let
        i = 0;
    if (l > 0) { while (i < l)
    { h = (h << 5) - h + str.charCodeAt(i++) | 0 } }
    return h;
};