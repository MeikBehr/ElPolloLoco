/** 
 * Represents a status bar for coins in the game.
 * @extends Statusbar
 */
class StatusbarCoin extends Statusbar {
    /** 
     * Array of image paths representing different states of the coin status bar.
     * @type {Array<string>}
     */
    IMAGES = [
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png',
    ];

    /** 
     * Current percentage of the coin status.
     * @type {number}
     */
    percentage = 0;

    /** 
     * Creates an instance of StatusbarCoin.
     * Initializes the images and sets the initial percentage.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.y = 55;
        this.setPercentage(this.percentage);
    }
}
