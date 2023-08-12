import { img } from "./images.js";
import { vector } from "./interfaces.js";
import { maps } from "./map.js";
export var enemyType;
(function (enemyType) {
    enemyType["baltoy"] = "baltoy";
})(enemyType || (enemyType = {}));
const enemies = {
    baltoy: {
        hp: 3,
        speed: 5,
        height: 60,
        width: 60,
        path: "./assets/baltoy.png",
        i: undefined
    }
};
export function loadEnemies() {
    return new Promise((res, rej) => {
        var todo = 0;
        Object.keys(enemies).forEach(e => {
            todo++;
            enemies[e].i = new img(enemies[e].path, () => {
                todo--;
                if (todo == 0) {
                    res(enemies);
                }
            });
        });
    });
}
export class enemy {
    constructor(type, map) {
        this.goto = 0;
        this.done = false;
        this.type = type;
        this.hp = enemies[type].hp;
        this.pHp = enemies[type].hp;
        this.map = map;
        this.pos = maps[map].path[0].clone();
    }
    draw(screen) {
        if (enemies[this.type].i == undefined)
            throw "no asset";
        screen.drawImageCenter(enemies[this.type].i, this.pos.x, this.pos.y, enemies[this.type].width, enemies[this.type].height);
    }
    move() {
        var me = enemies[this.type];
        var map = maps[this.map];
        if (this.hp <= 0)
            return true;
        if (map.path.length == this.goto)
            return true;
        var target = map.path[this.goto];
        var direction = vector.get(this.pos, target);
        var totravel = me.speed;
        if (direction.distance() <= me.speed) {
            this.pos.x = target.x;
            this.pos.y = target.y;
            totravel -= direction.distance();
            this.goto++;
            if (map.path.length == this.goto)
                return true;
            target = map.path[this.goto];
            direction = vector.get(this.pos, target);
        }
        this.pos.addVec(direction.normalize().multiply(totravel)); //'ll need bug fix
        return false;
    }
}
