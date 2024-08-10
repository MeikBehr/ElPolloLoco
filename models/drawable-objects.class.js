class DrawableObjects {
    x;
    y;
    height;
    width;
    imageCache = {};
    currentImage = 0;
    img;


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

    
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    clearAllIntervals() {
        for (let i = 1; i < 9999; i++) window.clearInterval(i);
    }

}