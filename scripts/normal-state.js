import UI from "./UI.js";
import Enemy from "./enemy.js";
import Particle from "./particle.js";
import { PauseButton } from "./pause-button.js";
import { Player } from "./player.js";
import Projectile from "./projectile.js";
import { ScoreParticle } from "./score-particle.js";
import { mainMusic, menuMusic } from "./sounds.js";
import { Spawnner } from "./spawner.js";
import TextInfo from "./textInfo.js";

export class NormalState {
  justStarted = true;
  timer = 0;
  constructor(game) {
    this.game = game;
    this.player = new Player(
      this,
      (game.canvas.width - 16) / 2,
      (game.canvas.height - 16) / 2,
    );
    this.ui = new UI(this);
    this.setPauseButton();
    this.scoreParticle = new ScoreParticle(
      this,
      (game.canvas.width - 8) / 2,
      16,
    );
    this.spawnner = new Spawnner(this);
    Enemy.clear();
    Particle.clear();
    TextInfo.clear();
    Projectile.clear();
    menuMusic.pause();
    menuMusic.currentTime = 0;
    mainMusic.play();
  }
  update(dt) {
    if (!this.justStarted) {
      this.pauseButton.update(dt);
      this.spawnner.update(dt);
      this.player.update(dt);
      for (let e of Enemy.enemies) {
        e.update(dt);
      }
      for (let e of Projectile.projectiles) {
        e.update(dt);
      }
      for (let e of Particle.particles) {
        e.update(dt);
      }
      for (let e of TextInfo.infos) {
        e.update(dt);
      }
      this.scoreParticle.update(dt);
      if (
        (this.player.score > this.game.scenes.get("menu").highScore) &
        UI.canShowScoreMessage
      ) {
        this.ui.newHighScore = true;
      }
      this.ui.update(dt);
    } else {
      this.timer++;
      if (this.timer >= 60) {
        this.timer = 0;
        this.justStarted = false;
      }
    }
  }
  render(ctx) {
    if (!this.justStarted) {
      for (let e of Particle.particles) {
        e.render(ctx);
      }
      this.player.render(this.game.ctx);
      for (let e of Enemy.enemies) {
        e.render(ctx);
      }
      for (let e of Projectile.projectiles) {
        e.render(ctx);
      }
      for (let e of TextInfo.infos) {
        e.render(ctx);
      }
      this.scoreParticle.render(ctx);
      this.spawnner.render(ctx);
      this.pauseButton.render(ctx);
      this.ui.render(ctx);
    } else {
      let text = "good luck!";
      ctx.fillStyle = "white";
      ctx.font = "40px game";
      ctx.textAlign = "center";
      ctx.fillText(
        text,
        this.game.canvas.width / 2,
        this.game.canvas.height / 2,
      );
    }
  }
  setPauseButton() {
    this.pauseButton = new PauseButton(this);
  }
}
