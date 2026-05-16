class UI {
  scoreMessageAlpha = 0;
  fadingOut = false;
  colorIndex = 0;
  canShowScoreMessage = true;
  constructor(scene) {
    this.scene = scene;
  }
  update(dt) {
    if (this.newHighScore) {
      this.colorIndex++;
      this.scoreMessageAlpha += this.fadingOut ? -0.01 : 0.05 * dt;
      if (this.scoreMessageAlpha >= 1) {
        this.scoreMessageAlpha = 1;
        this.fadingOut = true;
      }
      if (this.scoreMessageAlpha <= 0 && this.fadingOut) {
        this.newHighScore = false;
        this.canShowScoreMessage = false;
      }
    }
  }

  render(ctx) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.scene.game.canvas.width, 12);
    ctx.fillStyle = "#FFF";
    ctx.font = "20px game";
    let string = "score: " + this.scene.player.score;
    ctx.textAlign = "center";
    ctx.fillText(string, this.scene.game.canvas.width / 2, 11);

    if (this.newHighScore) {
      let string = "new high-score!";
      ctx.textAlign = "center";
      ctx.font = "20px game";
      ctx.fillStyle = `rgba(255, 255, 255, ${this.scoreMessageAlpha})`;
      ctx.fillText(string, this.scene.game.canvas.width / 2, this.scene.game.canvas.height);
    }
  }
}
export default UI;
