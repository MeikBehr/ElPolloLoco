class ThrowableObject extends MovableObject {

    speedX = 8;
    speedY = 20;

    constructor(x, y) {
        super();
        this.loadImage('./assets/img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 80;
        this.width = 80;
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
        if (!isPaused) {
          setInterval(() => {
              if (otherDirection) {
                if (!isPaused) {
                  this.x -=this.speedX;
                }
              } else {
                if (!isPaused) {
                  this.x += this.speedX;
                }
              }
          }, 25)
        }

    }


}