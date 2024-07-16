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


    loadImage(path) {
        this.img = new Image();     // vergeichbar dem hier: this.img = document.getElementById('image') <img id="image" src="">
        this.img.src = path;
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


    // moveRight() {
    //     setInterval(() => {
    //         this.x += this.speed;
    //     }, 1000 / 60);
    // }
    

    // moveLeft() {
    //     setInterval(() => {
    //         this.x -= this.speed;
    //     }, 1000 / 60);
    // }


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


}