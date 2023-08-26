export class ctx {
    constructor(id = "screen") {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext("2d");
    }
    fill(c) {
        this.ctx.fillStyle = c;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    fillRect(c, x, y, w, h) {
        this.ctx.fillStyle = c;
        this.ctx.fillRect(x, y, w, h);
    }
    fillRectCenter(c, x, y, w, h) {
        this.ctx.fillStyle = c;
        this.ctx.fillRect(x - (w / 2), y - (h / 2), w, h);
    }
    drawImage(i, x, y, w, h) {
        this.ctx.drawImage(i.data, x, y, w, h);
    }
    drawImageCenter(i, x, y, w, h) {
        this.ctx.drawImage(i.data, x - (w / 2), y - (h / 2), w, h);
    }
    drawImageCenterR(i, x, y, w, h, rotation) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation * Math.PI / 180);
        this.ctx.drawImage(i.data, -w / 2, -h / 2, w, h);
        this.ctx.restore();
    }
    drawLine(c, x, y, x2, y2, t) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = c;
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineWidth = t;
        this.ctx.stroke();
    }
    drawText(c, font, text, x, y) {
        this.ctx.fillStyle = c;
        this.ctx.font = font;
        this.ctx.fillText(text.toString(), x, y);
    }
    realPos(x, y) {
        const rect = this.canvas.getBoundingClientRect();
        const elementRelativeX = x - rect.left;
        const elementRelativeY = y - rect.top;
        const canvasRelativeX = elementRelativeX * this.canvas.width / rect.width;
        const canvasRelativeY = elementRelativeY * this.canvas.height / rect.height;
        return { x: Math.round(canvasRelativeX), y: Math.round(canvasRelativeY) };
    }
    setClickEvent(func) {
        this.canvas.onclick = (e) => {
            var pos = this.realPos(e.clientX, e.clientY);
            func(pos.x, pos.y);
        };
    }
    setMouseDownEvent(func) {
        this.canvas.onmousedown = (e) => {
            var pos = this.realPos(e.clientX, e.clientY);
            func(pos.x, pos.y);
        };
        this.canvas.ontouchstart = (e) => {
            if (!e.targetTouches[0])
                return;
            var touch = e.targetTouches[0];
            var pos = this.realPos(touch.clientX, touch.clientY);
            this.lastX = pos.x;
            this.lastY = pos.y;
            func(pos.x, pos.y);
        };
    }
    setMouseUpEvent(func) {
        this.canvas.onmouseup = (e) => {
            var pos = this.realPos(e.clientX, e.clientY);
            func(pos.x, pos.y);
        };
        this.canvas.ontouchend = (e) => {
            func(this.lastX, this.lastY);
        };
    }
    setMouseMoveEvent(func) {
        this.canvas.onmousemove = (e) => {
            var pos = this.realPos(e.clientX, e.clientY);
            func(pos.x, pos.y);
        };
        this.canvas.ontouchmove = (e) => {
            if (!e.targetTouches[0])
                return;
            var touch = e.targetTouches[0];
            var pos = this.realPos(touch.clientX, touch.clientY);
            this.lastX = pos.x;
            this.lastY = pos.y;
            e.preventDefault();
            func(pos.x, pos.y);
        };
    }
}
