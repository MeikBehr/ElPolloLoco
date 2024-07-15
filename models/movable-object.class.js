class MovableObject {
    x;
    y;
    img;
    height;
    width;
    speed;
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


    moveRight() {
        console.log('Moving right');
    }
    

    moveLeft() {
        setInterval(() => {
            // this.x -= this.speed;
            this.x > -50 ? (this.x -= this.speed) : (this.x = 800);
        }, 1000 / 60);
    }


    // spielt die gecachten Bilder ab z.B. Animation beim Schwimmen
    playAnimation(images) {
        // % = Modulo-Berechnung, d.h. Rest-Berechnung: Ergibt eine Reihe i = 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5,...
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];   // img & imageCache sind in der moveable-object.class.js declariert
        this.currentImage++;
    }

}