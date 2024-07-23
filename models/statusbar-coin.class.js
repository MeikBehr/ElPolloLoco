class StatusbarCoin extends Statusbar {

    IMAGES = [
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        './assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png',
    ]

    percentage = 100;

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.y = 50;
        this.setPercentage(this.percentage);
        
    }


    setPercentage(percentage) {
        this.percentage = percentage;   // => 0 ... 5
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