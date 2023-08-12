var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { enemy, enemyType, loadEnemies } from "./core/enemy.js";
import { p } from "./core/interfaces.js";
import { drawMap, loadMaps, mapId } from "./core/map.js";
import { loadProjectiles } from "./core/projectiles.js";
import { ctx } from "./core/screen.js";
import { loadTowers, tower, towerType } from "./core/tower.js";
import { loadUi } from "./core/ui.js";
var black = "black";
var white = "white";
var screen = new ctx();
var enemies = [];
var towers = [];
var projectiles = [];
screen.fill("green");
var inte = 50;
function mainLoop() {
    if (inte < 0) {
        newEnemy();
        inte = 10 + Math.round(Math.random() * 10);
    }
    inte--;
    drawMap(screen, mapId.test);
    //drawMapPath(screen,mapId.test);
    projectiles = projectiles.filter(p => {
        p.draw(screen);
        return !p.tick();
    });
    enemies = enemies.filter(e => {
        e.draw(screen);
        return !e.move();
    });
    towers.forEach(t => {
        t.drawRange(screen);
        t.draw(screen);
        t.tick(enemies, projectiles);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadEnemies();
        console.log("enemies loaded");
        yield loadTowers();
        console.log("towers loaded");
        yield loadMaps();
        console.log("maps loaded");
        yield loadUi();
        console.log("ui loaded");
        yield loadProjectiles();
        console.log("projectiles loaded");
        newEnemy();
        setInterval(mainLoop, 1000 / 30);
    });
}
main();
screen.setClickEvent((x, y) => {
    console.log(x + ":" + y);
    towers.push(new tower(p(x, y), towerType.pika));
});
function newEnemy() {
    enemies.push(new enemy(enemyType.baltoy, mapId.test));
}
