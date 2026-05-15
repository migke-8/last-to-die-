import Enemy from "./enemy.js";
import Particle from "./particle.js";
export class Enemy3 extends Enemy {
  angle = 0;
  constructor(x, y, dir, level) {
    super(x, y, dir);
    this.hp = level * 3;
    this.attack = level * 2;
    this.level = level;
  }
  update() {
    const canvas = this.scene.game.canvas;
    const player = this.scene.player
    if (this.starting) {
      if (this.x + this.width > canvas.width) {
        this.x = canvas.width - this.width;
      }
      if (this.x < 0) {
        this.x = 0;
      }
      this.timer += this.timerSpeed;
      if (this.timer > 15) {
        this.canShow = this.canShow ? false : true;
        this.timer = 0;
        this.timerSpeed += 0.5;
      }
      if (this.timerSpeed > 5) {
        this.canShow = true;
        this.starting = false;
        this.timer = 0;
        this.timerSpeed = 1;
        this.speed = 1;
      }
    }
    if (!this.starting) {
      this.speed += 0.1;
      let xa = 0;
      if (this.dir === Enemy.RIGHT_DIR) {
        xa = this.speed;
        if (this.x > canvas.width) {
          this.starting = true;
          this.dir = Enemy.LEFT_DIR;
        }
      } else {
        xa = -this.speed;
        if (this.x < -this.width) {
          this.starting = true;
          this.dir = Enemy.RIGHT_DIR;
        }
      }
      this.move(xa, 0);
      if (this.isCollidingWithPlayer() && !player.invincible) {
        player.takeDamage(this.attack);
      }
    }
    this.angle += 0.1;
    if (this.hp <= 0) {
      this.dead = true;
    }
    if (this.dead) {
      for (let i = 0; i < 50; i++) {
        Particle.addParticle(
          new Particle(
            this.x + this.width / 2,
            this.y + this.height / 2,
            Math.random() * (Math.PI * 2),
            120 * Math.random(),
            7 * Math.random() + 3,
            "red",
          ),
        );
      }
      Enemy.deleteEnemy(this);
    }
  }
  render(ctx) {
    if (this.canShow) {
      ctx.fillStyle = "red";
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.rotate(this.angle);
      ctx.beginPath();
      ctx.moveTo(-this.width / 2, this.height / 2);
      ctx.lineTo(this.width / 2, this.height / 2);
      ctx.lineTo(0, -this.height / 2);
      ctx.closePath();
      ctx.fill();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
}
