import Enemy from "./enemy.js";
import { player } from "./player.js";
import { canvas } from './general.js'
import Particle from './particle.js';
import TextInfo from "./textInfo.js";
import { enemyExplosionSound } from "./sounds.js";
export class Enemy2 extends Enemy{
    constructor(x, y, dir, level)
    {
        super(x, y, dir);
        this.hp = level*2;
        this.attack = level;
        this.level = level;
    }
    update()
    {
        if(this.starting)
        {
            if(this.x+this.width>canvas.width)
            {
                this.x = canvas.width-this.width;
            }
            if(this.x<0)
            {
                this.x = 0;
            }
            this.timer+=this.timerSpeed;
            if(this.timer>15)
            {
                this.canShow = this.canShow?false:true;
                this.timer = 0;
                this.timerSpeed+=0.5;
            }
            if(this.timerSpeed>7)
            {
                this.canShow = true;
                this.starting = false;
                this.timer = 0;
                this.timerSpeed = 1;
                this.speed = 1
            }
        }
        if(!this.starting)
        {
            this.speed+=0.1;
            let xa = 0;
            if(this.dir===Enemy.RIGHT_DIR)
            {
                xa = this.speed;
                if(this.x>canvas.width)
                {
                    this.starting = true;
                    this.hp--;
                    this.dir = Enemy.LEFT_DIR;
                    if(this.hp<=0)
                    {
                        enemyExplosionSound.play();
                    }
                }
            }
            else
            {
                xa=-this.speed;
                if(this.x<-this.width)
                {
                    this.starting = true;
                    this.hp--;
                    this.dir = Enemy.RIGHT_DIR;
                    if(this.hp<=0)
                    {
                        enemyExplosionSound.play();
                    }
                }
            }
            this.move(xa, 0);
            if(this.isCollidingWithPlayer()&&!player.invincible)
            {
                player.takeDamage(this.attack)
            }
        }
        if(this.hp<=0)
        {
            this.dead = true;
        }
        if(this.dead)
        {
            for(let i = 0;i<50;i++)
            {
                Particle.addParticle(new Particle(this.x+this.width/2, this.y+this.height/2, Math.random()*(Math.PI*2), 120*Math.random(), 7*Math.random()+3, 'red'));
            }
            Enemy.deleteEnemy(this);
        }
    }
    render(ctx)
    {
        if(this.canShow)
        {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.x+this.width/2, this.y+this.height/2, this.width/2, 0, Math.PI*2);
            ctx.fill();
        }
    }
    takeDamage(damage)
    {
        let mult = 1;
        if(Math.random()<0.15)
        {
            mult = 1.5;
            TextInfo.addInfo(new TextInfo(this.x, this.y, 'critical', 20, 'red'));
        }
        TextInfo.addInfo(new TextInfo(this.x+this.width/2, this.y+this.width/2, damage*mult, 20, 'white'));
        this.hp-=damage*mult;
    }
}