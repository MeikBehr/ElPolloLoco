class Endboss extends MovableObject {

    soundVolume = 0.1;
    hadFirstContact = false;
    endbossIsDead = false;


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

    IMAGES_ATTACK = [
        './assets/img/4_enemie_boss_chicken/3_attack/G13.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G14.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G15.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G16.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G17.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G18.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G19.png',
        './assets/img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    IMAGES_HURT = [
        './assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        './assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        './assets/img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    IMAGES_DYING = [
        './assets/img/4_enemie_boss_chicken/5_dead/G24.png',
        './assets/img/4_enemie_boss_chicken/5_dead/G25.png',
        './assets/img/4_enemie_boss_chicken/5_dead/G26.png',
    ];


    constructor(x) {
        super();
        this.loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DYING);

        this.height = 450;
        this.width = 350;
        this.x = x;
        this.y = 10;
        this.speed = 1.5 + Math.random() * 0.5;

        this.animate();
        

    };



    endbossHit(endboss) {
        endboss.energy -= 20;    
        if (endboss.energy < 0) {
            endboss.energy = 0;
        }
        else {
            endboss.lastHitEndBoss = new Date().getTime();
        }
    }


    

    animate() {
        this.playAnimation(this.IMAGES_ALERT);
        setInterval(() => {
            this.characterAnimatesEndboss();
            this.endbossAnimations();
        }, 170);

        setInterval(() => {
            if (this.hadFirstContact && this.i > 21 && !this.isDead() && !this.isHurtEndboss()) {
                this.x -= this.speed;
            }        
        }, 1000 / 60);
    }



    endbossAnimations() {
        if (this.isDead()) {
            this.animationDying();
        }
        else if (this.isHurtEndboss()) {
            this.animationHurt();
        } 

        else if (this.i < 10) {
            this.animationAlert();     
        }
        else if (this.i < 20) {
            this.animationAttack();
        }
        else {        
            this.animationWalk();
            console.log('Walking!');
            
        }
        this.i++;    
        this.characterAnimatesEndboss();
    }


    animationHurt() {
        this.playAnimation(this.IMAGES_HURT);
        if (this.world.soundEndboss.paused) {
            this.world.soundEndboss.playbackRate = 1;
            this.world.soundEndboss.volume = 0.05;
            this.playSound(this.world.soundEndboss);
        }
    }


    animationDying() {
        this.playAnimation(this.IMAGES_DYING);
        this.endbossIsDead = true;
    }

    animationAlert() {
        this.playAnimation(this.IMAGES_ALERT); 
    }

    animationAttack() {
        this.playAnimation(this.IMAGES_ATTACK);
    }

    animationWalk() {
        this.playAnimation(this.IMAGES_WALKING);
    }


    characterAnimatesEndboss() {
        if (this.world.character.x > 2600 && !this.hadFirstContact) {
            this.i = 0;
            this.hadFirstContact = true;
            console.log('Endboss called!');
        }
    }





}

