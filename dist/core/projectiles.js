import { enemy } from "./enemy.js";
import { img } from "./images.js";
import { vector } from "./interfaces.js";
export var projectileType;
(function (projectileType) {
    projectileType["electroball"] = "electroball";
})(projectileType || (projectileType = {}));
const projectiles = {
    electroball: {
        speed: 12,
        height: 30,
        width: 30,
        path: "./assets/electro_ball.png",
        i: undefined
    }
};
export function loadProjectiles() {
    return new Promise((res, rej) => {
        var todo = 0;
        Object.keys(projectiles).forEach(e => {
            todo++;
            projectiles[e].i = new img(projectiles[e].path, () => {
                todo--;
                if (todo == 0) {
                    res(projectiles);
                }
            });
        });
    });
}
export class projectile {
    constructor(pos, type, target, damage) {
        this.done = false;
        this.pos = pos.clone();
        this.type = type;
        this.target = target;
        this.damage = damage;
    }
    tick() {
        var me = projectiles[this.type];
        if (this.done)
            return true;
        if (!(this.target instanceof enemy))
            return true;
        var dir = vector.get(this.pos, this.target.pos);
        if (dir.distance() < me.speed) {
            this.target.hp -= this.damage;
            this.done = true;
            return true;
        }
        this.pos.addVec(dir.normalize().multiply(me.speed));
        return false;
    }
    draw(screen) {
        var me = projectiles[this.type];
        screen.drawImageCenter(me.i, this.pos.x, this.pos.y, me.width, me.height);
    }
}
