import { player } from "./player.js";
import { canvas } from "./general.js";
export let inputs = {
    swipes: [],
    treshHold: 30,
    timer:0,
    taps:0,
    depressed: true,
    pressed:false,
    taped: false,
    doubleTaped: false,
    swipeLeft: false,
    swipeRight: false,
    swipeUp: false,
    swipeDown: false,
    update()
    {
        this.timer++;
        if(this.pressed)
        {
            this.timer = 0;
            if(this.depressed)
            {
                this.depressed = false;
                this.taps++;
            }
        }
        if(this.pressed&&this.taps>0)
        {
            this.taped = true;
        }
        else
        {
            this.taped = false;
        }
        if(this.pressed&&this.taps>1)
        {
            this.doubleTaped = true;
        }
        else
        {
            this.doubleTaped = false;
        }
        if(this.timer>7)
        {
            this.timer = 0;
            this.taps = 0;
            this.depressed = true;
            this.pressed = false;
        }
        this.swipeLeft = this.swipes.indexOf('swipe left')!==-1;
        this.swipeRight = this.swipes.indexOf('swipe right')!==-1;
        this.swipeUp = this.swipes.indexOf('swipe up')!==-1;
        this.swipeDown = this.swipes.indexOf('swipe down')!==-1;
    }
};
document.addEventListener('keydown', (e)=>{
    if(e.code === 'Space')
    {
        inputs.pressed = true;
    }
    if(e.code === 'ArrowRight')
    {
        if(inputs.swipes.indexOf('swipe right'))
        {
            inputs.swipes.push('swipe right')
        }
    }
    if(e.code === 'ArrowLeft')
    {
        if(inputs.swipes.indexOf('swipe left'))
        {
            inputs.swipes.push('swipe left');
        }
    }
    if(e.code === 'ArrowUp')
    {
        if(inputs.swipes.indexOf('swipe up'))
        {
            inputs.swipes.push('swipe up')
        }
    }
    if(e.code === 'ArrowDown')
    {
        if(inputs.swipes.indexOf('swipe down'))
        {
            inputs.swipes.push('swipe down');
        }
    }
});
document.addEventListener('keyup', (e)=>{
    if(e.code === 'Space')
    {
        inputs.pressed = false;
        inputs.depressed = true;
    }
    if(e.code === 'ArrowRight')
    {
        inputs.swipes.splice(inputs.swipes.indexOf('swipe right'), 1);
    }
    if(e.code === 'ArrowLeft')
    {
        inputs.swipes.splice(inputs.swipes.indexOf('swipe left'), 1);
    }
    if(e.code === 'ArrowUp')
    {
        inputs.swipes.splice(inputs.swipes.indexOf('swipe up'), 1);
    }
    if(e.code === 'ArrowDown')
    {
        inputs.swipes.splice(inputs.swipes.indexOf('swipe down'), 1);
    }
});
document.addEventListener('touchstart', (e)=>{
    inputs.pressed = true;
    inputs.touchX = e.changedTouches[0].pageX;
    inputs.touchY = e.changedTouches[0].pageY;
});
document.addEventListener('touchend', (e)=>{
    inputs.pressed = false;
    inputs.depressed = true;
    player.shoot = true;
    inputs.swipes.splice(inputs.swipes.indexOf('swipe right'), 1);
    inputs.swipes.splice(inputs.swipes.indexOf('swipe left'), 1);
    inputs.swipes.splice(inputs.swipes.indexOf('swipe up'), 1);
    inputs.swipes.splice(inputs.swipes.indexOf('swipe down'), 1);
});
document.addEventListener('touchmove', (e)=>{
    inputs.swipeDistanceX = inputs.touchX-e.changedTouches[0].pageX;
    if(inputs.swipeDistanceX<-inputs.treshHold&&inputs.swipes.indexOf('swipe right') === -1)
    {
        inputs.swipes.push('swipe right');
    }
    if(inputs.swipeDistanceX>inputs.treshHold&&inputs.swipes.indexOf('swipe left') === -1)
    {
        inputs.swipes.push('swipe left');
    }
    inputs.swipeDistanceY = inputs.touchY-e.changedTouches[0].pageY;
    if(inputs.swipeDistanceY<-inputs.treshHold&&inputs.swipes.indexOf('swipe down') === -1)
    {
        inputs.swipes.push('swipe down');
    }
    if(inputs.swipeDistanceY>inputs.treshHold&&inputs.swipes.indexOf('swipe up') === -1)
    {
        inputs.swipes.push('swipe up');
    }
});
document.addEventListener('mousedown', (e)=>{
    inputs.pressed = true;
    inputs.touchX = e.pageX;
    inputs.touchY = e.pageY;
});
document.addEventListener('mouseup', ()=>{
    inputs.pressed = false;
    inputs.depressed = true;
});