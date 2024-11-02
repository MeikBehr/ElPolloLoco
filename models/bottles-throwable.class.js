class BottleThrowable extends ThrowableObject {
    /**
     * Height of the throwable bottle.
     * @type {number}
     */
    height = 80;

    /**
     * Width of the throwable bottle.
     * @type {number}
     */
    width = 80;

    /**
     * Indicates if the bottle is currently thrown.
     * @type {boolean}
     */
    isThrown = false;

    /**
     * Indicates if the bottle is thrown in the opposite direction.
     * @type {boolean}
     */
    otherDirection = false;

    /**
     * Offset values for collision detection.
     * @type {Object}
     */
    offset = { top: 5, bottom: 10, left: 13, right: 20 };

    /**
     * Images for bottle rotation animation.
     * @type {Array<string>}
     */
    IMAGES_BOTTLE_ROTATION = [
        './assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];

    /**
     * Images for bottle splash animation.
     * @type {Array<string>}
     */
    IMAGES_BOTTLE_SPLASH = [
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];

    /**
     * Initializes a throwable bottle with position and direction.
     * @param {number} x - Initial X position.
     * @param {number} y - Initial Y position.
     * @param {boolean} otherDirection - If true, bottle is thrown in opposite direction.
     */
    constructor(x, y, otherDirection) {
        super();
        this.loadImages(this.IMAGES_BOTTLE_ROTATION);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;
        this.throw(this.x, this.y, this.otherDirection);
        this.animate();
    }

    /**
     * Animates the bottle while in motion, switching to splash animation upon collision.
     */
    animate() {
        if (!isPaused) {
            const intervalId = setInterval(() => {
                if (this.isAboveGround() && !this.objectIsColiding) {
                    this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
                } else {
                    this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
                    clearInterval(intervalId);
                }
            }, 100);
        }
    }
}
