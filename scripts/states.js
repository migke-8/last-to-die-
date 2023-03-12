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
export const normal = {
    justStarted: true,
    timer:0,
    update(){
        menuMusic.pause()
        menuMusic.currentTime = 0;
        if(!this.justStarted)
        {
            mainMusic.play();
            pauseButton.update();
            spawnner.update();
            player.update();
            for(let e of Enemy.enemies)
            {
                e.update();
            }
            for(let e of Projectile.projectiles)
            {
                e.update();
            }
            for(let e of Particle.particles)
            {
                e.update();
            }
            for(let e of TextInfo.infos)
            {
                e.update();
            }
            scoreParticle.update();
            if(player.score>menu.highScore&UI.canShowScoreMessage)
            {
                UI.newHighScore = true;
            }
            UI.update();
        }
        else
        {
            this.timer++;
            if(this.timer>=60)
            {
                this.timer = 0;
                this.justStarted = false;
            }
        }
    },
    render(ctx){
        if(!this.justStarted)
        {
            for(let e of Particle.particles)
            {
                e.render(ctx);
            }
            player.render(ctx);
            for(let e of Enemy.enemies)
            {
                e.render(ctx);
            }
            for(let e of Projectile.projectiles)
            {
                e.render(ctx);
            }
            for(let e of TextInfo.infos)
            {
                e.render(ctx);
            }
            scoreParticle.render(ctx);
            spawnner.render(ctx);
            pauseButton.render(ctx);
            UI.render(ctx);
        }
        else
        {
            let text = 'good luck!';
            ctx.fillStyle = 'white';
            ctx.font = '40px game';
            ctx.textAlign = 'center';
            ctx.fillText(text, canvas.width/2, canvas.height/2)
        }
    },
    reset()
    {
        this.justStarted = true;
        this.timer = 0;
        resetScoreParticle();
        resetPlayer();
        spawnner.reset();
        UI.reset();
        Projectile.clear();
        Particle.clear();
        TextInfo.clear();
    }
};
export const menu = {
    options: ['start', 'configurations'],
    rectangles: [new Rectangle(84, 137, 72, 13), new Rectangle(17, 167, 206, 13)],
    curOptionindex:0,
    highScore: 0,
    selectedIndex: 0,
    canSelect: true,
    update()
    {
        menuMusic.play();
        mainMusic.pause();
        mainMusic.currentTime = 0;
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
        let mainText = 'lasttodie!';
        ctx.fillStyle = 'yellow';
        ctx.textAlign = 'center';
        ctx.font = '50px game'
        ctx.fillStyle = 'white';
        ctx.fillText(mainText.substring(0, 4), canvas.width/2, 30+Math.cos(Date.now()/150)*3);
        ctx.fillText(mainText.substring(4, 6), canvas.width/2, 60+Math.cos(Date.now()/150)*3);
        ctx.fillStyle = 'red';
        ctx.fillText(mainText.substring(6, mainText.length), canvas.width/2, 90+Math.cos(Date.now()/150)*3);
        // for(let r of this.rectangles)
        // {
        //     ctx.fillStyle = 'red';
        //     ctx.fillRect(r.x, r.y, r.width, r.height);
        // }
        for(let i = 0;i<this.options.length;i++)
        {
            let str = this.options[i];
            ctx.font = '20px game'
            ctx.fillStyle = 'white';
            if(this.selectedIndex === i)
            {
                ctx.font = '25px game'
                ctx.fillStyle = 'yellow';
            }
            ctx.fillText(str, canvas.width/2, 150+i*30);
        }
        ctx.fillStyle = 'black'
        ctx.fillRect(0, canvas.height-12, canvas.width, 12);
        ctx.font = '20px game'
        ctx.fillStyle = 'white';
        ctx.fillText('high-score: '+this.highScore, canvas.width/2, canvas.height-1);
    },
    reset()
    {
        this.curOptionindex = 0;
        this.canUp = true;
        this.canDown = true;
        if(localStorage.getItem('score'))
        {
            menu.highScore = Number(localStorage.getItem('score'));
        }
        else
        {
            this.highScore = 0;
        }
        this.showTimer = 0;
    },
    doAction(str)
    {
        if(str === 'start')
        {
            normal.reset();
            curState = normal;

        }
        if(str === 'configurations')
        {
            configuration.reset();
            configuration.lastState = this;
            curState = configuration;
        }
    }
};
export const over = {
    animating: true,
    maxPositionY: 80,
    curPositionY:-60,
    textVelocity:0,
    canShow: true,
    showIndex: 0,
    canRestart: false,
    canEndAnimation: true,
    canPlaySound: true,
    update()
    {
        menuMusic.pause();
        menuMusic.currentTime = 0;
        mainMusic.pause();
        mainMusic.currentTime = 0;
        if(this.animating)
        {
            this.textVelocity+=0.8;
            this.curPositionY+=this.textVelocity;
            if(this.curPositionY>=this.maxPositionY)
            {
                this.curPositionY = this.maxPositionY;
                this.textVelocity/=-1.7;
                if(this.textVelocity>-0.4)
                {
                    this.animating = false;
                }
            }
            if(inputs.taped&&this.canEndAnimation)
            {
                this.animating = false;
            }
            else if(!inputs.taped)
            {
                this.canEndAnimation = true;
            }
        }
        else
        {
            if(this.canPlaySound)
            {
                this.canPlaySound = false;
                loseSound.play();
            }
            this.showIndex++;
            if(this.showIndex%40 === 0)
            {
                this.canShow = this.canShow?false:true;
            }
            if(inputs.taped&&this.canRestart)
            {
                menu.reset();
                menu.canSelect = false;
                curState = menu;
                canChangeState = false;
            }
            else if(!inputs.taped)
            {
                this.canRestart = true;
            }
        }
    },
    render(ctx)
    {
        if(this.animating)
        {
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.font = '40px game';
            ctx.fillText('game_over', canvas.width/2, this.curPositionY);
        }
        else
        {
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.font = '40px game';
            ctx.fillText('game_over', canvas.width/2, this.maxPositionY);
            if(this.canShow)
            {
                ctx.font = '20px game';
                ctx.fillText('< restart the game >', canvas.width/2, this.maxPositionY+60);
            }
        }
    },
    reset()
    {
        this.animating =  true,
        this.maxPositionY =  80,
        this.curPositionY = -60,
        this.textVelocity = 0,
        this.canShow =  true,
        this.showIndex =  0,
        this.canRestart =  false;
        this.canPlaySound = true;
    }
};
export const pause = {
    curOptionindex: 0,
    options: ['resume', 'stats', 'configurations', 'exit'],
    rectangles: [new Rectangle(74, 67, 91, 13),new Rectangle(84, 97, 72, 13), new Rectangle(17, 127,206, 13), new Rectangle(91, 157, 57, 13)],
    canSelect: true,
    selectedIndex: 0,
    update()
    {
        menuMusic.pause();
        menuMusic.currentTime = 0;
        mainMusic.pause();
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
        ctx.font = '40px game';
        ctx.textAlign = 'center';
        ctx.fillText('paused', canvas.width/2, 30);
        // for(let r of this.rectangles)
        // {
        //     ctx.fillStyle = 'red';
        //     ctx.fillRect(r.x, r.y, r.width, r.height);
        // }
        for(let i = 0;i<this.options.length;i++)
        {
            ctx.fillStyle = 'white';
            ctx.font = '20px game';
            if(this.selectedIndex=== i)
            {
                ctx.fillStyle = 'yellow';
                ctx.font = '25px game';
            }
            ctx.fillText(this.options[i], canvas.width/2, 80+i*30);
        }
    },
    reset()
    {
        this.curOptionindex = 0;
    },
    doAction(str)
    {
        if(str === 'resume')
        {
            curState = normal;
            pauseButton.canPause = false;
            inputs.touchX = 0;
            inputs.touchY = 0;
        }
        if(str === 'exit')
        {
            menu.reset();
            curState = menu;
        }
        if(str === 'stats')
        {
            stats.reset();
            curState = stats;
        }
        if(str === 'configurations')
        {
            configuration.reset();
            configuration.lastState = this;
            curState = configuration;
        }
    }
};
export const stats = {
    canExit:false,
    options: ['attack:', 'mana:', 'health points:', 'exit'],
    rectangles: [new Rectangle(73, 37, 93, 13), new Rectangle(87, 97, 66, 13), new Rectangle(25, 157, 190, 13), new Rectangle(91, 217, 57, 13)],
    selectedIndex: 0,
    yOffset: 0,
    update()
    {
        let scale = canvas.getBoundingClientRect().width/canvas.width;
        let canvasTouchX = (inputs.touchX-canvas.getBoundingClientRect().x)/scale;
        let canvasTouchY = (inputs.touchY-canvas.getBoundingClientRect().y)/scale;
        for(let i = 0;i<this.rectangles.length;i++)
        {
            if(canvasTouchX>=this.rectangles[i].x&&canvasTouchX<=this.rectangles[i].x+this.rectangles[i].width)
            {
                if(canvasTouchY+this.yOffset>=this.rectangles[i].y&&canvasTouchY+this.yOffset<=this.rectangles[i].y+this.rectangles[i].height)
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
                            if(i<this.options.length-1)
                            {
                                this.increaseStat(this.options[i]);
                            }
                            else
                            {
                                curState = pause;
                            }
                        }
                    }
                    else if(!inputs.taped)
                    {
                        this.canSelect = true;
                    }
                }
            }
            if(inputs.swipeUp)
            {
                this.yOffset--;
            }
            if(inputs.swipeDown)
            {
                this.yOffset++;
            }
            if(this.yOffset<0)
            {
                this.yOffset = 0;
            }
            else if(this.yOffset>30)
            {
                this.yOffset = 30;
            }
        }
    },
    render(ctx)
    {
        // for(let r of this.rectangles)
        // {
        //     ctx.fillStyle = 'red';
        //     ctx.fillRect(r.x, r.y-this.yOffset, r.width, r.height);
        // }
        for(let i = 0;i<this.options.length;i++)
        {
            let str = this.options[i];
            ctx.font = '20px game'
            ctx.fillStyle = 'white';
            if(this.selectedIndex === i)
            {
                ctx.font = '25px game';
                ctx.fillStyle = 'yellow';
            }
            ctx.fillText(str, canvas.width/2, 50+i*60-this.yOffset);
            if(str === 'attack:')
            {
                ctx.fillText(player.attack, canvas.width/2, 80+i*60-this.yOffset);
            }
            if(str === 'mana:')
            {
                ctx.fillText(player.mana+'/'+player.maxMana, canvas.width/2, 80+i*60-this.yOffset);
            }
            if(str === 'health points:')
            {
                ctx.fillText(player.hp+'/'+player.maxHp, canvas.width/2, 80+i*60-this.yOffset);
            }
        }
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, 32);
        let mainText = 'stats';
        ctx.fillStyle = 'yellow';
        ctx.textAlign = 'center';
        ctx.font = '40px game'
        ctx.fillStyle = 'white';
        ctx.fillText(mainText, canvas.width/2, 30);
        ctx.fillStyle = 'red';
        ctx.fillText(mainText.substring(6, mainText.length), canvas.width/2, 90);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, canvas.height-21, canvas.width, 21);
        ctx.font = '20px game'
        ctx.fillStyle = 'white';
        ctx.fillText('level points: '+player.levelPoints, canvas.width/2, canvas.height-10);
    },
    increaseStat(str)
    {
        if(player.levelPoints>0)
        {
            if(str === 'attack:')
            {
                player.attack++;
            }
            if(str === 'mana:')
            {
                player.maxMana++;
            }
            if(str === 'health points:')
            {
                player.maxHp++;
                player.hp++;
                if(player.hp>player.maxHp)
                {
                    player.hp = play.maxHp;
                }
            }
            player.levelPoints--;
        }
    },
    reset()
    {
        this.canExit = false;
        this.curOptionIndex = 0;
        this.canDown = true;
        this.canUp = true;
        this.canRight = true;
        this.canLeft = true;
    }
}
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