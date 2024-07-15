class Cloud extends MovableObject {

    y = 10;
    width = 500;
    height = 250;
    img;

    constructor (imagePath) {
        super();
        this.loadImage('./assets/img/5_background/layers/4_clouds/1.png');
        this.x = 50 + Math.random() * 300;

    }

}



