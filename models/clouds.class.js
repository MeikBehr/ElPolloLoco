/**
 * Represents a cloud in the game that moves horizontally.
 * @extends MovableObject
 */
class Cloud extends MovableObject {

    /** @type {HTMLImageElement} - The image of the cloud */
    img;

    /** 
     * @param {number} x - Initial x position of the cloud
     */
    constructor (x) {
        super();
        this.loadImage('./assets/img/5_background/layers/4_clouds/1.png');
        this.x = x;
        this.y = 10;
        this.speed = 0.15;
        this.width = 500;
        this.height = 250;
        this.animate();
    }

    /** 
     * Animates the cloud by moving it horizontally across the screen.
     */
    animate() {
        setInterval( () => {
            if(!isPaused) {
                this.x -= this.speed;
            }
        }, 1000 / 60);
    }
}
