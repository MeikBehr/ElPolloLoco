class Cloud extends MovableObject {

    y = 10;
    width = 500;
    height = 250;
    img;

    constructor (x) {
        super();
        this.loadImage('./assets/img/5_background/layers/4_clouds/1.png');
        this.x = x;

        this.animate();
    }

    animate() {
        setInterval( () => {
            this.x -= 0.15;
            // this.x > -350 ? (this.x -= 1.15) : (this.x = 1200);
        }, 1000 / 60);
    }

}



