class Chicken_small extends MovableObject {

    height = 55;
    width = 55;
    y = 368;
    speed = 3.25;
    frame = true;

    IMAGES_WALKING = [
        './assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        './assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

    constructor(x,y) {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 600 + Math.random() * 500;
        this.speed = this.speed + Math.random() * 0.25;

        this.animate();
    }


    // spielt die gecachten Bilder ab z.B. Animation beim walking
    animate() {
        
        setInterval(() => { 
            this.moveLeft();
        }, 1000 / 60)

        setInterval( () => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 175);
    }


}