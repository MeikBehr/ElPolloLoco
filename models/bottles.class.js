class Bottle extends MovableObject {

    height = 80;
    width = 80;
    frame = true;

    IMAGES_BOTTLE = [
        './assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        './assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
    ]

    constructor(x, y) {
        super();
        this.loadImage(this.IMAGES_BOTTLE[0]);
        this.loadImages(this.IMAGES_BOTTLE);
        this.x = x;
        this.y = y;
        this.animate();
    }

    animate() {
        setInterval( () => {
            this.playAnimation(this.IMAGES_BOTTLE);
        }, 175);
    }

}