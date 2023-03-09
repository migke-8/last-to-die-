import { canvas } from "./general.js";
import { inputs } from "./input.js";
import { curState, pause, setCurState } from "./states.js";
let pauseButton = {
    x: 0,
    y: 13,
    update()
    {
        let scale = canvas.getBoundingClientRect().width/canvas.width;
        let canvasTouchX = (inputs.touchX-canvas.getBoundingClientRect().x)/scale;
        let canvasTouchY = (inputs.touchY-canvas.getBoundingClientRect().y)/scale;
        if(canvasTouchX >= this.x&&canvasTouchX<=this.x+28)
        {
            if(canvasTouchY >= this.y&&canvasTouchY<=this.y+8)
            {
                if(inputs.doubleTaped)
                {
                    pause.reset();
                    setCurState(pause)
                }
            }
        }
    },
    render(ctx)
    {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(this.x, this.y, 8, 16);
        ctx.fillRect(this.x+12, this.y, 8, 16);
    }
}
export default pauseButton;