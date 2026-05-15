import { Rectangle } from "./general.js";
import { inputs } from "./input.js";
import { mainMusic, menuMusic } from "./sounds.js";

export class PauseState {
  curOptionindex = 0;
  options = ["resume", "stats", "configurations", "exit"];
  rectangles = [
    new Rectangle(74, 67, 91, 13),
    new Rectangle(84, 97, 72, 13),
    new Rectangle(17, 127, 206, 13),
    new Rectangle(91, 157, 57, 13),
  ];
  canSelect = false;
  selectedIndex = 0;
  constructor(game) {
    this.game = game;
    menuMusic.pause();
    menuMusic.currentTime = 0;
    // mainMusic.pause();
  }
  update() {
    let scale =
      this.game.canvas.getBoundingClientRect().width / this.game.canvas.width;
    let canvasTouchX =
      (inputs.touchX - this.game.canvas.getBoundingClientRect().x) / scale;
    let canvasTouchY =
      (inputs.touchY - this.game.canvas.getBoundingClientRect().y) / scale;
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
    ctx.fillStyle = "white";
    ctx.font = "40px game";
    ctx.textAlign = "center";
    ctx.fillText("paused", this.game.canvas.width / 2, 30);
    // for(let r of this.rectangles)
    // {
    //     ctx.fillStyle = 'red';
    //     ctx.fillRect(r.x, r.y, r.width, r.height);
    // }
    for (let i = 0; i < this.options.length; i++) {
      ctx.fillStyle = "white";
      ctx.font = "20px game";
      if (this.selectedIndex === i) {
        ctx.fillStyle = "yellow";
        ctx.font = "25px game";
      }
      ctx.fillText(this.options[i], this.game.canvas.width / 2, 80 + i * 30);
    }
  }
  reset() {
    this.curOptionindex = 0;
  }
  doAction(str) {
    if (str === "resume") {
      this.game.setCurrentState("normal", false);
      mainMusic.play();
    }
    if (str === "exit") {
      this.game.setCurrentState("menu");
    }
    if (str === "stats") {
      this.game.setCurrentState("stats");
    }
    if (str === "configurations") {
      const configuration = this.game.scenes.get("configuration");
      configuration.lastState = this;
      this.game.setCurrentState("configuration");
      this.game.scenes.get("configuration").lastState = this;
    }
  }
  return() {
  }
}
