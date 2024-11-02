/**
 * Represents a collectible coin in the game.
 * @extends MovableObject
 */
class Coin extends MovableObject {

    /** @type {number} - The height of the coin */
    height = 80;

    /** @type {number} - The width of the coin */
    width = 80;

    /** @type {boolean} - Indicates whether the coin has been collected */
    collected = false;

    /** 
     * @type {Object} - The offset values for collision detection
     * @property {number} top - The top offset
     * @property {number} bottom - The bottom offset
     * @property {number} left - The left offset
     * @property {number} right - The right offset
     */
    offset = {
        top: 10,
        bottom: 20,
        left: 10,
        right: 20,
    };

    /** @type {string[]} - The images for the coin animation */
    IMAGES_COINS = [
        './assets/img/8_coin/coin_1.png',
        './assets/img/8_coin/coin_2.png',
    ];

    /** 
     * @param {number} x - The x position of the coin
     * @param {number} y - The y position of the coin
     */
    constructor(x, y) {
        super();
        this.loadImage(this.IMAGES_COINS[0]);
        this.loadImages(this.IMAGES_COINS);
        this.x = x;
        this.y = y;
        this.animate();
    }

    /** 
     * Animates the coin by playing its animation frames.
     */
    animate() {
        setInterval( () => {
            if(!isPaused) {
                this.playAnimation(this.IMAGES_COINS);
            }
        }, 175);
    }
}
