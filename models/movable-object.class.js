class MovableObject extends DrawableObjects {
    speed;
    speedY = 0;
    acceleration = 1.5;
    otherDirection = false;
    energy = 100;
    energyEndboss = 100;
    lastHit = 0;
    lastHitEndBoss = 0;



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
            return true;
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
        this.jump_sound.playbackRate = 0.4;
        this.jump_sound.volume = 0.03;
        this.jump_sound.play();
    }

    // charakter.iscolliding(chicken);
    iscolliding(mo) {
        return  this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    }

    
    hit() {
        this.energy -= 5;

        if (this.energy < 0) {
            this.energy = 0;

            // Auferstehung nach 3 Sekunden!
            const myResurrection = setTimeout(() => {
                this.energy = 100;
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
        return timepassed < 1;                                  // kleiner 5s true, größer false
    }

}


