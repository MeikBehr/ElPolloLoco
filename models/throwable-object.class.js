class ThrowableObject extends MovableObject {

    speedX = 20;
    speedY = 20;


    constructor() {
        super();
        loadImage('./assets/img/6_salsa_bottle/salsa_bottle.png');
        this.x = 0;
        thix.y = 0;
        this.throw(this.x, this.y, direction);
    }


    offset = {
        top: 3,
        bottom: 3,
        left: 13,
        right: 13,
    };



    throw(x, y, direction) {
        x = x;
        y = y;
        this.height = 60;
        this.width = 50;
        this.speedY = 30;
        this.applyGravity();
        this.moveThrowableObject(direction);
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

}