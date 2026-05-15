import { Game } from "./game.js";

const game = new Game();
const btn = document.getElementById("start-btn");
btn.onclick = (e) => {
  game.start();
};

// import { binaryCtx, canvas, ctx } from "./general.js";
// import { curState, menu, pause, setCurState } from './states.js';
// import { inputs } from "./input.js";
// import Transition from "./transition.js";
// import { mainMusic, menuMusic } from "./sounds.js";
// import { normal } from "./states.js";
// let shaking = false;
// let shakePower = 6;
// let shakeTimer = 0;
// let maxShakeTime = 0;
// window.onblur = ()=>{
//     if(curState === normal)
//     {
//         pause.reset();
//         pause.canSelect = false;
//         setCurState(pause);
//     }
//     menuMusic.pause();
//     mainMusic.pause();
// };
// export function shake(power, time)
// {
//     shakePower = power;
//     maxShakeTime = time;
//     shaking = true;
// }
// async function init()
// {
//     if(localStorage.getItem('score'))
//     {
//         menu.highScore = Number(localStorage.getItem('score'));
//     }
// }
// let transition = null;
// export function setTransitionTo(state)
// {
//     transition = new Transition(state);
// }
//
// export let grayScale = false;
// export function setGrayScale(bool)
// {
//     grayScale = bool;
// }
