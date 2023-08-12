export class point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(p) {
        this.x += p.x;
        this.y += p.y;
        return this;
    }
    addVec(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    clone() {
        return new point(this.x, this.y);
    }
    multiply(m) {
        this.x *= m;
        this.y *= m;
        return this;
    }
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
    }
    roundNew() {
        return new point(Math.round(this.x), Math.round(this.y));
    }
    distance(p) {
        return vector.get(this, p).distance();
    }
}
export class vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static get(start, dest) {
        return new vector(dest.x - start.x, dest.y - start.y);
    }
    add(p) {
        this.x += p.x;
        this.y += p.y;
        return this;
    }
    multiply(m) {
        this.x *= m;
        this.y *= m;
        return this;
    }
    normalize() {
        var dist = Math.sqrt((this.x * this.x) + (this.y * this.y));
        this.x = this.x / dist;
        this.y = this.y / dist;
        return this;
    }
    distance() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
}
export function p(x, y) { return new point(x, y); }
export function v(x, y) { return new vector(x, y); }
