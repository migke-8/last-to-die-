import { Entity, Rectangle, canvas } from "./general.js";
import { inputs } from "./input.js";
import Projectile from "./projectile.js";
import { configuration, curState, menu, over, setCurState } from "./states.js";
import { shake } from "./main.js";
import { levelUpSound, playerHurtSound, shootSound, wallCollisionSound } from "./sounds.js";
import TextInfo from "./textInfo.js";
class Player extends Entity{

    xp = 0;
    maxXp = 3;
    forcePower = 0.1;
    score = 0;
    velocity = 0;
    canInvert = true;
    forceDir = 1;
    level = 1;
    dead = false;
    maxShootTimer = 30;
    shootTimer = this.maxShootTimer;
    levelPoints = 0;
    attack = 1;
    maxMana = 2;
    mana = this.maxMana;
    maxHp = 3;
    hp = this.maxHp;
    invincibleTimer = 0;
    canShow = true;
    maxXp = 3;
    constructor(x, y)
    {
        super(new Rectangle(x, y, 16, 16));
    }
    update()
    {
        if(this.hp>this.maxHp)
        {
            this.hp = this.maxHp;
        }
        if(this.mana<0)
        {
            this.mana = 0;
        }
        if(this.mana>this.maxMana)
        {
            this.mana=this.maxMana;
        }
        this.velocity+=this.forcePower*this.forceDir;
        if(inputs.taped&&this.canInvert)
        {
            this.velocity /= 3;
            this.forceDir*=-1;
            this.canInvert = false;
        }
        else if(!inputs.taped)
        {
            this.canInvert = true;
        }
        this.move(0, this.velocity);
        if(this.y<16)
        {
            this.y = 16;
            if(Math.abs(this.velocity)>5)
            {
                wallCollisionSound.play();
                shake(6, 5);
            }
            this.velocity = 0;
        }
        if(this.y+this.height>canvas.height)
        {
            this.y=canvas.height-this.height;
            if(Math.abs(this.velocity)>5)
            {
                wallCollisionSound.play();
                shake(6, 5);
            }
            this.velocity = 0;
        }
        this.shootTimer++;
        if(inputs.swipeRight&&this.shootTimer>=this.maxShootTimer&&this.mana>0)
        {
            this.shootTimer = 0;
            shootSound.play();
            let p = new Projectile(0, 0, 0);
            p.x = this.x+(this.width-p.width)/2;
            p.y = this.y+(this.height-p.height)/2;
            Projectile.addProjectile(p);
            this.mana--;
        }
        if(inputs.swipeLeft&&this.shootTimer>=this.maxShootTimer&&this.mana>0)
        {
            this.shootTimer = 0;
            let p = new Projectile(0, 0, 180*Math.PI/180);
            p.x = this.x+(this.width-p.width)/2;
            p.y = this.y+(this.height-p.height)/2;
            Projectile.addProjectile(p);
            this.mana--;
        }

        if(inputs.swipeUp&&this.shootTimer>=this.maxShootTimer&&this.mana>0)
        {
            this.shootTimer = 0;
            let p = new Projectile(0, 0, 270*Math.PI/180);
            p.x = this.x+(this.width-p.width)/2;
            p.y = this.y+(this.height-p.height)/2;
            Projectile.addProjectile(p);
            this.mana--;
        }
        if(inputs.swipeDown&&this.shootTimer>=this.maxShootTimer&&this.mana>0)
        {
            this.shootTimer = 0;
            let p = new Projectile(0, 0, 90*Math.PI/180);
            p.x = this.x+(this.width-p.width)/2;
            p.y = this.y+(this.height-p.height)/2;
            Projectile.addProjectile(p);
            this.mana--;
        }
        if(this.xp>=this.maxXp)
        {
            this.xp%=this.maxXp;
            this.level++;
            this.maxXp*=2;
            this.levelPoints++;
            levelUpSound.play();
            TextInfo.addInfo(new TextInfo(this.x+this.width/2, this.y, 'lvl-up!', 20, 'green'));
        }
        if(this.invincible)
        {
            this.invincibleTimer++;
            if(this.invincibleTimer%5 === 0)
            {
                this.canShow = this.canShow?false:true;
            }
            if(this.invincibleTimer>=100)
            {
                this.invincible = false;
                this.invincibleTimer = 0;
            }
        }
        if(this.hp<=0)
        {
            this.dead = true;
        }
        if(this.dead)
        {
            if(this.score>menu.highScore)
            {
                menu.highScore = this.score;
                localStorage.setItem('score', menu.highScore);
            }
            over.reset();
            setCurState(over);
        }
    }
    render(ctx)
    {
        if(this.canShow)
        {
            ctx.fillStyle = '#FFF';
            ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.width, this.height);
        }
    }
    takeDamage(damage)
    {
        shake(10, 10);
        playerHurtSound.play();
        this.hp-=damage;
        this.invincible = true;
    }
}
export let player = new Player((canvas.width-16)/2, (canvas.height-16)/2);
export function resetPlayer(){
    player = new Player((canvas.width-16)/2, (canvas.height-16)/2);
}