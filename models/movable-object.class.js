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


    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }


    applyGravity() {
        setInterval(()=> {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                if (this instanceof Character) {
                    this.y > 180 ? this.y = 180 : this.y = this.y; 
                }
                this.speedY -= this.acceleration;
            };
        }, 1000 / 25)
    }


    isAboveGround() {
        if(this instanceof ThrowableObject) {
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
            this.energy -= 5;
        };

        if (enemy instanceof Chicken) {
            this.energy -= 10;
        };

        if (enemy instanceof Endboss) {
            this.energy -= 20;
        };

        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
       
    }


    isDead() {
        return this.energy == 0;
    }


    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000
        return timepassed < 2;
    }

    isHurtEndboss() {
        let timepassed = new Date().getTime() - this.lastHitEndBoss;
        timepassed = timepassed / 1000
        return timepassed < 2;
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


