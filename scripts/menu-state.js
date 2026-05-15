import { Rectangle } from "./general.js";
import { inputs } from "./input.js";
import { mainMusic, menuMusic } from "./sounds.js";

export class MenuState {
  options = ["start", "configurations"];
  rectangles = [
    new Rectangle(84, 137, 72, 13),
    new Rectangle(17, 167, 206, 13),
  ];
  curOptionindex = 0;
  highScore = 0;
  selectedIndex = 0;
  canSelect = false;
  constructor(game) {
    menuMusic.play();
    mainMusic.pause();
    mainMusic.currentTime = 0;
    this.highScore = Number(localStorage.getItem("high-score"));
    this.game = game;
  }
  update() {
    let scale =
      this.game.canvas.getBoundingClientRect().width / this.game.canvas.width;
    let canvasTouchX =
      (inputs.touchX - this.game.canvas.getBoundingClientRect().x) / scale;
    let canvasTouchY =
      (inputs.touchY - this.game.canvas.getBoundingClientRect().y) / scale;
    if (inputs.taped) this.game.canChangeState = true;
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
    let mainText = "lasttodie!";
    ctx.fillStyle = "yellow";
    ctx.textAlign = "center";
    ctx.font = "50px game";
    ctx.fillStyle = "white";
    ctx.fillText(
      mainText.substring(0, 4),
      this.game.canvas.width / 2,
      30 + Math.cos(Date.now() / 150) * 3,
    );
    ctx.fillText(
      mainText.substring(4, 6),
      this.game.canvas.width / 2,
      60 + Math.cos(Date.now() / 150) * 3,
    );
    ctx.fillStyle = "red";
    ctx.fillText(
      mainText.substring(6, mainText.length),
      this.game.canvas.width / 2,
      90 + Math.cos(Date.now() / 150) * 3,
    );
    // for(let r of this.rectangles)
    // {
    //     ctx.fillStyle = 'red';
    //     ctx.fillRect(r.x, r.y, r.width, r.height);
    // }
    for (let i = 0; i < this.options.length; i++) {
      let str = this.options[i];
      ctx.font = "20px game";
      ctx.fillStyle = "white";
      if (this.selectedIndex === i) {
        ctx.font = "25px game";
        ctx.fillStyle = "yellow";
      }
      ctx.fillText(str, this.game.canvas.width / 2, 150 + i * 30);
    }
    ctx.fillStyle = "black";
    ctx.fillRect(0, this.game.canvas.height - 12, this.game.canvas.width, 12);
    ctx.font = "20px game";
    ctx.fillStyle = "white";
    ctx.fillText(
      "high-score: " + this.highScore,
      this.game.canvas.width / 2,
      this.game.canvas.height - 1,
    );
  }
  doAction(str) {
    if (str === "start") {
      this.game.setCurrentState("normal", true);
    }
    if (str === "configurations") {
      const configuration = this.game.scenes.get("configuration");
      configuration.lastState = this;
      this.game.setCurrentState("configuration");
      this.game.scenes.get("configuration").lastState = this;
    }
  }
  return() {
    menuMusic.play();
  }
}
