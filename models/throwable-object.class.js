class ThrowableObject extends MovableObject {

    speedX = 8; // 10
    speedY = 20; //25

    constructor(x, y) {
        super();
        this.loadImage('./assets/img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 80;
        this.width = 80;
        // this.throw(this.x, this.y);
        // this.animate();
    }


    offset = {
        top: 5,
        bottom: 5,
        left: 13,
        right: 13,
    };


    throw(x, y, otherDirection) {
        x = x;
        y = y;
        this.applyGravity();
        setInterval(() => {
            if (otherDirection) {
              this.x -=this.speedX;
            } else {
              this.x += this.speedX;
            }
        }, 25)

        setInterval(() => {
          this.animate();
        }, 100);
    }


    moveThrowableObject(direction) {
        setInterval(() => {
          if (direction == "right") {
            this.x += 10;
          }
          if (direction == "left") {
            this.x -= 10;
          }
        }, 25);
    }


    animate() {
      // this.playAnimation(this.IMAGES_BOTTLE_ROTATION);

      // if (this.isAboveGround()) {
      //     this.playAnimation(this.IMAGES_BOTTLE_ROTATION);  
      // }
      // else {
      //     this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
      // }

  }

}