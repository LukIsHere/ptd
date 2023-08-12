import { enemy, enemyType, loadEnemies } from "./core/enemy.js"
import { img } from "./core/images.js"
import { p } from "./core/interfaces.js"
import { drawMap, drawMapPath, loadMaps, mapId } from "./core/map.js"
import { loadProjectiles, projectile } from "./core/projectiles.js"
import { ctx } from "./core/screen.js"
import { loadTowers, tower, towerType } from "./core/tower.js"
import { loadUi } from "./core/ui.js"

var black = "black"
var white = "white"

var screen = new ctx()
var enemies:enemy[] = [];
var towers:tower[] = [];
var projectiles:projectile[] = [];

screen.fill("green")
var inte = 50
function mainLoop(){
    if(inte<0){
        newEnemy();
        inte = 10 + Math.round(Math.random()*10)
    }
    inte--;

    drawMap(screen,mapId.test);
    //drawMapPath(screen,mapId.test);
    projectiles = projectiles.filter(p=>{
        p.draw(screen);
        return !p.tick();
    })
    enemies = enemies.filter(e=>{
        e.draw(screen)
        return !e.move();
    })
    towers.forEach(t=>{
        t.drawRange(screen)
        t.draw(screen)
        t.tick(enemies,projectiles)
    })
}



async function main(){
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
    
    newEnemy();

    setInterval(mainLoop,1000/30)
}

main();

screen.setClickEvent((x,y)=>{
    console.log(x+":"+y);
    towers.push(new tower(p(x,y),towerType.pika))
})

function newEnemy(){
    enemies.push(new enemy(enemyType.baltoy,mapId.test));
}