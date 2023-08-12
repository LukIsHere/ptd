import { img } from "./images.js";
import { point } from "./interfaces.js";
import { ctx } from "./screen.js";

interface element{
    path,
    i:undefined|img;
}

export enum uiElement{
    rangeA = "rangeA",
    rangeB = "rangeB"
}

const uiElements:{ [key in uiElement]: element } = {
    rangeA:{
        path:"./assets/rangeCircleA.png",
        i:undefined
    },
    rangeB:{
        path:"./assets/rangeCircleB.png",
        i:undefined
    }
}

export function loadUi(){
    return new Promise((res,rej)=>{
        var todo = 0
        Object.keys(uiElements).forEach(e=>{
            todo++;
            uiElements[e].i = new img(uiElements[e].path,()=>{
                todo--;
                if(todo==0){
                    res(uiElements)
                }
            })
        })
    })
    
}
var rotation = 0
export function drawRangeCircle(screen:ctx,pos:point,range:number){
    rotation++;
    screen.drawImageCenter(uiElements[uiElement.rangeA].i,pos.x,pos.y,range*30*2,range*30*2)
    screen.drawImageCenterR(uiElements[uiElement.rangeB].i,pos.x,pos.y,range*30*2,range*30*2,rotation)
}