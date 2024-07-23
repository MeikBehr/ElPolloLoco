class StatusbarHealth extends Statusbar {

    IMAGES = [
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png',
    ]

    percentage = 100;

    constructor() {
        super();
        this.loadImages(this.IMAGES);

        this.img = new Image();             // WICHTIG! Sonst ist da nur ein String mit dem Pfad!!!
        this.img.src = this.IMAGES[0];

        this.y = 10;

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