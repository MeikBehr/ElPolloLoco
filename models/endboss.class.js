class Endboss extends MovableObject {

    soundVolume = 0.1;
    endbossSpawned = false;


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
        // Startbild
        this.loadImage(this.IMAGES_ALERT[0]);
        // cachen der Bilder
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);

        this.height = 480;
        this.width = 480;
        this.x = 300;             // this.x = 600 + Math.random() * 1500;
        this.y = 0;             // this.y = 0 + Math.random() * 350;
        this.speed = 0.15 + Math.random() * 0.25;

        this.introduce().then(() => this.animate());

    };



    // introduce and spawning of endboss
    introduce() {
        return new Promise((resolve) => {
            let interval = setInterval(() => {
                if (!this.endbossSpawned) {
                    // this.introduce_sound.playbackRate = 1;
                    // this.introduce_sound.volume = this.soundVolume;
                    // this.introduce_sound.play();
                    this.playAnimation(this.IMAGES_ALERT);
                    if(this.currentImage == this.IMAGES_ALERT.length) {
                        this.endbossSpawned = true;
                        clearInterval(interval);
                        resolve();
                    }
                } else {
                    resolve();
                }
            }, 400)
        });
    }


    animate() {
    
        // spielt die gecachten Bilder ab z.B. Animation beim Schwimmen
        setInterval(() => {
            if (this.endbossSpawned) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 170)
    }

    

}







/*



introduce() {

        return new Promise((resolve) => {
        
            setInterval(() => {

                if (!this.endbossSpawned) {
                    this.introduce_sound.playbackRate = 1;
                    this.introduce_sound.volume = 0.5;
                    this.introduce_sound.play();
                    this.playAnimation(this.IMAGES_INTRODUCE);
                    if(this.currentImage == this.IMAGES_INTRODUCE.length) {
                        this.endbossSpawned = true;
                    }
                } else {
                    this.playAnimation(this.IMAGES_FLOATING);
                }
    
            }, 500)

            setTimeout(() => {
                console.log("Endboss introduced");
                resolve();
            }, 5000); // Beispiel: 2 Sekunden Verzögerung für die Einführungsanimation
        });

    }


*/