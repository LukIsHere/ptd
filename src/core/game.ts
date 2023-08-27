import { enemy, enemyType, loadEnemies } from "./enemy.js";
import { img } from "./images.js";
import { p, point } from "./interfaces.js"
import { drawMap, loadMaps, mapId } from "./map.js";
import { loadProjectiles, projectile } from "./projectiles.js";
import { ctx } from "./screen.js";
import { arbitraryDrawTower, loadTowers, tower, towerInfo, towerType } from "./tower.js";
import { drawUiRect, loadUi, uiElement } from "./ui.js";

type gamestates = "non"|"drag"|"tower"|"pause"|"menu";

export class game{
    towersAvailable:towerType[] = [towerType.pika];
    screen = new ctx()
    enemies:enemy[] = [];
    towers:tower[] = [];
    projectiles:projectile[] = [];
    highlight:tower|undefined;
    paused:boolean = false;
    states:gamestates = "non";
    selectedTower:towerType|undefined = towerType.pika;
    money:number = 100;
    mousePos:point = p(0,0)
    fastforward:boolean = false;
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
    frame:boolean = false;
    drawLoop(){
        var mainGame:gamestates[] = ["non","drag","pause","tower"]
        if(mainGame.indexOf(this.states)>-1)
            this.mainGameLoop();

    }
    mainGameLoop(){
        if(this.frame){
            this.gameDrawLoop();
            this.drawMapUi();
        }

        if(this.fastforward||this.frame)
            if(!this.paused)
                this.gameTickLoop()
        
        this.frame=!this.frame
    }
    inte:number = 100;
    gameTickLoop(){

        if(this.inte<0){
            this.newEnemy();
            this.inte = 100 + Math.round(Math.random()*100)
        }
        this.inte--;
        //drawMapPath(screen,mapId.test);
        this.projectiles = this.projectiles.filter(p=>{
            return !p.tick();
        })
        this.enemies = this.enemies.filter(e=>{
            if(!e.move()){
                return true
            }else{
                this.money++;
                return false
            }
        })
        this.towers.forEach(t=>{
            t.tick(this.enemies,this.projectiles)
        })
        
    }
    gameDrawLoop(){
        this.screen.fill("green")

        drawMap(this.screen,mapId.test);

        this.projectiles.forEach(p=>{
            p.draw(this.screen);
        })

        this.enemies.forEach(e=>{
            e.draw(this.screen);
        })
        
        this.towers.forEach(t=>{
            t.draw(this.screen)
        })

        if(this.highlight)
            this.highlight.drawRange(this.screen)
        
        this.screen.drawText("black","30px Arial",this.money+"$",0,30)
    }
    drawTowerMenu(){

    }
    drawMapUi(){
        this.screen.fillRect("green",960,0,128,960)

        if(this.selectedTower){
            var tData = towerInfo(this.selectedTower)
            this.screen.drawText("white","30px Arial",this.selectedTower,960,30)
            this.screen.drawText("white","30px Arial",tData.upgrades[0].cost+"$",960,60)
        }
        var sp = 0;
        var col = 0
        this.towersAvailable.forEach(t=>{
            
            this.screen.fillRect("blue",960+10+(128*sp),60+10+(128*col),108,108);

            arbitraryDrawTower(p(960+64+(128*sp),124+(col*128)),t,this.screen)
            
            if(sp)
             col++;
            
            if(sp)sp=0;
            else sp=1;

            
        })
        
        if(this.paused)
            drawUiRect(this.screen,uiElement.pauseButton,960+15+128,960-113,94,94);
        else
            drawUiRect(this.screen,uiElement.pauseButton,960+20+128,960-108,84,84);

        if(this.fastforward)
            drawUiRect(this.screen,uiElement.fastforwardButton,960+15,960-113,94,94);
        else
            drawUiRect(this.screen,uiElement.fastforwardButton,960+20,960-108,84,84);
        
        if(this.states=="drag")
            arbitraryDrawTower(this.mousePos,towerType.pika,this.screen);
    }
    onMouseClick(x:number,y:number){
        this.checkUI(x,y)
    }
    onMouseUp(x:number,y:number){
        if(this.states=="drag"){
            this.tryRelease(x,y);
            this.states = "non";
        }
    }
    checkUI(x:number,y:number){
        var pt = p(x,y);
        if(pt.isInside(960+128+20,960-108,84,84)){//pause button
            this.paused=!this.paused
        }
        if(pt.isInside(960+20,960-108,84,84)){//fastforward button
            this.fastforward=!this.fastforward;
        }
    }
    tryRelease(x:number,y:number){
        if(!this.canPlace(this.selectedTower,x,y))
            return;
        var cost = towerInfo(this.selectedTower).upgrades[0].cost;
        if(this.money<cost)
            return;
        this.money-=cost;
        this.towers.push(new tower(p(x,y),this.selectedTower));
    }
    onMouseDown(x:number,y:number){
        this.highlight = this.getHightlight(x,y)
        if(this.highlight&&x<=960)
            this.states = "tower";

        var ct;
        
        if(x>960)
            ct = this.getClickedTower(x,y);

        if(ct){
            this.selectedTower = this.getClickedTower(x,y)
            this.states = "drag"
        }
            
    }
    onMouseMove(x:number,y:number){
        this.mousePos.x = x;
        this.mousePos.y = y;
    }
    canPlace(t:towerType,x:number,y:number){
        if(y>960)
            return false;
        //to-do
        return true
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
    getClickedTower(x:number,y:number){
        var out:undefined|towerType;
        var pt = p(x,y)
        var sp = 0;
        var col = 0

        this.towersAvailable.forEach(t=>{
            if(pt.isInside(960+(128*sp),60+(128*col),128,128))
                out = t;
            if(sp)
             col++;
            
            if(sp)sp=0;
            else sp=1;
        })
        return out
    }
}