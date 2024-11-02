/** 
 * Represents a status bar in the game, providing visual feedback on various game metrics.
 * @extends DrawableObjects
 */
class Statusbar extends DrawableObjects {
    /** 
     * Current percentage value of the status bar.
     * @type {number}
     */
    percentage = 100;

    /** 
     * Indicates if the status bar is facing the other direction.
     * @type {boolean}
     */
    otherDirection = false;

    /** 
     * Width of the status bar.
     * @type {number}
     */
    width = 200;

    /** 
     * Height of the status bar.
     * @type {number}
     */
    height = 50;

    /** 
     * X position of the status bar on the screen.
     * @type {number}
     */
    x = 20;

    /** 
     * Sets the current percentage of the status bar and updates its image accordingly.
     * @param {number} percentage - The new percentage value (0-100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex(this.percentage)];
        this.img = this.imageCache[path];
    }

    /** 
     * Resolves the appropriate image index based on the current percentage.
     * @param {number} percentage - The current percentage value (0-100).
     * @returns {number} The index of the image corresponding to the percentage.
     */
    resolveImageIndex(percentage) {
        return percentage === 100 ? 5 :
           percentage >= 80 ? 4 :
           percentage >= 60 ? 3 :
           percentage >= 40 ? 2 :
           percentage >= 20 ? 1 : 0;
    }
}
