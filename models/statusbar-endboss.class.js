class StatusbarEndboss extends Statusbar {

    IMAGES = [
        './assets/img/7_statusbars/2_statusbar_endboss/green/green0.png',
        './assets/img/7_statusbars/2_statusbar_endboss/green/green20.png',
        './assets/img/7_statusbars/2_statusbar_endboss/green/green40.png',
        './assets/img/7_statusbars/2_statusbar_endboss/green/green60.png',
        './assets/img/7_statusbars/2_statusbar_endboss/green/green80.png',
        './assets/img/7_statusbars/2_statusbar_endboss/green/green100.png',

    ]

    percentage = 100;

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.y = 10;
        this.setPercentage(this.percentage);
        
    }


}