export class img {
    constructor(path, callback) {
        if (path == "")
            throw "empty path";
        this.data = new Image();
        this.data.src = path;
        this.data.onload = callback;
    }
    static get(path) {
        return new Promise((res, rej) => {
            var i = new img(path, () => {
                res(i);
            });
        });
    }
}
