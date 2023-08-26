import { img } from "./images.js";
import { projectile, projectileType } from "./projectiles.js";
import { drawRangeCircle } from "./ui.js";
export var towerType;
(function (towerType) {
    towerType["pika"] = "pika";
})(towerType || (towerType = {}));
export var aim;
(function (aim) {
    aim[aim["first"] = 0] = "first";
    aim[aim["last"] = 1] = "last";
    aim[aim["close"] = 2] = "close";
    aim[aim["strong"] = 3] = "strong";
})(aim || (aim = {}));
const towers = {
    pika: {
        size: 60,
        upgrades: [
            {
                cost: 35,
                damage: 2,
                atackSpeed: 1,
                range: 5
            }
        ],
        path: "./assets/R.png",
        i: undefined
    }
};
export function loadTowers() {
    return new Promise((res, rej) => {
        var todo = 0;
        Object.keys(towers).forEach(e => {
            todo++;
            towers[e].i = new img(towers[e].path, () => {
                todo--;
                if (todo == 0) {
                    res(towers);
                }
            });
        });
    });
}
export class tower {
    constructor(pos, type) {
        this.upgrade = 0;
        this.pos = pos;
        this.type = type;
        this.priority = aim.first;
    }
    static tryPlace(pos, type, map, other) {
        if (this.canPlace(pos, type, map, other))
            return new tower(pos, type);
        return undefined;
    }
    static canPlace(pos, type, map, other) {
        //to-do placement logic
        return true;
    }
    inRange(target) {
        var me = towers[this.type];
        var upgrade = me.upgrades[this.upgrade];
        return this.pos.distance(target.pos) <= upgrade.range * 30;
    }
    getAimFirstTarget(enemies) {
        var target = undefined;
        var distance = Infinity;
        enemies.forEach(e => {
            if (!this.inRange(e))
                return;
            if (e.pHp <= 0)
                return;
            var dst = this.pos.distance(e.pos);
            if (dst > distance)
                return;
            distance = dst;
            target = e;
        });
        return target;
    }
    tick(enemies, projectiles) {
        this.lastShot++;
        var me = towers[this.type];
        var upgrade = me.upgrades[this.upgrade];
        if (this.lastShot / 30 < upgrade.atackSpeed)
            return;
        var target = undefined;
        switch (this.priority) {
            case aim.first:
                target = this.getAimFirstTarget(enemies);
                break;
        }
        if (target == undefined)
            return;
        target.pHp -= upgrade.damage;
        this.lastShot = 0;
        projectiles.push(new projectile(this.pos, projectileType.electroball, target, upgrade.damage));
    }
    draw(screen) {
        var me = towers[this.type];
        if (me.i == undefined)
            return;
        screen.drawImageCenter(me.i, this.pos.x, this.pos.y, me.size, me.size);
    }
    drawRange(screen) {
        var me = towers[this.type];
        var upgrade = me.upgrades[this.upgrade];
        drawRangeCircle(screen, this.pos, upgrade.range);
    }
    tryUpgrade(money) {
        var up = towers[this.type].upgrades;
        if (!up[this.upgrade + 1])
            return 0;
        if (up[this.upgrade + 1].cost > money)
            return 0;
        this.upgrade++;
        return up[this.upgrade].cost;
    }
}
export function arbitraryDrawTower(p, type, screen) {
    var me = towers[type];
    if (me.i == undefined)
        return;
    screen.drawImageCenter(me.i, p.x, p.y, me.size, me.size);
}
export function towerInfo(t) {
    return towers[t];
}
