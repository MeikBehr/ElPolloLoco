class Endboss extends MovableObject {

    soundVolume = 0.1;
    // endbossSpawned = false;
    offset = {
        top: 60,
        bottom: 70,
        left: 0,
        right: 0,
      };


    IMAGES_ALERT = [
        './assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        './assets/img/4_enemie_boss_chicken/2_alert/G12.png',
    ]

    IMAGES_WALKING = [
        './assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        './assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        './assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        './assets/img/4_enemie_boss_chicken/1_walk/G4.png',
    ]

    // world;
    // introduce_sound = new Audio('./assets/audio/introduce_boss.mp3');


    // consturctor(x,y) ist denkbar um fixe Stelle für Endboss zu haben
    constructor() {
        super();
        this.loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);

        this.height = 450;
        this.width = 350;
        this.x = 300;
        this.y = 10;
        this.speed = 0.15 + Math.random() * 0.25;

        this.animate();
        // this.introduce().then(() => this.animate());

    };

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_ALERT);
        }, 170)
    }


    

}





