import { binaryCtx, canvas, ctx } from "./general.js";
import { curState, menu, pause, setCurState } from './states.js';
import { inputs } from "./input.js";
import Transition from "./transition.js";
import { mainMusic, menuMusic } from "./sounds.js";
import { normal } from "./states.js";
let shaking = false;
let shakePower = 6;
let shakeTimer = 0;
let maxShakeTime = 0;
window.onblur = ()=>{
    if(curState === normal)
    {
        pause.reset();
        pause.canSelect = false;
        setCurState(pause);
    }
    menuMusic.pause();
    mainMusic.pause();
};
export function shake(power, time)
{
    shakePower = power;
    maxShakeTime = time;
    shaking = true;
}
async function init()
{
    if(localStorage.getItem('score'))
    {
        menu.highScore = Number(localStorage.getItem('score'));
    }
}
let transition = null;
export function setTransitionTo(state)
{
    transition = new Transition(state);
}

export let grayScale = false;
export function setGrayScale(bool)
{
    grayScale = bool;
}
function update()
{
    if(!transition)
    {
        if(shaking)
        {
            shakeTimer++;
            if(shakeTimer>=maxShakeTime)
            {
                shakeTimer = 0;
                shaking = false;
            }
        }
        inputs.update();
        curState.update();
    }
    else
    {
        transition.update();
        if(transition.stoped)
        {
            transition = null;
        }
    }
}
function render()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    if(!transition)
    {
        if(shaking)
        {
            preShake();
        }
        curState.render(ctx);
        if(shaking)
        {
            ctx.restore();
        }
    }
    else
    {
        transition.render(ctx);
    }
    if(grayScale)
    {
        let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let pixels = data.data;
        for(let i = 0;i<pixels.length;i+=4)
        {
            let red = pixels[i];
            let green = pixels[i+1];
            let blue = pixels[i+2];
            let color = (red+green+blue)/3;
            pixels[i] = color;
            pixels[i+1] = color;
            pixels[i+2] = color;
        }
        ctx.putImageData(data, 0, 0);
    }
}
let then = Date.now();
let now;
let fps = 65;
function loop()
{
    now = Date.now();
    let difference = now-then;
    if(difference>1000/fps)
    {
        then = now;
        update();
        render();
    }
    requestAnimationFrame(loop)
}
function preShake()
{
    let xa = Math.random()*shakePower-shakePower/2, ya = Math.random()*shakePower-shakePower/2;
    ctx.translate(xa, ya);
}
async function start()
{
    await init();
    requestAnimationFrame(loop);
}
window.onload = start;