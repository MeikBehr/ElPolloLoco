class Character extends MovableObject {

    height = 250;
    width = 115;
    speed = 8;
    groundLevel = 180;
    y = 20; // 180

    IMAGES_WALKING = [
            './assets/img/2_character_pepe/2_walk/W-21.png',
            './assets/img/2_character_pepe/2_walk/W-22.png',
            './assets/img/2_character_pepe/2_walk/W-23.png',
            './assets/img/2_character_pepe/2_walk/W-24.png',
            './assets/img/2_character_pepe/2_walk/W-25.png',
            './assets/img/2_character_pepe/2_walk/W-26.png',
    ];

    world;                                                          // damit Variablen von world.class.js übergeben werden können => hier besonders das keyboard
     walking_sound = new Audio('./assets/audio/walking.mp3');

    constructor() {
        super();
        this.loadImage('./assets/img/2_character_pepe/2_walk/W-21.png',);
        this.loadImages(this.IMAGES_WALKING);

        this.applyGravity(this.groundLevel);
       
        this.animate();

        this.x = 0;
    
    };

    // spielt die gecachten Bilder ab z.B. Animation beim Schwimmen
    animate() {


        // Bewegung
        setInterval( () => {
            this.walking_sound.pause();


            if (this.world.keyboard.RIGHT ||
                this.world.keyboard.LEFT) {
                    this.walking_sound.playbackRate = 2;
                    this.walking_sound.volume = 0.3;
                    this.walking_sound.play();
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

        setInterval( () => {
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
            } 
        }, 100);

    };


    jump() {

    };

}