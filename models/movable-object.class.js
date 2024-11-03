/** 
 * Represents an object in the game that can move and be drawn.
 * @extends DrawableObjects
 */
class MovableObject extends DrawableObjects {
    /** @type {number} The width of the object */
    width;

    /** @type {number} The height of the object */
    height;

    /** @type {number} The speed of the object */
    speed;

    /** @type {number} The x-coordinate of the object */
    x;

    /** @type {number} The y-coordinate of the object */
    y;

    /** @type {number} The vertical speed of the object */
    speedY = 0;

    /** @type {number} The acceleration of the object */
    acceleration = 1.5;

    /** @type {boolean} Indicates the direction the object is facing */
    otherDirection = false;

    /** @type {number} The energy of the object, representing health */
    energy = 100;

    /** @type {number} The timestamp of the last hit received */
    lastHit = 0;

    /** @type {number} The timestamp of the last hit received from the end boss */
    lastHitEndBoss = 0;

    /** @type {number} Counter for standing still */
    standingStill = 0;

    /** @type {boolean} Indicates whether the object is currently colliding with another object */
    objectIsColiding = false;

    /**
     * Plays the animation for the object by cycling through the provided images.
     * @param {Array} images - The array of image paths to animate.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Applies gravity to the object, moving it downwards based on its vertical speed.
     */
    applyGravity() {
        setInterval(() => {
            if ((this.isAboveGround() || this.speedY > 0) && !isPaused) {
                this.y -= this.speedY;
                if (this instanceof Character) {
                    this.y > 180 ? this.y = 180 : this.y = this.y; 
                }
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Checks if the object is above ground.
     * @returns {boolean} True if the object is above ground, false otherwise.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return this.y <= 350;
        } else {
            return this.y < 180;
        }
    }

    /**
     * Moves the object to the right based on its speed.
     */
    moveRight() {
        if (!isPaused) {
            this.x += this.speed;
        }
    }

    /**
     * Moves the object to the left based on its speed.
     */
    moveLeft() {
        if (!isPaused) {
            this.x -= this.speed;
        }
    }

    /**
     * Makes the object jump by setting its vertical speed.
     */
    jump() {
        if (!isPaused) {
            this.speedY = 26;
        }
    }

    /**
     * Checks for collision with another movable object.
     * @param {MovableObject} mo - The other movable object to check against.
     * @returns {boolean} True if there is a collision, false otherwise.
     */
    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    /**
     * Reduces the object's energy based on the type of enemy hit.
     * @param {Enemy} enemy - The enemy that hit the object.
     */
    hit(enemy) {
        if (enemy instanceof ChickenSmall) {
            this.energy -= 20;
        }

        if (enemy instanceof Chicken) {
            this.energy -= 30;
        }

        if (enemy instanceof Endboss) {
            this.energy -= 50;
        }

        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Checks if the object is dead.
     * @returns {boolean} True if the object's energy is zero, false otherwise.
     */
    isDead() {
        return this.energy === 0;
    }

    /**
     * Checks if the object is currently hurt.
     * @returns {boolean} True if the object was hit in the last 2 seconds, false otherwise.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 2;
    }

    /**
     * Checks if the end boss has hurt the object recently.
     * @returns {boolean} True if the object was hit by the end boss in the last 2 seconds, false otherwise.
     */
    isHurtEndboss() {
        let timepassed = new Date().getTime() - this.lastHitEndBoss;
        timepassed = timepassed / 1000;
        return timepassed < 2;
    }

    /**
     * Plays a sound if not muted.
     * @param {HTMLAudioElement} sound - The sound to be played.
     */
    playSound(sound) {
        if (!isMuted) {
            sound.play();
            activeSounds.push(sound);
        }
    }

    /**
     * Stops a sound and resets its playback position.
     * @param {HTMLAudioElement} sound - The sound to be stopped.
     */
    stopSound(sound) {
        sound.pause();
        sound.currentTime = 0;
        activeSounds = activeSounds.filter(s => s !== sound);
    }

    /**
     * Stops the current animation for the object.
     */
    stopAnimation() {
        clearInterval(this.animationInterval);
        this.currentImageIndex = 0;
    }
}
