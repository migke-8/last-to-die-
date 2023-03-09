import UI from "./UI.js";
import { canvas } from "./general.js";
import { player, resetPlayer } from "./player.js";
import { resetPotion, potion } from "./potion.js";
import spawnner from "./spawner.js";
import Enemy from "./enemy.js";
import { inputs } from "./input.js";
import Projectile from "./projectile.js";
import Particle from "./particle.js";
import { setTransitionTo } from "./main.js";
import TextInfo from "./textInfo.js";
import { loseSound, muteSound, unmuteSound } from "./sounds.js";
import pauseButton from "./pause-button.js";
export const normal = {
    justStarted: true,
    timer:0,
    update(){
        if(!this.justStarted)
        {
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
            potion.update();
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
            potion.render(ctx);
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
        resetPotion();
        resetPlayer();
        spawnner.reset();
        UI.reset();
        Projectile.clear();
        Particle.clear();
        TextInfo.clear();
    }
};
export const menu = {
    options: ['start', 'configurations', 'exit'],
    curOptionindex:0,
    canUp: true,
    canDown: true,
    highScore: 0,
    canSelect: true,
    update()
    {
        if(inputs.swipeUp&&this.canUp)
        {
            this.canUp = false;
            this.curOptionindex--;
        }
        else if(!inputs.swipeUp)
        {
            this.canUp = true;
        }
        if(inputs.swipeDown&&this.canDown)
        {
            this.canDown = false;
            this.curOptionindex++;
        }
        else if(!inputs.swipeDown)
        {
            this.canDown = true;
        }
        if(this.curOptionindex<0)
        {
            this.curOptionindex = this.options.length-1;
        }
        else if(this.curOptionindex>=this.options.length)
        {
            this.curOptionindex = 0;
        }
        if(inputs.taped&&this.canSelect)
        {
            this.canSelect = false;
            this.doAction(this.options[this.curOptionindex]);
        }
        else if(!inputs.taped)
        {
            this.canSelect = true;
        }
    },
    render(ctx)
    {
        let mainText = 'lasttodie!';
        ctx.fillStyle = 'yellow';
        ctx.textAlign = 'center';
        ctx.font = '50px game'
        ctx.fillStyle = 'white';
        ctx.fillText(mainText.substring(0, 4), canvas.width/2, 30);
        ctx.fillText(mainText.substring(4, 6), canvas.width/2, 60);
        ctx.fillStyle = 'red';
        ctx.fillText(mainText.substring(6, mainText.length), canvas.width/2, 90);

        for(let i = 0;i<this.options.length;i++)
        {
            let str = this.options[i];
            ctx.font = '20px game'
            ctx.fillStyle = 'white';
            if(this.curOptionindex === i)
            {
                ctx.font = '25px game';
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
        this.highScore = 0;
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
        if(str === 'exit')
        {
            window.close();
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
    canSelect: true,
    update()
    {
        if(inputs.swipeUp&&this.canUp)
        {
            this.canUp = false;
            this.curOptionindex--;
        }
        else if(!inputs.swipeUp)
        {
            this.canUp = true;
        }
        if(inputs.swipeDown&&this.canDown)
        {
            this.canDown = false;
            this.curOptionindex++;
        }
        else if(!inputs.swipeDown)
        {
            this.canDown = true;
        }
        if(this.curOptionindex<0)
        {
            this.curOptionindex = this.options.length-1;
        }
        else if(this.curOptionindex>=this.options.length)
        {
            this.curOptionindex = 0;
        }
        if(inputs.taped&&this.canSelect)
        {
            this.canSelect = false;
            this.doAction(this.options[this.curOptionindex]);
        }
        else if(!inputs.taped)
        {
            this.canSelect = true;
        }
    },
    render(ctx)
    {
        ctx.fillStyle = 'white';
        ctx.font = '40px game';
        ctx.textAlign = 'center';
        ctx.fillText('paused', canvas.width/2, 30);
        for(let i = 0;i<this.options.length;i++)
        {
            ctx.fillStyle = 'white';
            ctx.font = '20px game';
            if(this.curOptionindex === i)
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
        }
        if(str === 'exit')
        {
            menu.reset();
            curState = menu;
        }
        if(str === 'stats')
        {
            stats.reset();
            setTransitionTo(stats);
        }
        if(str === 'configurations')
        {
            configuration.reset();
            configuration.lastState = this;
            setTransitionTo(configuration)
        }
    }
};
export const stats = {
    canExit:false,
    playerStats: ['attack:', 'max mana:', 'max hp:'],
    curStatIndex:0,
    canDown: true,
    canUp: true,
    canRight: true,
    canLeft: true,
    update()
    {
        if(inputs.doubleTaped&&this.canExit)
        {
            pause.reset();
            pause.canSelect = false;
            setTransitionTo(pause);
        }
        else if(!inputs.doubleTaped)
        {
            this.canExit = true;
        }
        if(inputs.swipeUp&&this.canUp)
        {
            this.canUp = false;
            this.curStatIndex++;
        }
        else if(!inputs.swipeUp)
        {
            this.canUp = true;
        }
        if(inputs.swipeDown&&this.canDown)
        {
            this.canDown = false;
            this.curStatIndex++;
        }
        else if(!inputs.swipeDown)
        {
            this.canDown = true;
        }
        if(this.curStatIndex<0)
        {
            this.curStatIndex = this.playerStats.length-1;
        }
        if(this.curStatIndex>=this.playerStats.length)
        {
            this.curStatIndex = 0;
        }
        if(inputs.swipeRight&&this.canRight)
        {
            this.canRight = false;
            this.increaseStat(this.playerStats[this.curStatIndex]);
        }
        else if(!inputs.swipeRight)
        {
            this.canRight = true;
        }
        else if(!inputs.swipeLeft)
        {
            this.canLeft = true;
        }
    },
    render(ctx)
    {
        let mainText = 'stats';
        ctx.fillStyle = 'yellow';
        ctx.textAlign = 'center';
        ctx.font = '40px game'
        ctx.fillStyle = 'white';
        ctx.fillText(mainText, canvas.width/2, 30);
        ctx.fillStyle = 'red';
        ctx.fillText(mainText.substring(6, mainText.length), canvas.width/2, 90);

        for(let i = 0;i<this.playerStats.length;i++)
        {
            let str = this.playerStats[i];
            ctx.font = '20px game'
            ctx.fillStyle = 'white';
            if(this.curStatIndex === i)
            {
                ctx.font = '25px game';
                ctx.fillStyle = 'yellow';
            }
            ctx.fillText(str, canvas.width/2, 50+i*60);
            if(str === 'attack:')
            {
                ctx.fillText(player.attack+'  +', canvas.width/2, 80+i*60)
            }
            if(str === 'max mana:')
            {
                ctx.fillText(player.maxMana+'  +', canvas.width/2, 80+i*60)
            }
            if(str === 'max hp:')
            {
                ctx.fillText(player.maxHp+'  +', canvas.width/2, 80+i*60)
            }
        }
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
            if(str === 'max mana:')
            {
                player.maxMana++;
            }
            if(str === 'max hp:')
            {
                player.maxHp++;
                player.hp++;
            }
            player.levelPoints--;
        }
    },
    reset()
    {
        this.canExit = false;
        this.curStatIndex = 0;
        this.canDown = true;
        this.canUp = true;
        this.canRight = true;
        this.canLeft = true;
    }
}
export const configuration = {
    curOptionindex: 0,
    options: ['mute sound', 'mute music', 'exit'],
    canExit: false,
    lastState: null,
    soundMuted: false,
    musicMuted: false,
    update()
    {
        if(inputs.swipeDown&&this.canDown)
        {
            this.canDown = false;
            this.curOptionindex++;
        }
        else if(!inputs.swipeDown)
        {
            this.canDown = true;
        }
        if(inputs.swipeUp&&this.canUp)
        {
            this.canUp = false;
            this.curOptionindex--;
        }
        else if(!inputs.swipeUp)
        {
            this.canUp = true;
        }
        if(this.curOptionindex<0)
        {
            this.curOptionindex = 0;
        }
        if(this.curOptionindex>=this.options.length)
        {
            this.curOptionindex = this.options.length-1;
        }
        if(inputs.taped&&this.canChangeValue)
        {
            this.canChangeValue = false;
            this.doAction(this.options[this.curOptionindex]);
        }
        else if(!inputs.taped)
        {
            this.canChangeValue = true;
        }
    },
    render(ctx)
    {
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.font = '25px game';
        ctx.fillText('configurations', canvas.width/2, 30);
        for(let i = 0;i<this.options.length;i++)
        {
            ctx.fillStyle = 'white';
            ctx.font = '20px game';
            if(this.curOptionindex===i)
            {
                ctx.fillStyle = 'yellow';
                ctx.font = '25px game';
            }
            ctx.fillText(this.options[i], canvas.width/2, 80+i*40);
            if(this.options[i] === 'mute sound')
            {
                ctx.fillText(this.soundMuted, canvas.width/2, 100+i*40);
            }
            if(this.options[i] === 'mute music')
            {
                ctx.fillText(this.musicMuted, canvas.width/2, 100+i*40);
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