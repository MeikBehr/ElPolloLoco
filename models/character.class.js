class Character extends MovableObject {

    height = 250;
    width = 115;
    speed = 8;
    y = 0;

    coins = 0;
    bottles = 1000; // 0
    idleTime = 0;

    offset = {
        top: 90,
        bottom: 10,
        left: 10,
        right: 10,
    };


    IMAGES_STANDING = [
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
    ]

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


    IMAGES_HURT = [
        './assets/img/2_character_pepe/4_hurt/H-41.png',
        './assets/img/2_character_pepe/4_hurt/H-42.png',
        './assets/img/2_character_pepe/4_hurt/H-43.png',
    ]


    IMAGES_DYING = [
        './assets/img/2_character_pepe/5_dead/D-51.png',
        './assets/img/2_character_pepe/5_dead/D-52.png',
        './assets/img/2_character_pepe/5_dead/D-53.png',
        './assets/img/2_character_pepe/5_dead/D-54.png',
        './assets/img/2_character_pepe/5_dead/D-55.png',
        './assets/img/2_character_pepe/5_dead/D-56.png',
        './assets/img/2_character_pepe/5_dead/D-57.png',
    ]

    IMAGES_SLEEPING = [
        './assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
        './assets/img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];


    
    world;                                                          // damit Variablen von world.class.js übergeben werden können => hier besonders das keyboard

    constructor() {
        super();
        this.loadImage('./assets/img/2_character_pepe/2_walk/W-21.png',);
        this.loadImages(this.IMAGES_STANDING);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DYING);
        this.loadImages(this.IMAGES_SLEEPING);
        this.applyGravity();
        this.animate();
        this.x = 0;
    };

    






    animate() {
        setInterval(() =>{
            this.characterMovements();
        }, 1000 / 60);

        setInterval(() =>{    
            this.characterAnimations();
        }, 100);

    }


    characterMovements() {
        this.world.sound_walk.pause();
        this.characterMovesRight();
        this.characterMovesLeft();
        this.characterJumps();
        this.world.camera_x = -this.x + 100;
    }

    characterMovesRight() {
        if(this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
        }
    }

    characterMovesLeft() {
        if(this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
        }
    }

    characterJumps() {
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            this.characterJumpSound();
        }
    }


    characterJumpSound() {
        this.stopSound(this.world.sound_snoring);
        if (this.world.sound_jump.paused) {
            this.world.sound_jump.playbackRate = 0.4;
            this.world.sound_jump.volume = 0.01;
            this.playSound(this.world.sound_jump);
        }
    }


    characterAnimations() {
        if (this.isDead()) {
            this.animationDying();
        }
        else if (this.isHurt()) {
            this.animationHurt();
        }
        else if (this.isAboveGround()) {
            this.animationJump();
        } else {
            if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.animationWalk();
            }
            else {
               this.animationIdle(); 
            }         
        }
    }


    animationWalk() {
        this.playAnimation(this.IMAGES_WALKING);
        this.world.sound_walk.playbackRate = 2;
        this.world.sound_walk.volume = 0.3;
        this.stopSound(this.world.sound_snoring);
        this.playSound(this.world.sound_walk);
        this.idleTime = 0;
    }


    animationJump() {
        this.playAnimation(this.IMAGES_JUMPING);
        this.idleTime = 0;
    }



    animationHurt() {
        this.playAnimation(this.IMAGES_HURT);
        this.stopSound(this.world.sound_snoring);
        if (this.world.sound_jump.paused) {
            this.world.sound_hurt.playbackRate = 1;
            this.world.sound_hurt.volume = 0.05;
            this.playSound(this.world.sound_hurt);
        }
        this.idleTime = 0;
    }


    animationIdle() {
        this.playAnimation(this.IMAGES_STANDING);
        this.stopSound(this.world.sound_snoring);
        this.idleTime += 100;
        if (this.idleTime >= 8000) {
            this.playAnimation(this.IMAGES_SLEEPING);
            this.world.sound_snoring.volume = 0.04;
            this.playSound(this.world.sound_snoring);
        }
    }


    animationDying() {
        this.playAnimation(this.IMAGES_DYING);
        // setTimeout(() => {
        //     this.clearAllIntervals();
        //     world.background_sound.pause();
        //     world.sound_walk.pause();
        //     gameOver();
        // }, 1500);
    }



}