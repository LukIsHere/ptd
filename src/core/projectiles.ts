import { enemy } from "./enemy.js"
import { img } from "./images.js"
import { point, vector } from "./interfaces.js"
import { ctx } from "./screen.js"

interface projectileData{
    speed:number,
    height:number,
    width:number,
    path:string
    i:undefined|img
}

export enum projectileType{
    electroball = "electroball"
}

const projectiles:{ [key in projectileType]: projectileData } = {
    electroball:{
        speed:12,
        height:30,
        width:30,
        path:"./assets/electro_ball.png",
        i:undefined
    }
}

export function loadProjectiles(){
    return new Promise((res,rej)=>{
        var todo = 0
        Object.keys(projectiles).forEach(e=>{
            todo++;
            projectiles[e].i = new img(projectiles[e].path,()=>{
                todo--;
                if(todo==0){
                    res(projectiles)
                }
            })
        })
    })
}

export class projectile{
    pos:point
    type:projectileType
    target:undefined|enemy|point
    use:undefined|number
    damage:number
    done = false;
    constructor(pos:point,type:projectileType,target:undefined|enemy|point,damage:number){
        this.pos = pos.clone()
        this.type = type;
        this.target = target;
        this.damage = damage;
    }
    tick():boolean{
        var me = projectiles[this.type]
        if(this.done)
            return true;

        if(!(this.target instanceof enemy))
            return true;

        var dir = vector.get(this.pos,this.target.pos)
        
        if(dir.distance()<me.speed){
            this.target.hp -= this.damage
            this.done = true;
            return true
        }

        this.pos.addVec(dir.normalize().multiply(me.speed))
        
        return false;
    }
    draw(screen:ctx){
        var me = projectiles[this.type]
        screen.drawImageCenter(me.i,this.pos.x,this.pos.y,me.width,me.height)
    }
}