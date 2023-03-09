import Enemy from "./enemy.js";
import { Entity, Rectangle } from "./general.js";
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
            Projectile.deleteProjectile(this);
        }
        else if(this.x>canvas.width+this.width)
        {
            this.dropParticles();
            Projectile.deleteProjectile(this);
        }
        if(this.y<-this.height)
        {
            this.dropParticles();
            Projectile.deleteProjectile(this);
        }
        else if(this.y>canvas.height+this.height)
        {
            this.dropParticles();
            Projectile.deleteProjectile(this);
        }
        for(let e of Enemy.enemies)
        {
            let rect = new Rectangle(this.x, this.y, this.width, this.height);
            let rect2 = new Rectangle(e.x, e.y, e.width, e.height);
            if(rect.intersects(rect2))
            {
                explosionSound.play();
                e.particlesDirection = this.angle;
                e.takeDamage(player.attack);
                this.dropParticles();
                let xp = 1;
                if(e instanceof Enemy2)
                {
                    xp = e.level;
                }
                player.xp+=xp;
                Projectile.deleteProjectile(this);
            }
        }
    }
    dropParticles()
    {
        for(let i = 0;i<50;i++)
        {
            Particle.addParticle(new Particle(this.x+this.width/2, this.y+this.height/2, Math.random()*(Math.PI*2), 120*Math.random(), 7*Math.random()+3, 'orange'));
        }
    }
    render(ctx)
    {
        ctx.fillStyle = 'orange';
        ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.width, this.height)
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