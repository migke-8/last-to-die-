import { Rectangle } from "./general.js";
import { inputs } from "./input.js";

export class StatsState {
  canExit = false;
  options = ["attack:", "mana:", "health points:", "exit"];
  rectangles = [
    new Rectangle(73, 35, 93, 16),
    new Rectangle(87, 80, 66, 16),
    new Rectangle(25, 125, 190, 16),
    new Rectangle(91, 170, 57, 16),
  ];
  selectedIndex = 0;
  constructor(game) {
    this.game = game;
  }
  update() {
    const canvas = this.game.canvas;
    let scale = canvas.getBoundingClientRect().width / canvas.width;
    let canvasTouchX =
      (inputs.touchX - canvas.getBoundingClientRect().x) / scale;
    let canvasTouchY =
      (inputs.touchY - canvas.getBoundingClientRect().y) / scale;
    for (let i = 0; i < this.rectangles.length; i++) {
      if (
        canvasTouchX >= this.rectangles[i].x &&
        canvasTouchX <= this.rectangles[i].x + this.rectangles[i].width &&
        canvasTouchY >= this.rectangles[i].y &&
        canvasTouchY <= this.rectangles[i].y + this.rectangles[i].height
      ) {
        if (this.rectangles[i].y + this.rectangles[i].height) {
          if (inputs.taped && this.canSelect) {
            this.canSelect = false;
            if (this.selectedIndex !== i) {
              this.selectedIndex = i;
            } else {
              if (i < this.options.length - 1) {
                this.increaseStat(this.options[i]);
              } else {
                this.game.setCurrentState("pause")

              }
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
    // for (let r of this.rectangles) {
    //   ctx.fillStyle = "red";
    //   ctx.fillRect(r.x, r.y, r.width, r.height);
    // }
    for (let i = 0; i < this.options.length; i++) {
      let str = this.options[i];
      ctx.font = "20px game";
      ctx.fillStyle = "white";
      if (this.selectedIndex === i) {
        ctx.font = "25px game";
        ctx.fillStyle = "yellow";
      }
      ctx.fillText(str, canvas.width / 2, 50 + i * 45);
      if (str === "attack:") {
        ctx.fillText(
          this.game.scenes.get("normal").player.attack,
          canvas.width / 2,
          70 + i * 45,
        );
      }
      if (str === "mana:") {
        ctx.fillText(
          `${this.game.scenes.get("normal").player.mana}/${this.game.scenes.get("normal").player.maxMana}`,
          canvas.width / 2,
          70 + i * 45,
        );
      }
      if (str === "health points:") {
        ctx.fillText(
          `${this.game.scenes.get("normal").player.hp}/${this.game.scenes.get("normal").player.maxHp}`,
          this.game.canvas.width / 2,
          70 + i * 45,
        );
      }
    }
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, 32);
    let mainText = "stats";
    ctx.fillStyle = "yellow";
    ctx.textAlign = "center";
    ctx.font = "40px game";
    ctx.fillStyle = "white";
    ctx.fillText(mainText, canvas.width / 2, 30);
    ctx.fillStyle = "red";
    ctx.fillText(mainText.substring(6, mainText.length), canvas.width / 2, 90);
    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height - 21, canvas.width, 21);
    ctx.font = "20px game";
    ctx.fillStyle = "white";
    ctx.fillText(
      "level points: " + this.game.scenes.get("normal").player.levelPoints,
      this.game.canvas.width / 2,
      this.game.canvas.height - 10,
    );
  }
  increaseStat(str) {
    if (this.game.scenes.get("normal").player.levelPoints > 0) {
      if (str === "attack:") {
        this.game.scenes.get("normal").player.attack++;
      }
      if (str === "mana:") {
        this.game.scenes.get("normal").player.maxMana++;
      }
      if (str === "health points:") {
        this.game.scenes.get("normal").player.maxHp++;
        this.game.scenes.get("normal").player.hp++;
        if (
          this.game.scenes.get("normal").player.hp >
          this.game.scenes.get("normal").player.maxHp
        ) {
          this.game.scenes.get("normal").player.hp = play.maxHp;
        }
      }
      this.game.scenes.get("normal").player.levelPoints--;
    }
  }
}
