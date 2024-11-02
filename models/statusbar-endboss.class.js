/** 
 * Represents a status bar for the end boss in the game.
 * @extends Statusbar
 */
class StatusbarEndboss extends Statusbar {
    /** 
     * Array of image paths representing different states of the end boss status bar.
     * @type {Array<string>}
     */
    IMAGES = [
        './assets/img/7_statusbars/2_statusbar_endboss/green/green0.png',
        './assets/img/7_statusbars/2_statusbar_endboss/green/green20.png',
        './assets/img/7_statusbars/2_statusbar_endboss/green/green40.png',
        './assets/img/7_statusbars/2_statusbar_endboss/green/green60.png',
        './assets/img/7_statusbars/2_statusbar_endboss/green/green80.png',
        './assets/img/7_statusbars/2_statusbar_endboss/green/green100.png',
    ];

    /** 
     * Current percentage of the end boss's health.
     * @type {number}
     */
    percentage = 100;

    /** 
     * Creates an instance of StatusbarEndboss.
     * Initializes the images, sets the position, and sets the initial percentage.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.y = 55;
        this.x = 500;
        this.setPercentage(this.percentage);
    }
}
