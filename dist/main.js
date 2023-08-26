import { game } from "./core/game.js";
const gm = new game();
gm.load().then(e => {
    console.log(gm);
    setInterval(() => {
        gm.drawLoop();
    }, 1000 / 30);
});
