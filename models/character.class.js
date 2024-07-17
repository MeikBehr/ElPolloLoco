class Character extends MovableObject {

    height = 250;
    width = 115;
    speed = 8;
    y = 0; // 180
    frame = true;


    IMAGES_STANDING = [
        './assets/img/2_character_pepe/2_walk/W-21.png',
    ]

    IMAGES_IDLE = [
        './assets/img/2_character_pepe/1_idle/idle/I-1.png',
        './assets/img/2_character_pepe/1_idle/idle/I-2.png',
        './assets/img/2_character_pepe/1_idle/idle/I-3.png',
        './assets/img/2_character_pepe/1_idle/idle/I-4.png',
        './assets/img/2_character_pepe/1_idle/idle/I-5.png',
        './assets/img/2_character_pepe/1_idle/idle/I-6.png',
        './assets/img/2_character_pepe/1_idle/idle/I-7.png',
        './assets/img/2_character_pepe/1_idle/idle/I-8.png',
        './assets/img/2_character_pepe/1_idle/idle/I-9.png',
        './assets/img/2_character_pepe/1_idle/idle/I-10.png',
    ];

    IMAGES_WALKING = [
        './assets/img/2_character_pepe/2_walk/W-21.png',
        './assets/img/2_character_pepe/2_walk/W-22.png',
        './assets/img/2_character_pepe/2_walk/W-23.png',
        './assets/img/2_character_pepe/2_walk/W-24.png',
        './assets/img/2_character_pepe/2_walk/W-25.png',
        './assets/img/2_character_pepe/2_walk/W-26.png',
    ];


    IMAGES_JUMPING = [
        './assets/img/2_character_pepe/3_jump/J-31.png',
        './assets/img/2_character_pepe/3_jump/J-32.png',
        './assets/img/2_character_pepe/3_jump/J-33.png',
        './assets/img/2_character_pepe/3_jump/J-34.png',
        './assets/img/2_character_pepe/3_jump/J-35.png',
        './assets/img/2_character_pepe/3_jump/J-36.png',
        './assets/img/2_character_pepe/3_jump/J-37.png',
        './assets/img/2_character_pepe/3_jump/J-38.png',
        './assets/img/2_character_pepe/3_jump/J-39.png',
    ]

    world;                                                          // damit Variablen von world.class.js übergeben werden können => hier besonders das keyboard
     walking_sound = new Audio('./assets/audio/walking.mp3');
     jump_sound = new Audio('assets/audio/jump.mp3');

    constructor() {
        super();
        this.loadImage('./assets/img/2_character_pepe/2_walk/W-21.png',);
        this.loadImages(this.IMAGES_STANDING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);

        this.applyGravity();

        this.animate();


        this.x = 0;
    
    };

    // spielt die gecachten Bilder ab z.B. Animation beim Schwimmen
    animate() {


        // Bewegung
        setInterval( () => {
            this.walking_sound.pause();


            if ((this.world.keyboard.RIGHT ||
                this.world.keyboard.LEFT) &&
                !this.isAboveGround()) {
                    this.walking_sound.playbackRate = 2;
                    this.walking_sound.volume = 0.3;
                    this.walking_sound.play();
            }

            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
            };

            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
            };

            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
            }

            this.world.camera_x = -this.x + 50;      // Kamera-X immer auf Charakter-X + 50px
            
        }, 1000 / 60);

        setInterval( () => {

            if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
            }  else {
                this.playAnimation(this.IMAGES_IDLE);
            }

        }, 100);

    };



}