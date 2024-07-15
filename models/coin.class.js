class Coin extends MovableObject {

    height = 40;
    width = 40;

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
            this.playAnimation(this.IMAGES_COINS);
        }, 175);
    }

}