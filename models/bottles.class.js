class Bottle extends MovableObject {
    /**
     * Height of the bottle.
     * @type {number}
     */
    height = 80;

    /**
     * Width of the bottle.
     * @type {number}
     */
    width = 80;

    /**
     * Indicates if the bottle is currently thrown.
     * @type {boolean}
     */
    isThrown = false;

    /**
     * Offset values for collision detection.
     * @type {Object}
     */
    offset = { top: 5, bottom: 10, left: 13, right: 20 };

    /**
     * Images for bottle in-air animation.
     * @type {Array<string>}
     */
    IMAGES_BOTTLE = [
        './assets/img/6_salsa_bottle/1_salsa_bottle_in_air.png',
        './assets/img/6_salsa_bottle/2_salsa_bottle_in_air.png',
    ];

    /**
     * Image for bottle on-ground state.
     * @type {Array<string>}
     */
    IMAGES_BOTTLE_GROUND = [
        './assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    ];

    /**
     * Initializes a bottle with its initial position and animations.
     * @param {number} x - Initial X position.
     * @param {number} y - Initial Y position.
     */
    constructor(x, y) {
        super();
        this.loadImage(this.IMAGES_BOTTLE[0]);
        this.loadImages(this.IMAGES_BOTTLE);
        this.loadImages(this.IMAGES_BOTTLE_GROUND);
        this.x = x;
        this.y = y;
        this.animate();
    }

    /**
     * Plays the in-air animation while the game is not paused.
     */
    animate() {
        setInterval(() => {
            if (!isPaused) {
                this.playAnimation(this.IMAGES_BOTTLE);
            }
        }, 175);
    }
}
