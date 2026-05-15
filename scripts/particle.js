import { Entity, Rectangle } from "./general.js";

class Particle extends Entity {
  static particles = [];
  constructor(x, y, dir, life, speed, color) {
    super(new Rectangle(x, y, 2, 2));
    this.dir = dir;
    this.life = life;
    this.speed = speed;
    this.color = color;
  }
  update() {
    this.speed -= 0.5;
    if (this.speed < 0) {
      this.speed = 0;
    }
    this.life--;
    let xa = 0,
      ya = 0;
    xa = Math.cos(this.dir) * this.speed;
    ya = Math.sin(this.dir) * this.speed;
    this.move(xa, ya);
    if (this.life < 0) {
      Particle.removeParticle(this);
    }
  }
  render(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      Math.floor(this.x),
      Math.floor(this.y),
      this.width,
      this.height,
    );
  }
  static addParticle(p) {
    Particle.particles.push(p);
  }
  static removeParticle(p) {
    Particle.particles.splice(Particle.particles.indexOf(p), 1);
  }
  static clear() {
    this.particles = [];
  }
}
export default Particle;
