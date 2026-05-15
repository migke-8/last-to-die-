import { Rectangle } from "./general.js";
import { inputs } from "./input.js";
import { mainMusic, menuMusic } from "./sounds.js";

export class ConfigurationState {
  selectedIndex = 0;
  options = ["mute sound", "mute music", "gray scale", "exit"];
  rectangles = [
    new Rectangle(48, 67, 144, 13),
    new Rectangle(47, 117, 145, 13),
    new Rectangle(48, 167, 144, 13),
    new Rectangle(91, 217, 57, 13),
  ];
  canExit = false;
  lastState = null;
  soundMuted = false;
  musicMuted = false;
  constructor(game) {
    this.setGrayScale = (x) => this.game.grayScale = x
    this.game = game;
  }
  update() {
    const canvas = this.game.canvas;
    const menu = this.game.scenes.get("menu")
    mainMusic.pause();
    mainMusic.currentTime = 0;
    menuMusic.pause();
    menu.currentTime = 0;
    let scale = canvas.getBoundingClientRect().width / canvas.width;
    let canvasTouchX =
      (inputs.touchX - canvas.getBoundingClientRect().x) / scale;
    let canvasTouchY =
      (inputs.touchY - canvas.getBoundingClientRect().y) / scale;
    for (let i = 0; i < this.rectangles.length; i++) {
      if (
        canvasTouchX >= this.rectangles[i].x &&
        canvasTouchX <= this.rectangles[i].x + this.rectangles[i].width
      ) {
        if (
          canvasTouchY >= this.rectangles[i].y &&
          canvasTouchY <= this.rectangles[i].y + this.rectangles[i].height
        ) {
          if (inputs.taped && this.canSelect) {
            this.canSelect = false;
            if (this.selectedIndex !== i) {
              this.selectedIndex = i;
            } else {
              this.doAction(this.options[i]);
            }
          } else if (!inputs.taped) {
            this.canSelect = true;
          }
        }
      }
    }
  }
  render(ctx) {
    const canvas = this.game.canvas;
    const grayScale = this.game.grayScale;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "25px game";
    ctx.fillText("configurations", canvas.width / 2, 30);
    for (let i = 0; i < this.options.length; i++) {
      ctx.fillStyle = "white";
      ctx.font = "20px game";
      if (this.selectedIndex === i) {
        ctx.fillStyle = "yellow";
        ctx.font = "25px game";
      }
      ctx.fillText(this.options[i], canvas.width / 2, 80 + i * 50);
      if (this.options[i] === "mute sound") {
        ctx.fillText(this.soundMuted, canvas.width / 2, 100 + i * 50);
      }
      if (this.options[i] === "mute music") {
        ctx.fillText(this.musicMuted, canvas.width / 2, 100 + i * 50);
      }
      if (this.options[i] === "gray scale") {
        ctx.fillText(grayScale, canvas.width / 2, 100 + i * 50);
      }
    }
  }
  doAction(str) {
    if (str === "mute sound") {
      this.soundMuted = this.soundMuted ? false : true;
      if (this.soundMuted) {
        muteSound();
      } else {
        unmuteSound();
      }
    }
    if (str === "mute music") {
      this.musicMuted = this.musicMuted ? false : true;
      if (this.musicMuted) {
        muteMusic();
      } else {
        unmuteSound();
      }
    }
    if (str === "gray scale") {
      this.setGrayScale(this.game.grayScale ? false : true);
    }
    if (str === "exit") {
      this.game.curState = this.lastState;
      this.lastState.return()
    }
  }
}
