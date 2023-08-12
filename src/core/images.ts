export class img {
    data:HTMLImageElement
    constructor(path:string, callback:()=>void) {
        if(path=="")
            throw "empty path"
        this.data = new Image();
        this.data.src = path;
        this.data.onload = callback;
    }
    static get(path:string){
        return new Promise((res,rej)=>{
            var i = new img(path,()=>{
                res(i);
            });
        })
    }
}
