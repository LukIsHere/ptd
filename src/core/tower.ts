import { enemy } from "./enemy.js";
import { img } from "./images.js";
import { point } from "./interfaces.js";
import { mapId } from "./map.js";
import { projectile, projectileType } from "./projectiles.js";
import { ctx } from "./screen.js";
import { drawRangeCircle } from "./ui.js";

interface upgradeData{
    cost:number,
    damage:number,
    atackSpeed:number,
    range:number,
}
interface towerData{
    size:number,
    upgrades:[upgradeData],
    path:string,
    i:undefined|img
}

export enum towerType{
    pika = "pika"
}

export enum aim{
    first,
    last,
    close,
    strong,
}

const towers:{ [key in towerType]: towerData } = {
    pika:{
        size:60,
        upgrades:[
            {
                cost:35,
                damage:2,
                atackSpeed:1,
                range:5
            }
        ],
        path:"./assets/R.png",
        i:undefined
    }
}

export function loadTowers(){
    return new Promise((res,rej)=>{
        var todo = 0
        Object.keys(towers).forEach(e=>{
            todo++;
            towers[e].i = new img(towers[e].path,()=>{
                todo--;
                if(todo==0){
                    res(towers)
                }
            })
        })
    })
    
}

export class tower{
    pos:point
    upgrade:number = 0
    type:towerType
    lastShot:0
    priority:aim;
    constructor(pos:point,type:towerType){
        this.pos = pos
        this.type = type
        this.priority = aim.first;
    }
    static tryPlace(pos:point,type:towerType,map:mapId,other:tower[]){
        if(this.canPlace(pos,type,map,other))
            return new tower(pos,type);
        return undefined
    }
    static canPlace(pos:point,type:towerType,map:mapId,other:tower[]){
        //to-do placement logic
        return true;
    }
    inRange(target:enemy){
        var me = towers[this.type]
        var upgrade = me.upgrades[this.upgrade]

        return this.pos.distance(target.pos)<=upgrade.range*30;
    }
    getAimFirstTarget(enemies:enemy[]){//rewrite
        var target:undefined|enemy = undefined
        var distance = Infinity
        enemies.forEach(e=>{
            if(!this.inRange(e))
                return;
            
            if(e.pHp<=0)
                return;

            var dst = this.pos.distance(e.pos)
            if(dst>distance)
                return;
            distance = dst
            target = e;
        })
        return target;
    }
    tick(enemies:enemy[],projectiles:projectile[]){
        this.lastShot++;
        var me = towers[this.type]
        var upgrade = me.upgrades[this.upgrade]
        if(this.lastShot/30<upgrade.atackSpeed)
            return;
        
        var target:undefined|enemy = undefined;
        switch(this.priority){
            case aim.first:
                target = this.getAimFirstTarget(enemies)
            break;
        }
        
        if(target==undefined)
            return;

        target.pHp -= upgrade.damage

        this.lastShot = 0

        projectiles.push(new projectile(this.pos,projectileType.electroball,target,upgrade.damage))
    }
    draw(screen:ctx){
        var me = towers[this.type]
        if(me.i==undefined)
            return;
        screen.drawImageCenter(me.i,this.pos.x,this.pos.y,me.size,me.size);
    }
    drawRange(screen:ctx){
        var me = towers[this.type]
        var upgrade = me.upgrades[this.upgrade]

        drawRangeCircle(screen,this.pos,upgrade.range)
    }
    tryUpgrade(money){
        var up = towers[this.type].upgrades
        
        if(!up[this.upgrade+1])
            return 0

        if(up[this.upgrade+1].cost>money)
            return 0

        this.upgrade++;

        return up[this.upgrade].cost;
    }
}

export function arbitraryDrawTower(p:point,type:towerType,screen:ctx){
    var me = towers[type]
    if(me.i==undefined)
        return;
    screen.drawImageCenter(me.i,p.x,p.y,me.size,me.size);
}

export function towerInfo(t:towerType):towerData{
    return towers[t]
}
