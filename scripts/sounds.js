export let playerHurtSound = new Audio('../res/player-hurt.wav');
playerHurtSound.volume = 0.6;
export let pickPotionSound = new Audio('../res/pick-potion.wav');
pickPotionSound.volume = 0.4;
export let wallCollisionSound = new Audio('../res/wall-collision.wav')
wallCollisionSound.volume = 0.6;
export let loseSound = new Audio('../res/lose.wav')
loseSound.volume = 0.6;
export let explosionSound = new Audio('../res/explosion.wav');
explosionSound.volume = 0.6;
export let shootSound = new Audio('../res/shoot.wav');
shootSound.volume = 0.6;
let sounds = [playerHurtSound, pickPotionSound, wallCollisionSound, loseSound, explosionSound, shootSound];
export function muteSound()
{
    for(let i = 0;i<sounds.length;i++)
    {
        sounds[i].muted = true;
    }
}
export function unmuteSound()
{
    for(let i = 0;i<sounds.length;i++)
    {
        sounds[i].muted = false;
    }
}