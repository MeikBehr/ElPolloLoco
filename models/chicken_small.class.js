/**
 * Represents a small chicken enemy.
 * @extends NormalEnemies
 */
class ChickenSmall extends NormalEnemies {

    /** @type {number} - Height of the chicken */
    height = 60;

    /** @type {number} - Width of the chicken */
    width = 60;

    /** @type {number} - Y position of the chicken */
    y = 366;

    /** @type {number} - Speed of the chicken */
    speed = 1;

    /** @type {boolean} - Indicates if the chicken is dead */
    enemyIsDead = false;

    /** @type {{top: number, bottom: number, left: number, right: number}} - Collision offset values */
    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    };

    /** @type {string[]} - Array of images for the chicken walking animation */
    IMAGES_WALKING = [
        './assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

    /** @type {string[]} - Array of images for the chicken dead animation */
    IMAGES_DEAD = [
        './assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png',
    ];

    /** 
     * @param {number} x - Initial x position of the chicken
     */
    constructor(x) {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x + Math.random() * 500;
        this.speed = this.speed + Math.random() * 0.25;
        this.animate();
    }
}
