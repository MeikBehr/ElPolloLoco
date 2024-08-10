class BottleThrowable extends ThrowableObject {

    height = 80;
    width = 80;
    isThrown = false;
    otherDirection = false;
    
    
    offset = {
        top: 5,
        bottom: 10,
        left: 13,
        right: 20,
      };


    IMAGES_BOTTLE_ROTATION = [
        './assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        './assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];

    IMAGES_BOTTLE_SPLASH = [
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        './assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];


    constructor(x, y, otherDirection) {
        super();
        this.loadImages(this.IMAGES_BOTTLE_ROTATION);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;

        this.throw(this.x, this.y, this.otherDirection);
        this.animate();
    }

    animate() {
        let intervalId = setInterval(() => {
            if (this.isAboveGround() && !this.objectIsColiding) {
                this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
            } else {
                this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
                clearInterval(intervalId);
            }
        }, 100);    // hier wird die Rotation der Flasche gesetzt



    }

}