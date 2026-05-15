import { inputs } from "./input.js";
import { loseSound, mainMusic, menuMusic, wallCollisionSound } from "./sounds.js";

export class GameOverState {
  animating = true;
  maxPositionY = 80;
  curPositionY = -60;
  textVelocity = 0;
  canShow = true;
  showIndex = 0;
  canRestart = false;
  canEndAnimation = true;
  canPlaySound = true;
  constructor(game) {
    this.game = game;
    menuMusic.pause();
    menuMusic.currentTime = 0;
    mainMusic.pause();
    mainMusic.currentTime = 0;
  }
  update(dt) {
    if (this.animating) {
      this.textVelocity += 0.8 * dt;
      this.curPositionY += this.textVelocity * dt;
      if (this.curPositionY >= this.maxPositionY) {
        this.curPositionY = this.maxPositionY;
        if(this.textVelocity>=5) {
          wallCollisionSound.play()
          this.game.shake(16, 6)
        }
        this.textVelocity /= -1.7 * dt;
        if (this.textVelocity > -0.4) {
          this.animating = false;
        }
      }
      if (inputs.taped && this.canEndAnimation) {
        this.animating = false;
      } else if (!inputs.taped) {
        this.canEndAnimation = true;
      }
    } else {
      if (this.canPlaySound) {
        this.canPlaySound = false;
        loseSound.play();
      }
      this.showIndex++;
      if (this.showIndex % 40 === 0) {
        this.canShow = this.canShow ? false : true;
      }
      if (inputs.taped && this.canRestart) {
        this.game.setCurrentState("menu");
        this.game.canChangeState = false;
      } else if (!inputs.taped) {
        this.canRestart = true;
      }
    }
  }
  render(ctx) {
    if (this.animating) {
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.font = "40px game";
      ctx.fillText("game_over", this.game.canvas.width / 2, this.curPositionY);
    } else {
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.font = "40px game";
      ctx.fillText("game_over", this.game.canvas.width / 2, this.maxPositionY);
      if (this.canShow) {
        ctx.font = "20px game";
        ctx.fillText(
          "< restart the game >",
          this.game.canvas.width / 2,
          this.maxPositionY + 60,
        );
      }
    }
  }
}
