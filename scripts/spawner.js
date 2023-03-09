import Enemy from "./enemy.js";
import { Enemy2 } from "./enemy2.js";
import { canvas } from "./general.js";
import { player } from "./player.js";

let spawnner = {
    timerToSpawn: 0,
    maxTimerToSpawn: 240,
    enemiesNum: 1,
    level: 1,
    timer: 30*65,
    maxTimer: 30*65,
    update()
    {
        if(player.score>0)
        {
            this.timer--;
            if(this.timer<=0)
            {
                this.maxTimer*=1.5;
                this.timer = this.maxTimer;
                this.level++;
                this.enemiesNum++;
            }
            this.timerToSpawn++;
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
                if(Math.random()<0.5&&this.level>0)
                {
                    enemy = new Enemy2(x, y, this.level, dir);
                }
                else
                {
                    enemy = new Enemy(x, y, dir);
                }
                Enemy.addEnemy(enemy);
            }
        }
    },
    reset()
    {
        this.timerToSpawn = 0;
        this.maxTimerToSpawn = 240;
        this.enemiesNum = 1;
        this.level = 1;
        this.maxTimer = 30*65;
        this.timer = 30*65;
        Enemy.clear();
    }
};
export default spawnner;