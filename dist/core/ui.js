import { img } from "./images.js";
export var uiElement;
(function (uiElement) {
    uiElement["rangeA"] = "rangeA";
    uiElement["rangeB"] = "rangeB";
    uiElement["pauseButton"] = "pButton";
    uiElement["fastforwardButton"] = "ffButton";
})(uiElement || (uiElement = {}));
const uiElements = {
    rangeA: {
        path: "./assets/rangeCircleA.png",
        i: undefined
    },
    rangeB: {
        path: "./assets/rangeCircleB.png",
        i: undefined
    },
    pButton: {
        path: "./assets/pButton.png",
        i: undefined
    },
    ffButton: {
        path: "./assets/ffButton.png",
        i: undefined
    }
};
export function loadUi() {
    return new Promise((res, rej) => {
        var todo = 0;
        Object.keys(uiElements).forEach(e => {
            todo++;
            uiElements[e].i = new img(uiElements[e].path, () => {
                todo--;
                if (todo == 0) {
                    res(uiElements);
                }
            });
        });
    });
}
var rotation = 0;
export function drawRangeCircle(screen, pos, range) {
    rotation++;
    screen.drawImageCenter(uiElements[uiElement.rangeA].i, pos.x, pos.y, range * 30 * 2, range * 30 * 2);
    screen.drawImageCenterR(uiElements[uiElement.rangeB].i, pos.x, pos.y, range * 30 * 2, range * 30 * 2, rotation);
}
export function drawUiRect(screen, e, x, y, w, h) {
    screen.drawImage(uiElements[e].i, x, y, w, h);
}
