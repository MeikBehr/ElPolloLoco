class MovableObject {
    x;
    y;
    img;
    height;
    width;
    speed;
    speedY = 0;
    acceleration = 1.5;
    imageCache = {};
    currentImage = 0;
    otherDirection = false;
    energy = 100;
    lastHit = 0;


    loadImage(path) {
        this.img = new Image();     // vergeichbar dem hier: this.img = document.getElementById('image') <img id="image" src="">
        this.img.src = path;
    }

    
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }


    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken ||
            this instanceof Endboss || this instanceof Coin || 
            this instanceof Bottle || this instanceof Chicken_small) {
            ctx.beginPath();
            ctx.lineWidth = '3';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }




        // return  
        // this.x + this.width - this.offset.right              > mo.x + mo.offset.left &&
        // this.y + this.height - this.offset.bottom            > mo.y + mo.offset.top &&
        // this.x + this.offset.left                            < mo.x + mo.width - mo.offset.right &&
        // this.y + this.offset.top                             < mo.y + mo.height - mo.offset.bottom
    }




    drawOffsetFrame(ctx) {
        if (this instanceof Chicken) {
            ctx.beginPath();
            ctx.lineWidth = '3';
            ctx.strokeStyle = 'green';
            ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.right, this.height - this.offset.bottom);
            ctx.stroke();
        }

        if (this instanceof Chicken_small) {
            ctx.beginPath();
            ctx.lineWidth = '3';
            ctx.strokeStyle = 'green';
            ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.right, this.height - this.offset.bottom);
            ctx.stroke();
        }

        if (this instanceof Coin) {
            ctx.beginPath();
            ctx.lineWidth = '3';
            ctx.strokeStyle = 'green';
            ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.right, this.height - this.offset.bottom);
            ctx.stroke();
        }

        if (this instanceof Bottle) {
            ctx.beginPath();
            ctx.lineWidth = '3';
            ctx.strokeStyle = 'green';
            ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.right, this.height - this.offset.bottom);
            ctx.stroke();
        }

        if (this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '3';
            ctx.strokeStyle = 'green';
            ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.right, this.height - this.offset.bottom);
            ctx.stroke();
        }

        if (this instanceof Character) {
            ctx.beginPath();
            ctx.lineWidth = '3';
            ctx.strokeStyle = 'green';
            ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.right, this.height - this.offset.bottom);
            ctx.stroke();
        }
    }





    /**
     * 
     * @param {Array} arr - ['img/image1.png', 'img/image2.png', ....]
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        })
    }


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
                this.speedY -= this.acceleration;
            };
        }, 1000 / 25)
    }


    isAboveGround() {
        return this.y < 180;
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


