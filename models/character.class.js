class Character extends MovableObject {

    /**
     * Character properties and initial states.
     */
    height = 250;
    width = 115;
    speed = 8;
    y = 0;
    coins = 0;
    bottles = 0;
    idleTime = 0;
    characterIsDead = false;
    killCountChicken = 0;
    killCountSmallChicken = 0;
    soundHurtPlayed = false;
    
    /**
     * Offset values for collision detection.
     */
    offset = { top: 90, bottom: 10, left: 10, right: 10 };

    /**
     * Image sequences for different animations.
     */
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

    
    /**
         * Initializes the character, loads images and starts animations.
         */
    constructor() {
        super();
        this.loadImage('./assets/img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_STANDING);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DYING);
        this.loadImages(this.IMAGES_SLEEPING);
        this.applyGravity();
        this.animate();
        this.x = 0;
        this.energy = 100;
    }


    /**
         * Starts animation and movement intervals for the character.
         */
    animate() {
        setInterval(() => this.characterMovements(), 1000 / 60);
        setInterval(() => this.characterAnimations(), 100);
    }


    /**
     * Handles character movements based on keyboard inputs.
     */
    characterMovements() {
        if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.isAboveGround() &&!isPaused) {
            if (this.world.soundWalk.paused) {
                this.playSound(this.world.soundWalk);
            }
            } else {
                this.world.soundWalk.pause();
            }
        this.characterMovesRight();
        this.characterMovesLeft();
        this.characterJumps();
        this.world.cameraX = -this.x + 100;
    }


    /**
     * Moves character to the right.
     */
    characterMovesRight() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.EndOfLevel) {
            this.moveRight();
            this.otherDirection = false;
        }
    }

    /**
     * Moves character to the left.
     */
    characterMovesLeft() {
        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
        }
    }

    /**
     * Makes character jump and plays jump sound.
     */
    characterJumps() {
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            this.characterJumpSound();
        }
    }

    /**
     * Plays the jump sound with adjusted settings.
     */
    characterJumpSound() {
        this.stopSound(this.world.soundSnoring);
        if (this.world.soundJump.paused) {
            this.world.soundJump.playbackRate = 0.4;
            this.world.soundJump.volume = 0.02;
            this.playSound(this.world.soundJump);
        }
    }

    /**
     * Controls character animations based on states.
     */
    characterAnimations() {
        if (this.isDead()) {
            this.animationDying();
        } else if (this.isHurt()) {
            this.animationHurt();
        } else if (this.isAboveGround()) {
            this.animationJump();
        } else {
            this.handleGroundAnimations();
        }
    }

    /**
     * Animates character while walking.
     */
    animationWalk() {
        this.playAnimation(this.IMAGES_WALKING);
        this.stopSound(this.world.soundSnoring);
        this.world.soundWalk.playbackRate = 1;
        this.world.soundWalk.volume = 0.3;
        this.idleTime = 0;
    }

    /**
     * Animates character while jumping.
     */
    animationJump() {
        this.playAnimation(this.IMAGES_JUMPING);
        this.idleTime = 0;
    }

    /**
     * Animates character when hurt.
     */
    animationHurt() {
        this.playAnimation(this.IMAGES_HURT);
        this.stopSound(this.world.soundSnoring);
        this.playHurtSoundOnce();
        this.idleTime = 0;
    }

    /**
     * Plays hurt sound only once per instance of being hurt.
     */
    playHurtSoundOnce() {
        if (!this.soundHurtPlayed && this.world.soundHurt.paused) {
            this.world.soundHurt.playbackRate = 1;
            this.world.soundHurt.volume = 0.02;
            this.playSound(this.world.soundHurt);
            this.soundHurtPlayed = true;
        }
    }

    /**
     * Animates character when idle or sleeping.
     */
    animationIdle() {
        this.playAnimation(this.IMAGES_STANDING);
        this.idleTime += 100;
        if (this.idleTime >= 8000) {
            this.playAnimation(this.IMAGES_SLEEPING);
            this.world.soundSnoring.playbackRate = 1;
            this.world.soundSnoring.volume = 0.08;
            this.playSound(this.world.soundSnoring);
            this.soundSnoring = true;
        }

    }

    /**
     * Animates character when dying.
     */
    animationDying() {
        this.playAnimation(this.IMAGES_DYING);
        this.characterIsDead = true;
    }

    /**
     * Determines correct animation based on movement state.
     */
    handleGroundAnimations() {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.animationWalk();
        } else {
            this.animationIdle();
        }
        this.soundHurtPlayed = false;
    }

}