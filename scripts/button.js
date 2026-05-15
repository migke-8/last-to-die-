import { Rectangle } from "./general";

const fontSize = 16
export class Button {
  canSelect = false
  constructor(game, text, x, y) {
    this.game = game;
    this.text = text;
    this.x = x;
    this.y = y;
    this.clickBox = new Rectangle(this.x, this.y, text.length*fontSize)
  }
  update() {
  }
}
