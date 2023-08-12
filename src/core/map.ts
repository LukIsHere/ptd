import { img } from "./images.js";
import { point,p } from "./interfaces.js";
import { ctx } from "./screen.js"

interface mapData{
    width:number,
    height:number,
    path:point[]
    src:string,
    i:undefined|img;
}

export enum mapId{
    test = "test"
}

export const maps:{ [id in mapId]: mapData } = {
    test:{
        width:16,
        height:16,
        path:[p(-1,110),p(392,129),p(392,861),p(157,861),p(157,633),p(661,631),p(678,301),p(964,274)],
        src:"./assets/test_map.png",
        i:undefined
    }
}

export function loadMaps(){
    return new Promise((res,rej)=>{
        var todo = 0
        var done = 0
        Object.keys(maps).forEach(e=>{
            todo++;
            maps[e].i = new img(maps[e].src,()=>{
                done++;
                if(todo==done){
                    res(maps)
                }
            })
        })
        if(todo==0)
            res(maps)
    })
}

export function drawMap(screen:ctx,map:mapId){
    screen.drawImage(maps[map].i,0,0,maps[map].width*60,maps[map].height*60);
}

export function drawMapPath(screen:ctx,map:mapId){
    var path = maps[map].path;
    for(var i = 1;i<path.length;i++){
        screen.drawLine("red",path[i-1].x,path[i-1].y,path[i].x,path[i].y,10)
    }
}