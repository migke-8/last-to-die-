export let playerHurtSound = document.getElementById('hurt-sound');
playerHurtSound.volume = 0.6;
export let pickPotionSound = document.getElementById('potion-sound')
pickPotionSound.volume = 0.3;
export let wallCollisionSound = document.getElementById('collision-sound');
wallCollisionSound.volume = 0.6;
export let loseSound = document.getElementById('lose-sound')
loseSound.volume = 0.6;
export let explosionSound = document.getElementById('explosion-sound')
explosionSound.volume = 0.6;
export let shootSound = document.getElementById('shoot-sound')
shootSound.volume = 0.6;
export let levelUpSound = document.getElementById('level-up-sound');
levelUpSound.volume = 0.6;
let sounds = [playerHurtSound, pickPotionSound, wallCollisionSound, loseSound, explosionSound, shootSound, levelUpSound];
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