class Statusbar extends DrawableObjects {

    percentage = 100;
    otherDirection = false;
    width = 200;
    height = 50;
    x = 20;


    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex(this.percentage)];
        this.img = this.imageCache[path];
    }


    resolveImageIndex(percentage) {
        return percentage === 100 ? 5 :
           percentage >= 80 ? 4 :
           percentage >= 60 ? 3 :
           percentage >= 40 ? 2 :
           percentage >= 20 ? 1 : 0;
    }

}