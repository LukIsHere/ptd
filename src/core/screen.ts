import { img } from "./images.js";

export class ctx {
    ctx: CanvasRenderingContext2D;
    canvas:HTMLCanvasElement;
    constructor(id = "screen") {
        this.canvas = document.getElementById(id) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");
    }
    fill(c:string) {
        this.ctx.fillStyle = c;
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
    }
    fillRect(c:string, x:number, y:number, w:number, h:number) {
        this.ctx.fillStyle = c;
        this.ctx.fillRect(x, y, w, h);
    }
    fillRectCenter(c:string, x:number, y:number, w:number, h:number){
        this.ctx.fillStyle = c;
        this.ctx.fillRect(x-(w/2),y-(h/2),w,h);
    }
    drawImage(i:img, x:number, y:number, w:number, h:number) {
        this.ctx.drawImage(i.data, x, y, w, h);
    }
    drawImageCenter(i:img, x:number, y:number, w:number, h:number) {
        this.ctx.drawImage(i.data,x-(w/2),y-(h/2),w,h);
    }
    drawImageCenterR(i:img, x:number, y:number, w:number, h:number,rotation:number){
        this.ctx.save()
        this.ctx.translate(x,y);
        this.ctx.rotate(rotation*Math.PI/180)
        this.ctx.drawImage(i.data,-w/2,-h/2,w,h);
        this.ctx.restore()
    }
    drawLine(c:string,x:number,y:number,x2:number,y2:number,t:number){
        this.ctx.beginPath();
        this.ctx.strokeStyle = c;
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineWidth = t;
        
        this.ctx.stroke();
    }
    realPos(x:number,y:number){
        const rect = this.canvas.getBoundingClientRect();
        const elementRelativeX = x - rect.left;
        const elementRelativeY = y - rect.top;
        const canvasRelativeX = elementRelativeX * this.canvas.width / rect.width;
        const canvasRelativeY = elementRelativeY * this.canvas.height / rect.height;
        
        return {x:Math.round(canvasRelativeX),y:Math.round(canvasRelativeY)}
    }
    setClickEvent(func:(x:number,y:number)=>void){
        this.canvas.onclick = (e)=>{
            var pos = this.realPos(e.clientX,e.clientY)
            func(pos.x,pos.y)
        }
    }
}
