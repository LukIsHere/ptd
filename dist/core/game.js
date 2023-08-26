var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { enemy, enemyType, loadEnemies } from "./enemy.js";
import { p } from "./interfaces.js";
import { drawMap, loadMaps, mapId } from "./map.js";
import { loadProjectiles } from "./projectiles.js";
import { ctx } from "./screen.js";
import { arbitraryDrawTower, loadTowers, tower, towerInfo, towerType } from "./tower.js";
import { loadUi } from "./ui.js";
export class game {
    constructor() {
        this.towersAvailable = [towerType.pika];
        this.screen = new ctx();
        this.enemies = [];
        this.towers = [];
        this.projectiles = [];
        this.states = "non";
        this.money = 100;
        this.mousePos = p(0, 0);
        this.inte = 100;
    }
    load() {
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
            this.newEnemy();
            this.screen.setClickEvent((x, y) => {
                this.onMouseClick(x, y);
            });
            this.screen.setMouseMoveEvent((x, y) => {
                this.onMouseMove(x, y);
            });
            this.screen.setMouseUpEvent((x, y) => {
                this.onMouseUp(x, y);
            });
            this.screen.setMouseDownEvent((x, y) => {
                this.onMouseDown(x, y);
            });
        });
    }
    newEnemy() {
        this.enemies.push(new enemy(enemyType.baltoy, mapId.test));
    }
    drawLoop() {
        this.drawMapLoop();
    }
    drawMapLoop() {
        this.screen.fill("green");
        if (this.inte < 0) {
            this.newEnemy();
            this.inte = 100 + Math.round(Math.random() * 100);
        }
        this.inte--;
        drawMap(this.screen, mapId.test);
        //drawMapPath(screen,mapId.test);
        this.projectiles = this.projectiles.filter(p => {
            p.draw(this.screen);
            return !p.tick();
        });
        this.enemies = this.enemies.filter(e => {
            e.draw(this.screen);
            if (!e.move()) {
                return true;
            }
            else {
                this.money++;
                return false;
            }
        });
        this.towers.forEach(t => {
            t.draw(this.screen);
            t.tick(this.enemies, this.projectiles);
        });
        if (this.highlight)
            this.highlight.drawRange(this.screen);
        if (this.states == "drag")
            arbitraryDrawTower(this.mousePos, towerType.pika, this.screen);
        this.screen.drawText("black", "30px Arial", "money:" + this.money, 0, 30);
    }
    drawTowerMenu() {
    }
    drawMapUi() {
    }
    onMouseClick(x, y) {
        this.highlight = this.getHightlight(x, y);
        //console.log(this.highlight)
    }
    onMouseUp(x, y) {
        if (this.states == "drag") {
            this.towers.push(new tower(p(x, y), towerType.pika));
            this.states = "non";
        }
    }
    onMouseDown(x, y) {
        if (x > 960)
            this.tryDrag(towerType.pika);
    }
    onMouseMove(x, y) {
        this.mousePos.x = x;
        this.mousePos.y = y;
    }
    getHightlight(x, y) {
        var place = p(x, y);
        var best = undefined;
        var bestDst = 50;
        this.towers.forEach(t => {
            var dst = t.pos.distance(place);
            if (dst < bestDst)
                best = t;
        });
        return best;
    }
    tryDrag(t) {
        var cost = towerInfo(t).upgrades[0].cost;
        if (this.money < cost)
            return;
        this.money -= cost;
        this.states = "drag";
    }
}
