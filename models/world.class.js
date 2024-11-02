class World extends WorldChecks {
    
    character = new Character();
    ctx;
    canvas;
    keyboard;
    level = level1;
    stopGame = false;
    arrayOfEnemies = [
        this.level.chickenSmall,
        this.level.chicken,
    ];
    arrayOfItems = [
        this.level.coins,
        this.level.bottles,
    ];
    endbossSightable = false;
    coinsCounter = 0;
    cameraX = 0;
    throwableObjects = [];
    statusbarHealth = new StatusbarHealth();
    statusbarCoin = new StatusbarCoin();
    statusbarBottle = new StatusbarBottle();
    statusbarEndboss = new StatusbarEndboss();
    isMuted = false;
    backgroundSound = new Audio('./assets/audio/background.mp3');
    backgroundSoundVolume = 0.01;
    soundWalk = new Audio('./assets/audio/walking.mp3');
    soundJump = new Audio('./assets/audio/jump.mp3');
    soundHurt = new Audio('./assets/audio/hurt.mp3');
    soundCoin = new Audio('./assets/audio/coin.mp3');
    soundBottle = new Audio('./assets/audio/bottle_collect.mp3');
    soundBottleSplash = new Audio('./assets/audio/bottle_splash.mp3');
    soundBottleThrow = new Audio('./assets/audio/bottle_throw.mp3');
    soundHitChicken = new Audio('./assets/audio/hit_chicken.mp3');
    soundSnoring = new Audio('./assets/audio/snoring.mp3');

    /**
     * Creates an instance of the World.
     * @param {HTMLCanvasElement} canvas - The canvas element to draw on.
     * @param {Keyboard} keyboard - The keyboard handler for input.
     */
    constructor(canvas, keyboard) {
        super();
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.backgroundSound.volume = this.backgroundSoundVolume;
        this.run();
    }

    /**
     * Sets up the world, linking the character and endboss to the world instance.
     * Also manages the background sound based on the mute state and pause status.
     */
    setWorld() {
        this.character.world = this;
        this.level.endboss[0].world = this;
        if (!this.isMuted && !isPaused) {
            this.backgroundSound.volume = this.backgroundSoundVolume;
            this.playSound(this.backgroundSound);
        }
    }

    /**
     * Main loop that starts various game processes when the game is running.
     */
    run() {
        if (!isPaused) {
            this.startCollisionCheck();
            this.startCharacterAndEndbossCheck();
            this.startObjectUpdate();
            this.startObjectSpawnCheck();
        }
    }

    /**
     * Starts a periodic check to determine if the character or the endboss is dead.
     */
    startCharacterAndEndbossCheck() {
        setInterval(() => {
            this.checkIfCharacterOrEndbossIsDead();
        }, 20);
    }

    /**
     * Updates the state of thrown objects, chickens, and clouds periodically.
     */
    startObjectUpdate() {
        setInterval(() => {
            this.updateThrownObjects();
        }, 200);
    }

    /**
     * Updates the state of thrown objects and plays background sounds if not muted.
     */
    updateThrownObjects() {
        this.checkThrownObjects();
        this.deleteThrowingObjects();
        this.chickenLoop(this.level.chicken);
        this.chickenLoop(this.level.chickenSmall);
        this.cloudLoop(this.level.clouds);

        if (!this.isMuted) {
            this.backgroundSound.volume = this.backgroundSoundVolume;
            this.playSound(this.backgroundSound);
        }
    }

    /**
     * Deletes dead enemies from the array of enemies.
     * Iterates through each enemy array and removes enemies marked as dead.
     */
    deleteDeadEnemies() {
        this.arrayOfEnemies.forEach((enemyArray) => {
            for (let i = enemyArray.length - 1; i >= 0; i--) {
                if (enemyArray[i].enemyIsDead) {
                    enemyArray.splice(i, 1);
                }
            }
        });
    }

    /**
     * Determines if the character is jumping on the specified enemy.
     * @param {Object} enemy - The enemy object to check against.
     * @returns {boolean} - True if the character is jumping on the enemy, false otherwise.
     */
    isCharacterJumpingOnEnemy(enemy) {
        return this.character.isColliding(enemy) && 
            this.character.isAboveGround() && 
            !enemy.enemyIsDead && 
            this.character.speedY < 0;
    }

    /**
     * Handles the collision with the enemy, marking it as dead and updating counts.
     * @param {Object} enemy - The enemy object being collided with.
     */
    handleEnemyCollision(enemy) {
        this.character.jump();
        this.character.characterJumpSound();
        enemy.enemyIsDead = true;
        enemy.y += (enemy instanceof Chicken) ? 20 : 5;
        (enemy instanceof Chicken) ? this.character.killCountChicken++ : 
            this.character.killCountSmallChicken++;
        this.soundHitChicken.playbackRate = 1;
        this.soundHitChicken.volume = 0.03;
        this.character.playSound(this.soundHitChicken);
    }

    /**
     * Collects an item and calls the appropriate collecting method based on item type.
     * @param {Object} item - The item that was collected.
     * @param {number} index - The index of the item in the array.
     * @param {Array} arrayOfItems - The array of collectible items.
     */
    collectItem(item, index, arrayOfItems) {
        if (item instanceof Coin) {
            this.collectingCoins(index, arrayOfItems);
        } else {
            this.collectingBottles(index, arrayOfItems);
        }
    }

    /**
     * Increases the character's item count by 20, up to a maximum of 100.
     */
    increaseCharacterItem() {
        if (this.character.item < 100) {
            this.character.item += 20;
        }
    }

    /**
     * Collects coins when the character collides with a coin item.
     * Increases the character's coin count by 20 (up to a maximum of 100),
     * removes the coin from the array, updates the coin status bar,
     * and plays the coin collection sound.
     * 
     * @param {number} index - The index of the coin in the array of items.
     * @param {Array} arrayOfItems - The array containing coin items.
     */
    collectingCoins(index, arrayOfItems) {
        if (this.character.coins < 100) {
            this.character.coins += 20;
            arrayOfItems.splice(index, 1);
            this.statusbarCoin.setPercentage(this.character.coins);
            this.soundCoin.playbackRate = 1;
            this.soundCoin.volume = 0.05;
            this.character.playSound(this.soundCoin);
        };
    }

    /**
     * Collects bottles when the character collides with a bottle item.
     * Increases the character's bottle count by 20 (up to a maximum of 100),
     * removes the bottle from the array, updates the bottle status bar,
     * and plays the bottle collection sound.
     * 
     * @param {number} index - The index of the bottle in the array of items.
     * @param {Array} arrayOfItems - The array containing bottle items.
     */
    collectingBottles(index, arrayOfItems) {
        if (this.character.bottles < 100) {
            this.character.bottles += 20;
            arrayOfItems.splice(index, 1);
            this.statusbarBottle.setPercentage(this.character.bottles);
            this.soundBottle.playbackRate = 1;
            this.soundBottle.volume = 0.03;
            this.character.playSound(this.soundBottle);
        };
    }

    /**
     * Removes all throwable objects that have fallen below a certain threshold.
     * Objects with a y-coordinate greater than 1000 will be removed from the array.
     */
    deleteThrowingObjects() {
        this.throwableObjects = this.throwableObjects.filter((object) => {
            return object.y <= 1000;
        });
    }

    /**
     * Displays the current coin count of the character on the canvas.
     * The coin count is shown in yellow text.
     */
    showCoins() {
        this.ctx.font = "24px Zabars";
        this.ctx.fillStyle = '#D7DF01';
        this.ctx.fillText(': ' + this.character.coins + ' %', 225, 97);
    }

    /**
     * Displays the current bottle count of the character on the canvas.
     * The bottle count is shown in yellow text.
     */
    showBottles() {
        this.ctx.font = "24px Zabars";
        this.ctx.fillStyle = '#D7DF01';
        this.ctx.fillText(': ' + this.character.bottles + ' %', 225, 142);
    }

    /**
     * Displays the current health (energy) of the character on the canvas.
     * The health is shown in yellow text.
     */
    showHealth() {
        this.ctx.font = "24px Zabars";
        this.ctx.fillStyle = '#D7DF01';
        this.ctx.fillText(': ' + this.character.energy + ' %', 225, 52);
    }

    /**
     * Adds an array of objects to the map by calling addToMap for each object.
     * 
     * @param {Array} objects - An array of objects to be added to the map.
     */
    addObjectsToMap(objects) {
        objects.forEach((object) => {
            this.addToMap(object);
        });
    }

    /**
     * Draws a single object on the canvas.
     * Flips the image if the object is facing the other direction.
     * 
     * @param {Object} mo - The object to be drawn on the canvas.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Flips the image of the object horizontally by scaling.
     * 
     * @param {Object} mo - The object to be flipped.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the canvas context to its original state after flipping.
     * 
     * @param {Object} mo - The object whose position needs to be restored.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /**
     * Resets the position of chicken objects that have moved off-screen.
     * If a chicken's x-coordinate is less than or equal to -150, it is repositioned to 4000.
     * 
     * @param {Array} chicken - The array of chicken objects to be checked.
     */
    chickenLoop(chicken) {
        chicken.forEach((chick) => {
            if (chick.x <= -150) {
                chick.x = 4000;
            }
        })
    }

    /**
     * Resets the position of cloud objects that have moved off-screen.
     * If a cloud's x-coordinate is less than or equal to -150, it is repositioned to 4000.
     */
    cloudLoop() {
        this.level.clouds.forEach((cloud) => {
            if (cloud.x <= -150) {
                cloud.x = 4000;
            }
        })
    }

    /**
     * Clears the entire canvas to prepare for the next frame.
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Clears all intervals that have been set using setInterval.
     * This is useful for stopping ongoing game loops when the game ends.
     */
    clearAllIntervals() {
        for (let i = 1; i < 9999; i++) window.clearInterval(i);
    }

    /**
     * Plays a given sound if the game is not muted.
     * Adds the sound to the active sounds list.
     * 
     * @param {HTMLAudioElement} sound - The sound to be played.
     */
    playSound(sound) {
        if (!isMuted) {
            sound.play();
            activeSounds.push(sound);
        }
    }
    
    /**
     * Stops and resets a given sound.
     * 
     * @param {HTMLAudioElement} sound - The sound to be stopped.
     */
    stopSound(sound) {
        sound.pause();
        sound.currentTime = 0;
        activeSounds = activeSounds.filter(s => s !== sound);
    }

    /**
     * Handles game over logic by pausing the background sound and clearing all intervals.
     */
    gameOverTest() {
        setTimeout(() => {
            this.backgroundSound.pause();
            this.clearAllIntervals();
        }, 2000);
    }


    /**
     * Creates a new throwable bottle object and adds it to the list of throwable objects.
     * Updates the character's idle time and plays the throw sound.
     * Decreases the number of bottles the character has and starts the throw cooldown.
     */
    throwBottle() {
        const bottle = new BottleThrowable(this.character.x + 20, this.character.y + 100, this.character.otherDirection);
        bottle.isThrown = true;
        this.throwableObjects.push(bottle);
        this.character.idleTime = 0;
        this.playThrowSound(bottle);
        this.updateCharacterBottles();
        this.startThrowCooldown();
    }

    /**
     * Plays the sound of throwing a bottle if it is not already playing.
     * Sets playback rate and volume before playing the sound.
     * 
     * @param {BottleThrowable} bottle - The bottle object being thrown, used for sound playback.
     */
    playThrowSound(bottle) {
        if (this.soundBottleThrow.paused) {
            this.soundBottleThrow.playbackRate = 1;
            this.soundBottleThrow.volume = 0.1;
            bottle.playSound(this.soundBottleThrow);
        }
    }

    /**
     * Updates the character's bottle count and the corresponding status bar.
     * Decreases the number of bottles by 20.
     */
    updateCharacterBottles() {
        this.character.bottles -= 20;
        this.statusbarBottle.setPercentage(this.character.bottles);
    }

    /**
     * Initiates a cooldown period for throwing bottles to prevent spamming.
     * Sets the throwCooldown flag to true and resets it after 1000 milliseconds.
     */
    startThrowCooldown() {
        this.throwCooldown = true;
        setTimeout(() => {
            this.throwCooldown = false;
        }, 1000);
    }

    /**
     * Clears the canvas and renders all game objects, including background elements, 
     * characters, throwable objects, and status bars. Continuously calls itself 
     * to create an animation loop.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.cameraX, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.renderChickens();
        this.addObjectsToMap(this.level.endboss);
        this.addToMap(this.character);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.cameraX, 0);
        this.renderStatusBars();
        if (this.level.endboss[0].hadFirstContact) {
            this.addToMap(this.statusbarEndboss);
        }
        this.showCoins();
        this.showBottles();
        this.showHealth();
        requestAnimationFrame(() => this.draw()); // Request the next animation frame
    }

    /**
     * Renders chickens (both small and regular) onto the canvas.
     */
    renderChickens() {
        this.addObjectsToMap(this.level.chickenSmall);
        this.addObjectsToMap(this.level.chicken);
    }

    /**
     * Renders all status bars (health, coins, bottles) onto the canvas.
     */
    renderStatusBars() {
        this.addToMap(this.statusbarHealth);
        this.addToMap(this.statusbarCoin);
        this.addToMap(this.statusbarBottle);
    }

}