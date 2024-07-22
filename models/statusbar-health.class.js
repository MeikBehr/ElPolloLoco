class StatusbarHealth extends Statusbar {

    status = 100;


    IMAGES_GREEN = [
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        './assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png',
    ]

    constructor() {
        super();
        this.loadImages(this.IMAGES_GREEN);

        this.img = new Image();             // WICHTIG! Sonst ist da nur ein String mit dem Pfad!!!
        this.img.src = this.IMAGES_GREEN[0];

        this.y = 10;
        this.width = 200;
        this.height = 50;
        
    }

}