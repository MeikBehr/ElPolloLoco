let level1;


function initLevel() {
    level1 = new Level(

        [
            new ChickenSmall(500),
            new ChickenSmall(1000),
            new ChickenSmall(1750),
            new ChickenSmall(2650),
            new ChickenSmall(3500),
        ],

        [
            new Chicken(400),
            new Chicken(900),
            new Chicken(1500),
            new Chicken(2200),
            new Chicken(2600),
            new Chicken(2900),

        ],

        [
            new Endboss(3500),
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
            new Coin(700, 265),
            new Coin(1450, 320),
            new Coin(1900, 215),
            new Coin(2600, 150),
            new Coin(3000, 265),
        ],

        [
            new Bottle(400, 256),
            new Bottle(550, 150),
            new Bottle(700, 345),
            new Bottle(1250, 345),
            new Bottle(1800, 256),
            new Bottle(2000, 345),
            new Bottle(2200, 150),
            new Bottle(2400, 345),
            new Bottle(2900, 256),
            new Bottle(3200, 175),
            new Bottle(3490, 345),
        ],


    );
};

