export class point{
    x:number
    y:number
    constructor(x:number,y:number){
        this.x = x;
        this.y = y;
    }
    add(p:point){
        this.x += p.x;
        this.y += p.y;
        return this;
    }
    addVec(v:vector){
        this.x += v.x
        this.y += v.y
        return this;
    }
    clone(){
        return new point(this.x,this.y)
    }
    multiply(m:number){
        this.x *= m;
        this.y *= m;
        return this;
    }
    round(){
        this.x = Math.round(this.x)
        this.y = Math.round(this.y)
    }
    roundNew(){
        return new point(Math.round(this.x),Math.round(this.y))
    }
    distance(p:point){
        return vector.get(this,p).distance()
    }
}

export class vector{
    x:number
    y:number
    constructor(x:number,y:number){
        this.x = x;
        this.y = y;
    }
    static get(start:point,dest:point){
        return new vector(dest.x-start.x,dest.y-start.y);
    }
    add(p:point){
        this.x += p.x;
        this.y += p.y;
        return this;
    }
    multiply(m:number){
        this.x *= m;
        this.y *= m;
        return this;
    }
    normalize(){
        var dist = Math.sqrt((this.x*this.x)+(this.y*this.y));
        this.x = this.x/dist;
        this.y = this.y/dist;
        return this;
    }
    distance(){
        return Math.sqrt((this.x*this.x)+(this.y*this.y));
    }
}

export function p(x:number,y:number):point{return new point(x,y)}
export function v(x:number,y:number):vector{return new vector(x,y)}