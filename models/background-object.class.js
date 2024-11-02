class BackgroundObject extends MovableObject {
    /**
     * Width of the background object.
     * @type {number}
     */
    width = 720;

    /**
     * Height of the background object.
     * @type {number}
     */
    height = 480;

    /**
     * Initializes a background object with image, position, and dimensions.
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - X position of the background.
     * @param {number} y - Y position of the background.
     */
    constructor(imagePath, x, y) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = y;
    }
}
