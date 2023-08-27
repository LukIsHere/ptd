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
import { drawUiRect, loadUi, uiElement } from "./ui.js";
export class game {
    constructor() {
        this.towersAvailable = [towerType.pika];
        this.screen = new ctx();
        this.enemies = [];
        this.towers = [];
        this.projectiles = [];
        this.paused = false;
        this.states = "non";
        this.selectedTower = towerType.pika;
        this.money = 100;
        this.mousePos = p(0, 0);
        this.fastforward = false;
        this.frame = false;
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
        var mainGame = ["non", "drag", "pause", "tower"];
        if (mainGame.indexOf(this.states) > -1)
            this.mainGameLoop();
    }
    mainGameLoop() {
        if (this.frame) {
            this.gameDrawLoop();
            if (this.states == "tower")
                this.drawTowerMenu();
            else
                this.drawMapUi();
        }
        if (this.fastforward || this.frame)
            if (!this.paused)
                this.gameTickLoop();
        this.frame = !this.frame;
    }
    gameTickLoop() {
        if (this.inte < 0) {
            this.newEnemy();
            this.inte = 100 + Math.round(Math.random() * 100);
        }
        this.inte--;
        //drawMapPath(screen,mapId.test);
        this.projectiles = this.projectiles.filter(p => {
            return !p.tick();
        });
        this.enemies = this.enemies.filter(e => {
            if (!e.move()) {
                return true;
            }
            else {
                this.money++;
                return false;
            }
        });
        this.towers.forEach(t => {
            t.tick(this.enemies, this.projectiles);
        });
    }
    gameDrawLoop() {
        this.screen.fill("green");
        drawMap(this.screen, mapId.test);
        this.projectiles.forEach(p => {
            p.draw(this.screen);
        });
        this.enemies.forEach(e => {
            e.draw(this.screen);
        });
        if (this.highlight)
            this.highlight.drawRange(this.screen);
        this.towers.forEach(t => {
            t.draw(this.screen);
        });
        this.screen.drawText("white", "30px Arial", this.money + "$", 0, 30);
    }
    drawTowerMenu() {
        this.screen.fillRect("green", 960, 0, 128, 960);
        if (!this.highlight)
            return;
        arbitraryDrawTower(p(960 + 128, 128), this.highlight.type, this.screen);
        this.screen.drawText("white", "30px Arial", "lvl " + (this.highlight.upgrade + 1), 960, 30 + 248);
        this.screen.drawText("white", "30px Arial", "next upgrade " + (this.highlight.getUpgradeCost()) + "$", 960, 60 + 248);
        drawUiRect(this.screen, uiElement.upgradeButton, 960 + 20 + 128, 960 - 232, 84, 84);
        if (this.paused)
            drawUiRect(this.screen, uiElement.pauseButton, 960 + 15 + 128, 960 - 113, 94, 94);
        else
            drawUiRect(this.screen, uiElement.pauseButton, 960 + 20 + 128, 960 - 108, 84, 84);
        if (this.fastforward)
            drawUiRect(this.screen, uiElement.fastforwardButton, 960 + 15, 960 - 113, 94, 94);
        else
            drawUiRect(this.screen, uiElement.fastforwardButton, 960 + 20, 960 - 108, 84, 84);
        if (this.states == "drag")
            arbitraryDrawTower(this.mousePos, towerType.pika, this.screen);
    }
    drawMapUi() {
        this.screen.fillRect("green", 960, 0, 128, 960);
        if (this.selectedTower) {
            var tData = towerInfo(this.selectedTower);
            this.screen.drawText("white", "30px Arial", this.selectedTower, 960, 30);
            this.screen.drawText("white", "30px Arial", tData.upgrades[0].cost + "$", 960, 60);
        }
        var sp = 0;
        var col = 0;
        this.towersAvailable.forEach(t => {
            this.screen.fillRect("blue", 960 + 10 + (128 * sp), 60 + 10 + (128 * col), 108, 108);
            arbitraryDrawTower(p(960 + 64 + (128 * sp), 124 + (col * 128)), t, this.screen);
            if (sp)
                col++;
            if (sp)
                sp = 0;
            else
                sp = 1;
        });
        if (this.paused)
            drawUiRect(this.screen, uiElement.pauseButton, 960 + 15 + 128, 960 - 113, 94, 94);
        else
            drawUiRect(this.screen, uiElement.pauseButton, 960 + 20 + 128, 960 - 108, 84, 84);
        if (this.fastforward)
            drawUiRect(this.screen, uiElement.fastforwardButton, 960 + 15, 960 - 113, 94, 94);
        else
            drawUiRect(this.screen, uiElement.fastforwardButton, 960 + 20, 960 - 108, 84, 84);
        if (this.states == "drag")
            arbitraryDrawTower(this.mousePos, towerType.pika, this.screen);
    }
    onMouseClick(x, y) {
        this.checkUI(x, y);
    }
    onMouseUp(x, y) {
        if (this.states == "drag") {
            this.tryRelease(x, y);
            this.states = "non";
        }
    }
    checkUI(x, y) {
        var pt = p(x, y);
        if (pt.isInside(960 + 128 + 20, 960 - 108, 84, 84)) { //pause button
            this.paused = !this.paused;
        }
        if (pt.isInside(960 + 20, 960 - 108, 84, 84)) { //fastforward button
            this.fastforward = !this.fastforward;
        }
        if (this.states != "tower")
            return;
        if (pt.isInside(960 + 20 + 128, 960 - 232, 84, 84)) { //upgrade
            this.money -= this.highlight.tryUpgrade(this.money);
        }
    }
    tryRelease(x, y) {
        if (!this.canPlace(this.selectedTower, x, y))
            return;
        var cost = towerInfo(this.selectedTower).upgrades[0].cost;
        if (this.money < cost)
            return;
        this.money -= cost;
        this.towers.push(new tower(p(x, y), this.selectedTower));
    }
    onMouseDown(x, y) {
        if (x <= 960)
            this.highlight = this.getHightlight(x, y);
        if (this.highlight && x <= 960)
            this.states = "tower";
        else if (x <= 960)
            this.states = "non";
        var ct;
        if (x > 960 && this.states == "non")
            ct = this.getClickedTower(x, y);
        if (ct) {
            this.selectedTower = this.getClickedTower(x, y);
            this.states = "drag";
        }
    }
    onMouseMove(x, y) {
        this.mousePos.x = x;
        this.mousePos.y = y;
    }
    canPlace(t, x, y) {
        if (y > 960)
            return false;
        //to-do
        return true;
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
    getClickedTower(x, y) {
        var out;
        var pt = p(x, y);
        var sp = 0;
        var col = 0;
        this.towersAvailable.forEach(t => {
            if (pt.isInside(960 + (128 * sp), 60 + (128 * col), 128, 128))
                out = t;
            if (sp)
                col++;
            if (sp)
                sp = 0;
            else
                sp = 1;
        });
        return out;
    }
}
