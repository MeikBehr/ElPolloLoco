/**
 * Base class for drawable objects in the game.
 */
class DrawableObjects {
    x;
    y;
    height;
    width;
    imageCache = {};
    currentImage = 0;
    img;

    /**
     * Loads an array of images into the image cache.
     * @param {Array<string>} arr - Array of image paths to load, e.g., ['img/image1.png', 'img/image2.png']
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Loads a single image from the specified path.
     * @param {string} path - The path of the image to load.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the current image of the object onto the specified canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Clears all intervals set in the window.
     */
    clearAllIntervals() {
        for (let i = 1; i < 9999; i++) window.clearInterval(i);
    }
}
