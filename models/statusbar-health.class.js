/** 
 * Represents a health status bar in the game.
 * @extends Statusbar
 */
class StatusbarHealth extends Statusbar {
    /** 
     * Array of image paths representing different health states of the status bar.
     * @type {Array<string>}
     */
    IMAGES = [
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png',
    ];

    /** 
     * Current percentage of the health status.
     * @type {number}
     */
    percentage = 100;

    /** 
     * Creates an instance of StatusbarHealth.
     * Initializes the images, sets the position, and sets the initial percentage.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.y = 10;
        this.setPercentage(this.percentage);
    }
}
