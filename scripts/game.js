import { ConfigurationState } from "./configuration-state.js";
import { GameOverState } from "./game-over-state.js";
import { inputs } from "./input.js";
import { MenuState } from "./menu-state.js";
import { NormalState } from "./normal-state.js";
import { PauseState } from "./pause-state.js";
import { StatsState } from "./stats-state.js";
import { Transition } from "./transition.js";
const fps = 60;
export class Game {
  canChangeState = true;
  canvas = document.getElementsByTagName("canvas")[0];
  ctx = this.canvas.getContext("2d");
  grayScale = false;
  shakeTimer = 0;
  constructor() {
    this.scenes = new Map();
    this.scenes.set("normal", this.createState("normal"));
    this.scenes.set("game over", this.createState("game over"));
    this.scenes.set("pause", this.createState("pause"));
    this.scenes.set("configuration", this.createState("configuration"));
    this.scenes.set("stats", this.createState("stats"));
  }
  start() {
    this.then = performance.now();
    this.accumulator = 0;
    requestAnimationFrame(this._loop);
    this.canvas.classList.remove("hidden");
    document.querySelector("button").classList.add("hidden");
    this.scenes.set("menu", this.createState("menu"));
    this.curState = this.scenes.get("menu");
  }
  _init() {
    if (localStorage.getItem("score")) {
      menu.highScore = Number(localStorage.getItem("score"));
    }
  }
  _update(dt) {
    if (!this.transition) {
      if (this.shaking) {
        this.shakeTimer++;
        if (this.shakeTimer >= this.maxShakeTime) {
          this.shakeTimer = 0;
          this.shaking = false;
        }
      }
      this.curState.update(dt);
    } else {
      this.transition.update();
      if (this.transition.stoped) {
        this.transition = null;
      }
    }
  }
  _render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    if (!this.transition) {
      if (this.shaking) {
        this._preShake();
      }
      this.curState.render(this.ctx);
      if (this.shaking) {
        this.ctx.restore();
      }
    } else {
      this.transition.render(this.ctx);
    }
    if (this.grayScale) {
      let data = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height,
      );
      let pixels = data.data;
      for (let i = 0; i < pixels.length; i += 4) {
        let red = pixels[i];
        let green = pixels[i + 1];
        let blue = pixels[i + 2];
        let color = (red + green + blue) / 3;
        pixels[i] = color;
        pixels[i + 1] = color;
        pixels[i + 2] = color;
      }
      this.ctx.putImageData(data, 0, 0);
    }
  }
  _loop = (now) => {
    let difference = now - this.then;
    this.accumulator += difference;
    while (this.accumulator > 1000 / fps) {
      this.then = now;
      inputs.update();
      this._update(difference / (1000 / fps));
      this._render();
      this.accumulator -= 1000 / fps;
    }
    requestAnimationFrame(this._loop);
  };
  _preShake() {
    let xa = Math.random() * this.shakePower - this.shakePower / 2,
      ya = Math.random() * this.shakePower - this.shakePower / 2;
    this.ctx.translate(xa, ya);
  }
  setCurrentState(state, reset = true) {
    if (!this.canChangeState) return;
    if (reset) this.scenes.set(state, this.createState(state));
    this.transition = new Transition(this.curState, state);
  }
  shake(power, time) {
    this.shakePower = power;
    this.maxShakeTime = time;
    this.shaking = true;
  }
  setCanChangeState(bool) {
    this.canChangeState = bool;
  }
  createState(state) {
    switch (state) {
      case "normal":
        return new NormalState(this);
      case "game over":
        return new GameOverState(this);
      case "menu":
        return new MenuState(this);
      case "pause":
        return new PauseState(this);
      case "configuration":
        return new ConfigurationState(this);
      case "stats":
        return new StatsState(this);
    }
  }
}
