class Character extends MovableObject {

    height = 300;
    width = 150;
    speed = 6;

    IMAGES_WALKING = [
            './assets/img/2_character_pepe/2_walk/W-21.png',
            './assets/img/2_character_pepe/2_walk/W-22.png',
            './assets/img/2_character_pepe/2_walk/W-23.png',
            './assets/img/2_character_pepe/2_walk/W-24.png',
            './assets/img/2_character_pepe/2_walk/W-25.png',
            './assets/img/2_character_pepe/2_walk/W-26.png',
    ];

    world;                                                          // damit Variablen von world.class.js übergeben werden können => hier besonders das keyboard
    // swimming_sound = new Audio('./assets/audio/swimming_2.mp3');

    constructor() {
        super();
        this.loadImage('./assets/img/2_character_pepe/2_walk/W-21.png',);

        // cachen der Bilder für Swimming
        this.loadImages(this.IMAGES_WALKING);
        
        this.animate();

        this.x = 0;
        this.y = 135;
    
    };

    // spielt die gecachten Bilder ab z.B. Animation beim Schwimmen
    animate() {


        // Bewegung
        setInterval( () => {
            // this.swimming_sound.pause();


            if (this.world.keyboard.RIGHT ||
                this.world.keyboard.LEFT) {
                    // this.swimming_sound.playbackRate = 3;
                    // this.swimming_sound.volume = 0.3;
                    // this.swimming_sound.play();
            }

            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.x += this.speed;
                this.otherDirection = false;
            };

            if (this.world.keyboard.LEFT && this.x > 0) {
                this.otherDirection = true;
                this.x -= this.speed;
            };

            this.world.camera_x = -this.x + 50;      // Kamera-X immer auf Charakter-X + 50px
            
        }, 1000 / 60);

        // Schwimm-Animation
        setInterval( () => {
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT
                || this.world.keyboard.UP || this.world.keyboard.DOWN
            ) {
                this.playAnimation(this.IMAGES_WALKING);
            } 
        }, 100);

    };


    jump() {

    };

}