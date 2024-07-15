
/* In USE */ 

class Chicken extends MovableObject {

    height = 150;
    width = 150;
    y = 280;

    IMAGES_WALKING = [
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        './assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    constructor(x,y) {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        
        // cachen der Bilder für walking
        this.loadImages(this.IMAGES_WALKING);
        this.x = 600 + Math.random() * 500;
        // this.x = x;
        this.speed = 0.15 + Math.random() * 0.25;

        this.animate();
    }


    // spielt die gecachten Bilder ab z.B. Animation beim walking
    animate() {
        this.moveLeft();
        setInterval( () => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 175);
    }


}