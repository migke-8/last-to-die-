import Enemy from "./enemy.js";
import { Enemy2 } from "./enemy2.js";
import { canvas } from "./general.js";
import { Enemy3 } from "./Enemy3.js";
export class Spawnner {
  timerToSpawn = 0;
  maxTimerToSpawn = 240;
  enemiesNum = 0;
  level = 1;
  maxTimer = 16 * 65;
  timer = this.maxTimer;
  showLevelTimer = 0;
  textTransparency = 0;
  counter = 0;
  constructor(scene) {
    this.scene = scene;
    this.maxTimerToSpawn = 240;
    this.enemiesNum = 2;
    this.maxTimer = 15 * 65;
    this.timer = this.maxTimer;
  }
  update(dt) {
    if (this.scene.player.score > 0 && !this.showingLevel) {
      this.timer-=dt;
      if (this.timer <= 0) {
        this.maxTimer *= 1.5;
        this.timer = this.maxTimer;
        this.level++;
        this.counter+=dt;
        this.showingLevel = true;
      }
      this.timerToSpawn++;
    }
    if (this.counter > 2) {
      this.counter = 0;
      this.enemiesNum+=dt;
    }
    if (this.showingLevel) {
      this.textTransparency += this.fadingOut ? -0.008 : 0.008 * dt;
      if (this.textTransparency >= 1) {
        this.textTransparency = 1;
        this.fadingOut = true;
        this.fadingOut = false;
        this.showingLevel = false;
        this.textTransparency = 0;
      }
    }
    if (this.timerToSpawn >= this.maxTimerToSpawn) {
      this.timerToSpawn = 0;
      for (let i = 0; i < this.enemiesNum; i++) {
        let x = 0;
        let y = Math.floor(Math.random() * (canvas.height / 16 - 2)) * 16 + 16;
        let dir = 0;
        if (Math.random() < 0.5) {
          x = 1;
          dir = Enemy.RIGHT_DIR;
        } else {
          x = this.scene.game.canvas.width - 25;
          dir = Enemy.LEFT_DIR;
        }
        let enemy = null;
        if (Math.random() < 0.5 && this.level >= 6) {
          enemy = new Enemy3(this.scene, x, y, dir, this.level - 5);
        } else if (Math.random() < 0.5 && this.level >= 3) {
          enemy = new Enemy2(this.scene, x, y, dir, this.level - 2);
        } else {
          enemy = new Enemy(this.scene, x, y, dir);
        }
        Enemy.addEnemy(enemy);
      }
    }
  }
  render(ctx) {
    if (this.showingLevel) {
      ctx.fillStyle = `rgba( 255, 255, 255, ${this.textTransparency})`;
      ctx.font = "20px game";
      ctx.fillText("stage: " + this.level, canvas.width / 2, 40);
    }
  }
  reset() {
    this.timerToSpawn = 0;
    this.level = 1;
    this.maxTimerToSpawn = 240;
    this.enemiesNum = 2;
    this.maxTimer = 15 * 65;
    this.timer = this.maxTimer;
    Enemy.clear();
  }
}
