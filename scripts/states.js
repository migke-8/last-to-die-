import UI from "./UI.js";
import { canvas, Rectangle } from "./general.js";
import { player, resetPlayer } from "./player.js";
import { resetScoreParticle, scoreParticle } from "./score-particle.js";
import spawnner from "./spawner.js";
import Enemy from "./enemy.js";
import { inputs } from "./input.js";
import Projectile from "./projectile.js";
import Particle from "./particle.js";
import { grayScale, setGrayScale, setTransitionTo } from "./main.js";
import TextInfo from "./textInfo.js";
import { loseSound, mainMusic, menuMusic, muteMusic, muteSound, unmuteSound } from "./sounds.js";
import pauseButton from "./pause-button.js";
export const configuration = {
    selectedIndex: 0,
    options: ['mute sound', 'mute music', 'gray scale', 'exit'],
    rectangles: [new Rectangle(48, 67, 144 , 13), new Rectangle(47, 117, 145 , 13), new Rectangle(48, 167, 144 , 13), new Rectangle(91, 217, 57 , 13)],
    canExit: false,
    lastState: null,
    soundMuted: false,
    musicMuted: false,
    update()
    {
        mainMusic.pause();
        mainMusic.currentTime = 0;
        menuMusic.pause();
        menu.currentTime = 0;
        let scale = canvas.getBoundingClientRect().width/canvas.width;
        let canvasTouchX = (inputs.touchX-canvas.getBoundingClientRect().x)/scale;
        let canvasTouchY = (inputs.touchY-canvas.getBoundingClientRect().y)/scale;
        for(let i = 0;i<this.rectangles.length;i++)
        {
            if(canvasTouchX>=this.rectangles[i].x&&canvasTouchX<=this.rectangles[i].x+this.rectangles[i].width)
            {
                if(canvasTouchY>=this.rectangles[i].y&&canvasTouchY<=this.rectangles[i].y+this.rectangles[i].height)
                {
                    if(inputs.taped&&this.canSelect)
                    {
                        this.canSelect = false;
                        if(this.selectedIndex !== i)
                        {
                            this.selectedIndex = i;
                        }
                        else
                        {
                            this.doAction(this.options[i]);
                        }
                    }
                    else if(!inputs.taped)
                    {
                        this.canSelect = true;
                    }
                }
            }
        }
    },
    render(ctx)
    {
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.font = '25px game';
        ctx.fillText('configurations', canvas.width/2, 30);
        // for(let r of this.rectangles)
        // {
        //     ctx.fillStyle = 'red';
        //     ctx.fillRect(r.x, r.y, r.width, r.height);
        // }
        for(let i = 0;i<this.options.length;i++)
        {
            ctx.fillStyle = 'white';
            ctx.font = '20px game';
            if(this.selectedIndex===i)
            {
                ctx.fillStyle = 'yellow';
                ctx.font = '25px game';
            }
            ctx.fillText(this.options[i], canvas.width/2, 80+i*50);
            if(this.options[i] === 'mute sound')
            {
                ctx.fillText(this.soundMuted, canvas.width/2, 100+i*50);
            }
            if(this.options[i] === 'mute music')
            {
                ctx.fillText(this.musicMuted, canvas.width/2, 100+i*50);
            }
            if(this.options[i] === 'gray scale')
            {
                ctx.fillText(grayScale, canvas.width/2, 100+i*50);
            }
        }
    },
    reset()
    {
        this.curOptionindex = 0;
        this.canExit = false;
        this.lastState = null;
        this.soundMuted = false;
        this.musicMuted = false;
    },
    doAction(str)
    {
        if(str === 'mute sound')
        {
            this.soundMuted = this.soundMuted?false:true;
            if(this.soundMuted)
            {
                muteSound();
            }
            else
            {
                unmuteSound();
            }
        }
        if(str === 'mute music')
        {
            this.musicMuted = this.musicMuted?false:true;
            if(this.musicMuted)
            {
                muteMusic();
            }
            else
            {
                unmuteSound();
            }
        }
        if(str === 'gray scale')
        {
            setGrayScale(grayScale?false:true);
        }
        if(str === 'exit')
        {
            curState = this.lastState;
        }
    }
}
export let curState = menu;
export let canChangeState = true;
export function setCanChangeState(bool){
    canChangeState = bool;
}
export function setCurState(state){
    if(canChangeState)
    curState = state;
}
