export let playerHurtSound = document.getElementById("hurt-sound");
export let pickPotionSound = document.getElementById("potion-sound");
pickPotionSound.volume = 0.5;
export const wallCollisionSound = document.getElementById("collision-sound");
export let loseSound = document.getElementById("lose-sound");
export let explosionSound = document.getElementById("explosion-sound");
export let shootSound = document.getElementById("shoot-sound");
export let levelUpSound = document.getElementById("level-up-sound");
export let enemyExplosionSound = document.getElementById("enemy-explosion");
enemyExplosionSound.volume = 0.3;
let sounds = [
  playerHurtSound,
  pickPotionSound,
  wallCollisionSound,
  loseSound,
  explosionSound,
  shootSound,
  levelUpSound,
  enemyExplosionSound
];
export function muteSound() {
  for (let i = 0; i < sounds.length; i++) {
    sounds[i].muted = true;
  }
}
export function unmuteSound() {
  for (let i = 0; i < sounds.length; i++) {
    sounds[i].muted = false;
  }
}
export let mainMusic = document.getElementById("playing-music");
mainMusic.volume = 0.5;
export let menuMusic = document.getElementById("menu-music");
menuMusic.volume = 0.5;
let musics = [mainMusic, menuMusic];
export function muteMusic() {
  for (let i = 0; i < musics.length; i++) {
    musics[i].muted = true;
  }
}
export function unmuteMusic() {
  for (let i = 0; i < musics.length; i++) {
    musics[i].muted = false;
  }
}
