import { canvas} from "./general.js";
import { curState, setCurState } from "./states.js";
class Transition{
    firstX = canvas.width/2;
    secondX = - canvas.width/2;
    firstScale = 1;
    secondScale = 2;
    exiting = true;
    entering = false;
    constructor(state)
    {
        this.nextState = state;
        this.firstCanvas = document.createElement('canvas');
        this.firstCtx = this.firstCanvas.getContext('2d');
        this.firstCanvas.width = canvas.width;
        this.firstCanvas.height = canvas.height;
        curState.render(this.firstCtx);
        this.firstImage = new Image();
        this.firstImage.src = this.firstCanvas.toDataURL();
        this.secondCanvas = document.createElement('canvas');
        this.secondCtx = this.secondCanvas.getContext('2d');
        this.secondCanvas.width = canvas.width;
        this.secondCanvas.height = canvas.height;
        state.render(this.secondCtx)
        this.secondImage = new Image;
        this.secondImage.src = this.secondCanvas.toDataURL();
    }
    update()
    {
        if(!this.stoped)
        {
            if(this.exiting)
            {
                this.firstScale+=0.2/3;
                if(this.firstScale>=2)
                {
                    this.exiting = false;
                    this.firstScale = 2;
                }
            }
            if(!this.exiting&&!this.entering)
            {
                this.firstX+=6;
                this.secondX+=6;
                if(this.secondX>=canvas.width/2)
                {
                    this.secondX = canvas.width/2;
                    this.entering = true;
                }
            }
            if(this.entering)
            {
                this.secondScale-=0.2/5;
                if(this.secondScale<=1)
                {
                    this.secondScale = 1;
                    this.entering = false;
                    this.stoped = true;
                    setCurState(this.nextState);
                }
            }
        }
    }
    render(ctx)
    {
        ctx.drawImage(this.firstImage, this.firstX-this.firstImage.width/(this.firstScale*2), canvas.height/2-this.firstImage.height/(this.firstScale*2), this.firstImage.width/this.firstScale, canvas.height/this.firstScale);
        ctx.drawImage(this.secondImage, this.secondX-this.secondImage.width/(this.secondScale*2), canvas.height/2-this.secondImage.height/(this.secondScale*2), this.secondImage.width/this.secondScale, canvas.height/this.secondScale);
    }
}
export default Transition;