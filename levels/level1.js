let level1;

/**
 * Initializes level with enemies, obstacles, background, and items.
 */
function initLevel() {
    level1 = new Level(
        initSmallChickens(),
        initChickens(),
        initEndboss(),
        initClouds(),
        initBackground(),
        initCoins(),
        initBottles()
    );
}

/**
 * Returns an array of small chicken objects.
 * @returns {Array<ChickenSmall>}
 */
function initSmallChickens() {
    return [
        new ChickenSmall(500),
        new ChickenSmall(1000),
        new ChickenSmall(1750),
        new ChickenSmall(2650),
        new ChickenSmall(3500)
    ];
}

/**
 * Returns an array of chicken objects.
 * @returns {Array<Chicken>}
 */
function initChickens() {
    return [
        new Chicken(400),
        new Chicken(900),
        new Chicken(1500),
        new Chicken(2200),
        new Chicken(2600),
        new Chicken(2900)
    ];
}

/**
 * Returns an array with the endboss object.
 * @returns {Array<Endboss>}
 */
function initEndboss() {
    return [
        new Endboss(3500)
    ];
}

/**
 * Returns an array of cloud objects.
 * @returns {Array<Cloud>}
 */
function initClouds() {
    return [
        new Cloud(300),
        new Cloud(1300),
        new Cloud(2300),
        new Cloud(3300)
    ];
}

/**
 * Returns an array of background objects.
 * @returns {Array<BackgroundObject>}
 */
function initBackground() {
    const positions = [-719, 0, 719, 2 * 719, 3 * 719, 4 * 719, 5 * 719, 6 * 719];
    const layers = [
        './assets/img/5_background/layers/air.png',
        './assets/img/5_background/layers/3_third_layer/1.png',
        './assets/img/5_background/layers/2_second_layer/1.png',
        './assets/img/5_background/layers/1_first_layer/1.png',
        './assets/img/5_background/layers/3_third_layer/2.png',
        './assets/img/5_background/layers/2_second_layer/2.png',
        './assets/img/5_background/layers/1_first_layer/2.png'
    ];
    return positions.flatMap(position => layers.map(layer => new BackgroundObject(layer, position, 0)));
}

/**
 * Returns an array of coin objects.
 * @returns {Array<Coin>}
 */
function initCoins() {
    return [
        new Coin(700, 265),
        new Coin(1450, 320),
        new Coin(1900, 215),
        new Coin(2600, 150),
        new Coin(3000, 265)
    ];
}

/**
 * Returns an array of bottle objects.
 * @returns {Array<Bottle>}
 */
function initBottles() {
    return [
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
        new Bottle(3490, 345)
    ];
}
