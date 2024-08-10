let level1;

// dieser Aufruf erst dann, wenn START gedrückt wurde, sonst laufen die Gegner sofort los!
// initLevel();

function initLevel() {
    level1 = new Level(

        [
            new ChickenSmall(400),
            new ChickenSmall(1000),
            new ChickenSmall(1750),
        ],

        [
            new Chicken(300),
            new Chicken(800),
            new Chicken(1500),
            new Chicken(2200),

        ],

        [
            new Endboss(3100),
        ],

        [
            new Cloud(300),
            new Cloud(1300),
            new Cloud(2300),
            new Cloud(3300),
        ],

        [

            new BackgroundObject('./assets/img/5_background/layers/air.png', -719 ,0),
            new BackgroundObject('./assets/img/5_background/layers/3_third_layer/1.png', -719 ,0),
            new BackgroundObject('./assets/img/5_background/layers/2_second_layer/1.png', -719 ,0),
            new BackgroundObject('./assets/img/5_background/layers/1_first_layer/1.png', -719 ,0),
            new BackgroundObject('./assets/img/5_background/layers/air.png', 0 ,0),
            new BackgroundObject('./assets/img/5_background/layers/3_third_layer/2.png', 0 ,0),
            new BackgroundObject('./assets/img/5_background/layers/2_second_layer/2.png', 0 ,0),
            new BackgroundObject('./assets/img/5_background/layers/1_first_layer/2.png', 0 ,0),

            new BackgroundObject('./assets/img/5_background/layers/air.png', 1*719 ,0),
            new BackgroundObject('./assets/img/5_background/layers/3_third_layer/1.png', 1*719 ,0),
            new BackgroundObject('./assets/img/5_background/layers/2_second_layer/1.png', 1*719 ,0),
            new BackgroundObject('./assets/img/5_background/layers/1_first_layer/1.png', 1*719 ,0),

            new BackgroundObject('./assets/img/5_background/layers/air.png', 2*719 ,0),
            new BackgroundObject('./assets/img/5_background/layers/3_third_layer/2.png', 2*719 ,0),
            new BackgroundObject('./assets/img/5_background/layers/2_second_layer/2.png', 2*719 ,0),
            new BackgroundObject('./assets/img/5_background/layers/1_first_layer/2.png', 2*719 ,0),

            new BackgroundObject('./assets/img/5_background/layers/air.png', 3*719 ,0),
            new BackgroundObject('./assets/img/5_background/layers/3_third_layer/1.png', 3*719 ,0),
            new BackgroundObject('./assets/img/5_background/layers/2_second_layer/1.png', 3*719 ,0),
            new BackgroundObject('./assets/img/5_background/layers/1_first_layer/1.png', 3*719 ,0),

            new BackgroundObject('./assets/img/5_background/layers/air.png', 4*719 ,0),
            new BackgroundObject('./assets/img/5_background/layers/3_third_layer/2.png', 4*719 ,0),
            new BackgroundObject('./assets/img/5_background/layers/2_second_layer/2.png', 4*719 ,0),
            new BackgroundObject('./assets/img/5_background/layers/1_first_layer/2.png', 4*719 ,0),

            new BackgroundObject('./assets/img/5_background/layers/air.png', 5*719 ,0),
            new BackgroundObject('./assets/img/5_background/layers/3_third_layer/1.png', 5*719 ,0),
            new BackgroundObject('./assets/img/5_background/layers/2_second_layer/1.png', 5*719 ,0),
            new BackgroundObject('./assets/img/5_background/layers/1_first_layer/1.png', 5*719 ,0),

            new BackgroundObject('./assets/img/5_background/layers/air.png', 6*719 ,0),
            new BackgroundObject('./assets/img/5_background/layers/3_third_layer/2.png', 6*719 ,0),
            new BackgroundObject('./assets/img/5_background/layers/2_second_layer/2.png', 6*719 ,0),
            new BackgroundObject('./assets/img/5_background/layers/1_first_layer/2.png', 6*719 ,0),

        ],

        [
            new Coin(500, 265),
            new Coin(950, 320),
            new Coin(1200, 215),
            new Coin(1600, 215),
            new Coin(2000, 115),
        ],

        [
            new Bottle(250, 150),
            new Bottle(400, 256),
            new Bottle(550, 150),
            new Bottle(700, 345),
            new Bottle(1250, 345),
            new Bottle(1800, 256),
            new Bottle(2000, 345),
            new Bottle(2200, 150),
            new Bottle(2400, 345),
        ],


    );
};

