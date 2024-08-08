class Cloud extends MovableObject {

    img;

    constructor (x) {
        super();
        this.loadImage('./assets/img/5_background/layers/4_clouds/1.png');
        this.x = x;
        this.y = 10;
        this.speed = 0.15;
        this.width = 500;
        this.height = 250;

        this.animate();
    }

    animate() {
        setInterval( () => {
            this.x -= this.speed;
        }, 1000 / 60);
    }

}



