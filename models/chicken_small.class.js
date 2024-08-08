class Chicken_small extends NormalEnemies {

    height = 55;
    width = 55;
    y = 368;
    speed = 0.7;

    chickenIsDead = false;

    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      };

    IMAGES_WALKING = [
        './assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

    IMAGES_DEAD = [
        './assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png',
    ];

    constructor(x) {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x + Math.random() * 500;
        this.speed = this.speed + Math.random() * 0.25;

        this.animate();
    }


}