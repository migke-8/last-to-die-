export class Transition {
  firstScale = 1;
  secondScale = 2;
  exiting = true;
  entering = false;
  constructor(curState, stateName) {
    const canvas = curState.game.canvas;
    this.state = curState;
    this.nextState = stateName;
    this.firstCanvas = document.createElement("canvas");
    this.firstCtx = this.firstCanvas.getContext("2d");
    this.firstCanvas.width = this.state.game.canvas.width;
    this.firstCanvas.height = this.state.game.canvas.height;
    curState.render(this.firstCtx);
    this.firstImage = new Image();
    this.firstImage.src = this.firstCanvas.toDataURL();
    this.secondCanvas = document.createElement("canvas");
    this.secondCtx = this.secondCanvas.getContext("2d");
    this.secondCanvas.width = this.state.game.canvas.width;
    this.secondCanvas.height = this.state.game.canvas.height;
    curState.game.scenes.get(stateName).render(this.secondCtx);
    this.secondImage = new Image();
    this.secondImage.src = this.secondCanvas.toDataURL();
    this.firstX = canvas.width / 2;
    this.secondX = -canvas.width / 2;
  }
  update() {
    if (this.stoped) return;
    const canvas = this.state.game.canvas;
    if (this.exiting) {
      this.firstScale += 0.2 / 3;
      if (this.firstScale >= 2) {
        this.exiting = false;
        this.firstScale = 2;
      }
    } else if (!this.entering) {
      this.firstX += 6;
      this.secondX += 6;
      if (this.secondX >= canvas.width / 2) {
        this.secondX = canvas.width / 2;
        this.entering = true;
      }
    }
    if (this.entering) {
      this.secondScale -= 0.2 / 5;
      if (this.secondScale <= 1) {
        this.secondScale = 1;
        this.entering = false;
        this.stoped = true;
        this.state.game.curState = this.state.game.scenes.get(this.nextState);
      }
    }
  }
  render(ctx) {
    ctx.drawImage(
      this.firstImage,
      this.firstX - this.firstImage.width / (this.firstScale * 2),
      this.state.game.canvas.height / 2 -
      this.firstImage.height / (this.firstScale * 2),
      this.firstImage.width / this.firstScale,
      this.state.game.canvas.height / this.firstScale,
    );
    ctx.drawImage(
      this.secondImage,
      this.secondX - this.secondImage.width / (this.secondScale * 2),
      this.state.game.canvas.height / 2 -
      this.secondImage.height / (this.secondScale * 2),
      this.secondImage.width / this.secondScale,
      this.state.game.canvas.height / this.secondScale,
    );
  }
}
