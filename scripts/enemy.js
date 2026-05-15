import { Entity, Rectangle } from "./general.js";
import Particle from "./particle.js";
import TextInfo from "./textInfo.js";
import { enemyExplosionSound } from "./sounds.js";
class Enemy extends Entity {
  static enemies = [];
  static _RIGHT_DIR = 0;
  static _LEFT_DIR = 1;
  speed = 1;
  dead = false;
  canShow = true;
  starting = true;
  timer = 0;
  timerSpeed = 1;
  constructor(game, x, y, dir) {
    super(new Rectangle(x, y, 16, 16));
    this.dir = dir;
    this.scene = game;
  }
  update(dt) {
    const canvas = this.scene.game.canvas;
    if (this.starting) {
      this.timer += this.timerSpeed * dt;
      if (this.timer > 15) {
        this.canShow = this.canShow ? false : true;
        this.timer = 0;
        this.timerSpeed += 0.5 * dt;
      }
      if (this.timerSpeed > 9) {
        this.canShow = true;
        this.starting = false;
      }
    }
    if (!this.starting) {
      this.speed += 0.1 * dt;
      let xa = 0;
      if (this.dir === Enemy.RIGHT_DIR) {
        xa = this.speed;
        if (this.x > canvas.width) {
          enemyExplosionSound.play();
          this.dead = true;
        }
      } else {
        xa = -this.speed;
        if (this.x < -this.width) {
          enemyExplosionSound.play();
          this.dead = true;
        }
      }
      this.move(xa * dt, 0);
      if (this.isCollidingWithPlayer() && !this.scene.player.invincible) {
        this.scene.player.takeDamage(1);
      }
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
      ctx.fillRect(
        Math.floor(this.x),
        Math.floor(this.y),
        this.width,
        this.height,
      );
    }
  }
  takeDamage() {
    TextInfo.addInfo(
      new TextInfo(
        this.x + this.width / 2,
        this.y + this.height / 2,
        "dead",
        20,
        "white",
      ),
    );
    this.dead = true;
  }
  static addEnemy(e) {
    Enemy.enemies.push(e);
  }
  static deleteEnemy(e) {
    Enemy.enemies.splice(Enemy.enemies.indexOf(e), 1);
  }
  static clear() {
    this.enemies = [];
  }
  static get RIGHT_DIR() {
    return Enemy._RIGHT_DIR;
  }
  static get LEFT_DIR() {
    return Enemy._LEFT_DIR;
  }
  isCollidingWithPlayer() {
    let rect = new Rectangle(this.x, this.y, this.width, this.height);
    let rect2 = new Rectangle(
      this.scene.player.x,
      this.scene.player.y,
      this.scene.player.width,
      this.scene.player.height,
    );
    return rect.intersects(rect2);
  }
}
export default Enemy;
