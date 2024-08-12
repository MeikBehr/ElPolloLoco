class Coin extends MovableObject {

    height = 80;
    width = 80;
    collected = false;
    
    offset = {
        top: 10,
        bottom: 20,
        left: 10,
        right: 20,
      };

    IMAGES_COINS = [
        './assets/img/8_coin/coin_1.png',
        './assets/img/8_coin/coin_2.png',
    ]

    constructor(x, y) {
        super();
        this.loadImage(this.IMAGES_COINS[0]);
        this.loadImages(this.IMAGES_COINS);
        this.x = x;
        this.y = y;
        this.animate();
    }

    animate() {
        setInterval( () => {
            if(!isPaused) {
                this.playAnimation(this.IMAGES_COINS);
            }
        }, 175);
    }

}