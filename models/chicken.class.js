
/* In USE */ 

class Chicken extends MovableObject {

    height = 100;
    width = 100;
    y = 325;
    speed = 1.15;

    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      };

    IMAGES_WALKING = [
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    constructor(x) {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        
        this.loadImages(this.IMAGES_WALKING);
        this.x = x + Math.random() * 500;
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