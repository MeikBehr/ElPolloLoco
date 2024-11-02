/** 
 * Represents a game level, containing various entities and objects.
 */
class Level {
    /** @type {Array} Collection of small chicken enemies in the level */
    chickenSmall;

    /** @type {Array} Collection of normal chicken enemies in the level */
    chicken;

    /** @type {Endboss} The end boss of the level */
    endboss;

    /** @type {Array} Collection of cloud objects in the level */
    clouds;

    /** @type {Array} Collection of background objects in the level */
    backgroundObjects;

    /** @type {Array} Collection of coin objects in the level */
    coins;

    /** @type {Array} Collection of bottle objects in the level */
    bottles;

    /** @type {number} The position representing the end of the level */
    EndOfLevel = 3500;

    /**
     * Creates an instance of Level.
     * @param {Array} chickenSmall - Small chicken enemies.
     * @param {Array} chicken - Normal chicken enemies.
     * @param {Endboss} endboss - The end boss of the level.
     * @param {Array} clouds - Cloud objects in the level.
     * @param {Array} backgroundObjects - Background objects in the level.
     * @param {Array} coins - Coin objects in the level.
     * @param {Array} bottles - Bottle objects in the level.
     */
    constructor(chickenSmall, chicken, endboss, clouds, backgroundObjects, coins, bottles) {
        this.chickenSmall = chickenSmall;
        this.chicken = chicken;
        this.endboss = endboss;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}
