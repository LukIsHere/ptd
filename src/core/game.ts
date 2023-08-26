import { enemy, enemyType, loadEnemies } from "./enemy.js";
import { img } from "./images.js";
import { p, point } from "./interfaces.js"
import { drawMap, loadMaps, mapId } from "./map.js";
import { loadProjectiles, projectile } from "./projectiles.js";
import { ctx } from "./screen.js";
import { arbitraryDrawTower, loadTowers, tower, towerInfo, towerType } from "./tower.js";
import { loadUi } from "./ui.js";

export class game{
    towersAvailable:towerType[] = [towerType.pika];
    screen = new ctx()
    enemies:enemy[] = [];
    towers:tower[] = [];
    projectiles:projectile[] = [];
    highlight:tower|undefined;
    states:"non"|"drag"|"menu" = "non";
    money:number = 100;
    mousePos:point = p(0,0)
    constructor(){
    }
    async load(){
        await loadEnemies();
        console.log("enemies loaded");
        await loadTowers();
        console.log("towers loaded")
        await loadMaps();
        console.log("maps loaded");
        await loadUi();
        console.log("ui loaded")
        await loadProjectiles()
        console.log("projectiles loaded")
        
        this.newEnemy();

        this.screen.setClickEvent((x,y)=>{
            this.onMouseClick(x,y)
        });
        this.screen.setMouseMoveEvent((x,y)=>{
            this.onMouseMove(x,y)
        });
        this.screen.setMouseUpEvent((x,y)=>{
            this.onMouseUp(x,y)
        });
        this.screen.setMouseDownEvent((x,y)=>{
            this.onMouseDown(x,y)
        });
    }
    newEnemy(){
        this.enemies.push(new enemy(enemyType.baltoy,mapId.test));
    }
    drawLoop(){
        this.drawMapLoop();
    }
    inte:number = 100;
    drawMapLoop(){
        this.screen.fill("green")

        if(this.inte<0){
            this.newEnemy();
            this.inte = 100 + Math.round(Math.random()*100)
        }
        this.inte--;
    
        drawMap(this.screen,mapId.test);
        //drawMapPath(screen,mapId.test);
        this.projectiles = this.projectiles.filter(p=>{
            p.draw(this.screen);
            return !p.tick();
        })
        this.enemies = this.enemies.filter(e=>{
            e.draw(this.screen)
            if(!e.move()){
                return true
            }else{
                this.money++;
                return false
            }
        })
        this.towers.forEach(t=>{
            t.draw(this.screen)
            t.tick(this.enemies,this.projectiles)
        })
        if(this.highlight)
            this.highlight.drawRange(this.screen)
        if(this.states=="drag")
            arbitraryDrawTower(this.mousePos,towerType.pika,this.screen);
        
        this.screen.drawText("black","30px Arial","money:"+this.money,0,30)
    }
    drawTowerMenu(){

    }
    drawMapUi(){
        
    }
    onMouseClick(x:number,y:number){
        this.highlight = this.getHightlight(x,y)
        //console.log(this.highlight)
    }
    onMouseUp(x:number,y:number){
        if(this.states=="drag"){
            this.towers.push(new tower(p(x,y),towerType.pika));
            this.states = "non"
        }
    }
    onMouseDown(x:number,y:number){
        if(x>960)
            this.tryDrag(towerType.pika)
    }
    onMouseMove(x:number,y:number){
        this.mousePos.x = x;
        this.mousePos.y = y;
    }
    getHightlight(x:number,y:number){
        var place = p(x,y)
        var best:tower|undefined = undefined;
        var bestDst = 50;
        this.towers.forEach(t=>{
            var dst = t.pos.distance(place)
            if(dst<bestDst)best = t
        })
        return best;
    }
    tryDrag(t:towerType){
        var cost = towerInfo(t).upgrades[0].cost;
        if(this.money<cost)
            return;
        this.money-=cost;
        this.states = "drag";
    }
}