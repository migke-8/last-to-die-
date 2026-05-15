import { inputs } from "./input.js";

export class PauseButton {
  x = 15;
  y = 15;
  canPause = true;
  constructor(state) {
    this.state = state;
  }
  update() {
    let scale =
      this.state.game.canvas.getBoundingClientRect().width /
      this.state.game.canvas.width;
    let canvasTouchX =
      (inputs.touchX - this.state.game.canvas.getBoundingClientRect().x) /
      scale;
    let canvasTouchY =
      (inputs.touchY - this.state.game.canvas.getBoundingClientRect().y) /
      scale;
    if (canvasTouchX >= this.x && canvasTouchX <= this.x + 28) {
      if (canvasTouchY >= this.y && canvasTouchY <= this.y + 8 * scale) {
        if (inputs.taped && this.canPause) {
          this.state.game.setCurrentState("pause");
        } else if (!inputs.taped) {
          this.canPause = true;
        }
      }
    }
  }
  render(ctx) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(this.x, this.y, 8, 16);
    ctx.fillRect(this.x + 12, this.y, 8, 16);
  }
}
