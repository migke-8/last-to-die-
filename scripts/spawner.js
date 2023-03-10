import Enemy from "./enemy.js";
import { Enemy2 } from "./enemy2.js";
import { canvas } from "./general.js";
import { player } from "./player.js";

let spawnner = {
    timerToSpawn: 0,
    maxTimerToSpawn: 240,
    enemiesNum: 1,
    level: 1,
    timer: 0,
    maxTimer: 0,
    showLevelTimer: 0,
    textTransparency: 0,
    update()
    {
        if(player.score>0&&!this.showingLevel)
        {
            this.timer--;
            if(this.timer<=0)
            {
                this.maxTimer*=1.5;
                this.timer = this.maxTimer;
                this.level++;
                this.enemiesNum++;
                this.showingLevel = true;
                console.log(this.timer)
            }
            this.timerToSpawn++;
        }
        if(this.showingLevel)
        {
            this.textTransparency+=this.fadingOut?-0.008:0.008;
            if(this.textTransparency>=1)
            {
                this.textTransparency = 1;
                this.fadingOut = true;
            }
            if(this.textTransparency<=0&&this.fadingOut)
            {
                this.fadingOut = false;
                this.showingLevel = false;
                this.textTransparency = 0;
            }
        }
        if(this.timerToSpawn>=this.maxTimerToSpawn)
        {
            this.timerToSpawn = 0;
            for(let i = 0;i<this.enemiesNum;i++)
            {
                let x = 0;
                let y = Math.floor(Math.random()*(canvas.height/16-2))*16+16;
                let dir = 0;
                if(Math.random()<0.5)
                {
                    x = 0;
                    dir = Enemy.RIGHT_DIR;
                }
                else
                {
                    x = canvas.width-16;
                    dir = Enemy.LEFT_DIR
                }
                let enemy = null;
                if(Math.random()<0.5&&this.level>3)
                {
                    enemy = new Enemy2(x, y, this.level-3, dir);
                }
                else
                {
                    enemy = new Enemy(x, y, dir);
                }
                Enemy.addEnemy(enemy);
            }
        }
    },
    render(ctx)
    {
        if(this.showingLevel)
        {
            ctx.fillStyle = `rgba( 255, 255, 255, ${this.textTransparency})`;
            ctx.font = '20px game';
            ctx.fillText('stage: '+this.level, canvas.width/2, 40);
        }
    },
    reset()
    {
        this.timerToSpawn = 0;
        this.maxTimerToSpawn = 240;
        this.enemiesNum = 1;
        this.maxTimer = 15*65;
        this.timer = this.maxTimer;
        Enemy.clear();
    }
};
export default spawnner;