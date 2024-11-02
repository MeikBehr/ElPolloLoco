/** 
 * Represents a status bar for bottles in the game.
 * @extends Statusbar
 */
class StatusbarBottle extends Statusbar {
    /** 
     * Array of image paths representing different states of the bottle status bar.
     * @type {Array<string>}
     */
    IMAGES = [
        './assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
        './assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
        './assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
        './assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
        './assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
        './assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png',
    ];

    /** 
     * Current percentage of the bottle status.
     * @type {number}
     */
    percentage = 0;

    /** 
     * Creates an instance of StatusbarBottle.
     * Initializes the images and sets the initial percentage.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.y = 100;
        this.setPercentage(this.percentage);
    }
}
