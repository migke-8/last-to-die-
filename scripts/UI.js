import { player } from "./player.js";
import { canvas, randomColors } from "./general.js";
let UI = {
    scoreMessageAlpha:0,
    fadingOut: false,
    colorIndex: 0,
    canShowScoreMessage: true,
    update()
    {
        if(this.newHighScore)
        {
            this.colorIndex++;
            this.scoreMessageAlpha+=this.fadingOut?-0.01:0.05;
            if(this.scoreMessageAlpha>=1)
            {
                this.scoreMessageAlpha = 1;
                this.fadingOut = true;
            }
            if(this.scoreMessageAlpha<=0&&this.fadingOut)
            {
                this.newHighScore = false;
                this.canShowScoreMessage = false;
            }
        }
    },
    render(ctx){
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, canvas.width, 12)
        ctx.fillStyle = '#FFF'
        ctx.font = '20px game';
        let string = 'score: '+player.score;
        ctx.textAlign = 'center';
        ctx.fillText(string, canvas.width/2, 11);

        if(this.newHighScore)
        {
            let string = 'new high-score!'
            ctx.textAlign = 'center';
            ctx.font = '20px game';
            ctx.fillStyle = `rgba(255, 255, 255, ${this.scoreMessageAlpha})`;
            ctx.fillText(string, canvas.width/2, canvas.height);
        }
    },
    reset()
    {
        this.scoreMessageAlpha = 0;
        this.transparencyDirection = 1;
        this.colorIndex = 0;
        this.fadingOut = false;
        this.canShowScoreMessage = true;
    }
};
export default UI;