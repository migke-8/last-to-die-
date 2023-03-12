import { Entity, Rectangle, canvas } from "./general.js";
import { player } from "./player.js";
import { pickPotionSound } from "./sounds.js";
import TextInfo from "./textInfo.js";

class ScoreParticle extends Entity{
    animationIndex = 0;
    sections = [];
    velocity = -6;
    constructor(x, y)
    {
        super(new Rectangle(x, y, 8, 8));
        for(let i = 0;i<4;i++)
        {
            let x = i%2;
            let y = Math.floor(i/2);
            this.sections.push(new Rectangle(x*8, y*8, 8, 8));
        }
    }
    update()
    {
        let rect = new Rectangle(this.x, this.y, this.width, this.height);
        let rect2 = new Rectangle(player.x, player.y, player.width, player.height);
        if(rect.intersects(rect2)&&!this.collected)
        {
            player.score++;
            player.mana++;
            if(Math.random()<0.05)
            {
                player.hp++;
            }
            this.collected = true;
        }
        if(this.collected)
        {
            pickPotionSound.play();
            //TextInfo.addInfo(new TextInfo(this.x+this.width/2, this.y+this.height/2, '+1', 20, 'white'))
            this.collected = false;
            this.y = Math.floor(Math.random()*((canvas.height/16)-2))*16+16;
        }
    }
    render(ctx)
    {
        ctx.fillStyle = '#0F0';
        ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.width, this.height);
    }
}
export let scoreParticle = new ScoreParticle((canvas.width-8)/2, 16);
export function resetScoreParticle(){
    scoreParticle = new ScoreParticle((canvas.width-8)/2, 16);
}