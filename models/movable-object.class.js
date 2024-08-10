class MovableObject extends DrawableObjects {
    width;
    height;
    speed;
    x;
    y;
    speedY = 0;
    acceleration = 1.5;
    otherDirection = false;
    energy = 100;
    lastHit = 0;
    lastHitEndBoss = 0;
    standingStill = 0;
    objectIsColiding = false;


    // spielt die gecachten Bilder ab z.B. Animation beim Schwimmen
    playAnimation(images) {
        // % = Modulo-Berechnung, d.h. Rest-Berechnung: Ergibt eine Reihe i = 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5,...
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];   // img & imageCache sind in der moveable-object.class.js declariert
        this.currentImage++;
    }


    applyGravity() {
        setInterval(()=> {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                if (this instanceof Character) {        // Character is always on same level after jumping!
                    this.y > 180 ? this.y = 180 : this.y = this.y; 
                }
                this.speedY -= this.acceleration;
            };
        }, 1000 / 25)
    }


    isAboveGround() {
        if(this instanceof ThrowableObject) {     // Throwable Objects should always fall
            // return true;
            return this.y <= 350;
        } else {
            return this.y < 180;
        }
    }


    moveRight() {
        this.x += this.speed;
    }
    

    moveLeft() {
        this.x -= this.speed;
    }
    
    jump() {
        this.speedY = 26;
    }

    
    isColliding(mo) {
        return  this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    }

    
    hit(enemy) {

        if (enemy instanceof ChickenSmall) {
            this.energy -= 1;
        };

        if (enemy instanceof Chicken) {
            this.energy -= 5;
        };

        if (enemy instanceof Endboss) {
            this.energy -= 10;
        };
        

        if (this.energy < 0) {
            this.energy = 0;

            // Auferstehung nach 3 Sekunden!
            const myResurrection = setTimeout(() => {
                this.energy = 100;
                this.characterIsDead = false;
            }, 3000);
            /////////////////////////////////////////////
        } else {
            this.lastHit = new Date().getTime();
        }
    }


    isDead() {
        return this.energy == 0;
    }


    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;   // difference in ms
        timepassed = timepassed / 1000                          // difference in s
        return timepassed < 2;                                  // kleiner 5s true, größer false
    }

    isHurtEndboss() {
        let timepassed = new Date().getTime() - this.lastHitEndBoss;   // difference in ms
        timepassed = timepassed / 1000                          // difference in s
        return timepassed < 2;                                  // kleiner 5s true, größer false
    }

    playSound(sound) {
        if (!isMuted) {
            sound.play();
        }
    }

    stopSound(sound) {
        sound.pause();
    }

    stopAnimation() {
        clearInterval(this.animationInterval);
        this.currentImageIndex = 0;
    }
    

}


