import Enemy from "./enemy.js";
import { binaryCtx, Entity, Rectangle } from "./general.js";
import { canvas } from "./general.js";
import Particle from "./particle.js";
import { player } from "./player.js";
import { Enemy2 } from "./enemy2.js";
import { explosionSound } from "./sounds.js";
class Projectile extends Entity{
    static projectiles = [];
    speed = 6;
    constructor(x, y, angle)
    {
        super(new Rectangle(x, y, 16, 16));
        this.angle = angle;
    }
    update()
    {
        let xa = 0, ya = 0;
        xa = Math.cos(this.angle)*this.speed;
        ya = Math.sin(this.angle)*this.speed;
        this.move(xa, ya);
        if(this.x<-this.width)
        {
            this.dropParticles();
            explosionSound.play();
            Projectile.deleteProjectile(this);
        }
        else if(this.x>canvas.width+this.width)
        {
            this.dropParticles();
            explosionSound.play();
            Projectile.deleteProjectile(this);
        }
        if(this.y<-this.height)
        {
            this.dropParticles();
            explosionSound.play();
            Projectile.deleteProjectile(this);
        }
        else if(this.y>canvas.height+this.height)
        {
            this.dropParticles();
            explosionSound.play();
            Projectile.deleteProjectile(this);
        }
        for(let e of Enemy.enemies)
        {
            let rect = new Rectangle(this.x, this.y, this.width, this.height);
            let rect2 = new Rectangle(e.x, e.y, e.width, e.height);
            if(rect.intersects(rect2))
            {
                explosionSound.play();
                e.takeDamage(player.attack);
                this.dropParticles();
                if(e instanceof Enemy2)
                {
                    if(e.hp<=0)
                    {
                        player.xp+=e.level;
                    }
                }
                else
                {
                    player.xp +=1;
                }
                Projectile.deleteProjectile(this);
            }
        }
    }
    render(ctx)
    {
        // ctx.fillStyle = 'rgb(57, 57, 57)';
        // ctx.beginPath();
        // ctx.arc(this.x+this.width/2, this.y+this.height/2, this.width/2, 0, Math.PI*2)
        // ctx.fill();
        // let data = ctx.getImageData(this.x, this.y, this.width, this.height);
        // let pixels = data.data;
        // let data2 = binaryCtx.getImageData(this.x, this.y, this.width, this.height);
        // let pixels2 = data2.data;
        // for(let i = 0;i<pixels.length;i+=4)
        // {
        //     let red = pixels[i];
        //     let green = pixels[i+1];
        //     let blue = pixels[i+2];
        //     if(red === 57&&green === 57&& blue === 57)
        //     {
        //         if(pixels2[i] === 255&&pixels2[i+1] === 255&&pixels2[i+2] ===255)
        //         {
        //             pixels[i] = 0;
        //             pixels[i+1] = 255;
        //             pixels[i+2] = 0;
        //         }
        //         else
        //         {
        //             pixels[i] = 0;
        //             pixels[i+1] = 0;
        //             pixels[i+2] = 0;
        //         }
        //     }
        // }
        // ctx.putImageData(data, this.x, this.y);
        ctx.fillStyle = '#0F0';
        // ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.width, this.height);
        ctx.beginPath();
        ctx.arc(Math.floor(this.x+8), Math.floor(this.y+8), 8, 0, Math.PI*2);
        ctx.fill();
    }
    dropParticles()
    {
        for(let i = 0;i<30;i++)
        {
            Particle.addParticle(new Particle(this.x+this.width, this.y+this.height, Math.random()*(Math.PI*2), 120*Math.random(), 7*Math.random()+3, '#0F0'));
        }
    }
    static addProjectile(proj){
        Projectile.projectiles.push(proj);
    }
    static deleteProjectile(proj)
    {
        Projectile.projectiles.splice(Projectile.projectiles.indexOf(proj), 1);
    }
    static clear()
    {
        this.projectiles = [];
    }
}
export default Projectile;