import { img } from "./images.js";
import { p, point, vector } from "./interfaces.js";
import { mapId, maps } from "./map.js";
import { ctx } from "./screen.js";
import { drawRangeCircle } from "./ui.js";

interface enemyData{
    hp,
    speed,
    path,
    height:number,
    width:number,
    i:undefined|img
}

export enum enemyType{
    baltoy = "baltoy"
}

const enemies:{ [key in enemyType]: enemyData } = {
    baltoy:{
        hp:3,
        speed:5,
        height:60,
        width:60,
        path:"./assets/baltoy.png",
        i:undefined
    }
}

export function loadEnemies(){
    return new Promise((res,rej)=>{
        var todo = 0
        Object.keys(enemies).forEach(e=>{
            todo++;
            enemies[e].i = new img(enemies[e].path,()=>{
                todo--;
                if(todo==0){
                    res(enemies)
                }
            })
        })
    })
}

export class enemy{
    pos:point
    goto = 0
    hp:number
    pHp:number
    type:enemyType
    done = false;
    map:mapId
    constructor(type:enemyType,map:mapId){
        this.type = type;
        this.hp = enemies[type].hp
        this.pHp = enemies[type].hp
        this.map = map
        this.pos = maps[map].path[0].clone();
    }
    draw(screen:ctx){
        if(enemies[this.type].i==undefined)
            throw "no asset"
        screen.drawImageCenter(enemies[this.type].i,this.pos.x,this.pos.y,enemies[this.type].width,enemies[this.type].height)
    }
    move(){
        var me = enemies[this.type];
        var map = maps[this.map]
        
        if(this.hp<=0)
            return true;
        if(map.path.length==this.goto)
            return true;

        var target = map.path[this.goto];
        
        var direction = vector.get(this.pos,target);

        var totravel = me.speed

        if(direction.distance()<=me.speed){
            this.pos.x = target.x
            this.pos.y = target.y
            totravel -= direction.distance()
            this.goto++
            if(map.path.length==this.goto)
                return true;
            
            target = map.path[this.goto];
            direction = vector.get(this.pos,target);
        }
        
        this.pos.addVec(direction.normalize().multiply(totravel))//'ll need bug fix

        return false;
        
    }
}