class World {


    /** @type {Character} */
    character = new Character();
    
    /** @type {CanvasRenderingContext2D} */
    ctx;
    
    /** @type {HTMLCanvasElement} */
    canvas;
    
    /** @type {Keyboard} */
    keyboard;
    
    /** @type {Level} */
    level = level1;
    
    /** @type {boolean} */
    stopGame = false;

    /** @type {Enemy[][]} */
    arrayOfEnemies = [
        this.level.chickenSmall,
        this.level.chicken,
    ];

    /** @type {Item[][]} */
    arrayOfItems = [
        this.level.coins,
        this.level.bottles,
    ];

    /** @type {boolean} */
    endbossSightable = false;
    
    /** @type {number} */
    coinsCounter = 0;
    
    /** @type {number} */
    cameraX = 0;
    
    /** @type {ThrowableObject[]} */
    throwableObjects = [];
    
    /** @type {StatusbarHealth} */
    statusbarHealth = new StatusbarHealth();
    
    /** @type {StatusbarCoin} */
    statusbarCoin = new StatusbarCoin();
    
    /** @type {StatusbarBottle} */
    statusbarBottle = new StatusbarBottle();
    
    /** @type {StatusbarEndboss} */
    statusbarEndboss = new StatusbarEndboss();
    
    /** @type {boolean} */
    isMuted = false;
    
    /** @type {HTMLAudioElement} */
    backgroundSound = new Audio('./assets/audio/background.mp3');
    
    /** @type {number} */
    backgroundSoundVolume = 0.01;

    /** @type {HTMLAudioElement} */
    soundWalk = new Audio('./assets/audio/walking.mp3');
    
    /** @type {HTMLAudioElement} */
    soundJump = new Audio('./assets/audio/jump.mp3');
    
    /** @type {HTMLAudioElement} */
    soundHurt = new Audio('./assets/audio/hurt.mp3');
    
    /** @type {HTMLAudioElement} */
    soundCoin = new Audio('./assets/audio/coin.mp3');
    
    /** @type {HTMLAudioElement} */
    soundBottle = new Audio('./assets/audio/bottle_collect.mp3');
    
    /** @type {HTMLAudioElement} */
    soundBottleSplash = new Audio('./assets/audio/bottle_splash.mp3');
    
    /** @type {HTMLAudioElement} */
    soundBottleThrow = new Audio('./assets/audio/bottle_throw.mp3');
    
    /** @type {HTMLAudioElement} */
    soundHitChicken = new Audio('./assets/audio/hit_chicken.mp3');
    
    /** @type {HTMLAudioElement} */
    soundSnoring = new Audio('./assets/audio/snoring.mp3');

    /**
     * Creates an instance of the World.
     * @param {HTMLCanvasElement} canvas - The canvas element to draw on.
     * @param {Keyboard} keyboard - The keyboard handler for input.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        // Initialize game elements
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
        // Link the world to the character and the endboss
        this.character.world = this;
        this.level.endboss[0].world = this;

        // Check mute state and pause status before playing background sound
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
     * Starts a periodic check for collisions between game objects.
     */
    startCollisionCheck() {
        setInterval(() => {
            this.checkCollisions();
            this.checkCollisionsOfThrowObjects();
        }, 100);
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
     * Checks for the presence of bottles and enemies, and deletes dead enemies periodically.
     */
    startObjectSpawnCheck() {
        setInterval(() => {
            this.checkForBottles();
            this.checkForEnemies();
            this.deleteDeadEnemies();
        }, 5000);
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
            // Loop through the enemy array backwards to avoid index issues when splicing.
            for (let i = enemyArray.length - 1; i >= 0; i--) {
                if (enemyArray[i].enemyIsDead) {
                    enemyArray.splice(i, 1);
                }
            }
        });
    }

    
    /**
     * Checks if there are any bottles in the level. 
     * If not, a new Bottle is created at a random position and added to the level's bottles array.
     */
    checkForBottles() {
        if (this.level.bottles.length === 0) {
            const x = Math.random() * 1500; // Random x position
            const y = 120 + Math.random() * 200; // Random y position
            this.level.bottles.push(new Bottle(x, y));
        }
    }

    /**
     * Checks for the presence of enemies in the level. 
     * If there are no small chickens, a new ChickenSmall is created at a fixed position.
     * If there are no chickens, a new Chicken is created at a fixed position.
     */
    checkForEnemies() {
        if (this.level.chickenSmall.length === 0) {
            this.level.chickenSmall.push(new ChickenSmall(3800)); // Fixed position for small chicken
        }
        if (this.level.chicken.length === 0) {
            this.level.chicken.push(new Chicken(3800)); // Fixed position for chicken
        }
    }


    /**
     * Checks for collisions between the character and various game entities.
     * This includes checking if the character jumps on enemies,
     * collides with enemies, collides with the endboss, and collides with items.
     */
    checkCollisions() {
        this.checkCollisionsCharacterJumpOnEnemy(); // Check if character jumps on an enemy
        this.checkCollisionsCharacterVsEnemy();     // Check for character collision with enemies
        this.checkCollisionsCharacterVsEndboss();   // Check for character collision with the endboss
        this.checkCollisionsCharacterVSItems();      // Check for character collision with items
    }


    /**
     * Checks for collisions when the character jumps on enemies.
     * Marks enemies as dead and updates kill counts accordingly.
     */
    checkCollisionsCharacterJumpOnEnemy() {
        this.arrayOfEnemies.forEach(enemyArray => {
            enemyArray.forEach(enemy => {
                if (this.isCharacterJumpingOnEnemy(enemy)) {
                    this.handleEnemyCollision(enemy);
                }
            });
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
     * Checks for collisions between the character and enemies.
     * If a collision is detected, the character is hit by the enemy, 
     * and the health status bar is updated.
     */
    checkCollisionsCharacterVsEnemy() {
        this.arrayOfEnemies.forEach(arrayOfEnemies => {
            arrayOfEnemies.forEach(enemy => {
                if (this.character.isColliding(enemy) && !enemy.enemyIsDead && !this.character.isHurt()) {
                    this.character.hit(enemy);
                    this.statusbarHealth.setPercentage(this.character.energy);
                }
            });
        });
    }



    /**
     * Checks for collisions between the character and the endboss.
     * If a collision is detected, the character is hit by the endboss,
     * the endboss attacks, and the health status bar is updated.
     */
    checkCollisionsCharacterVsEndboss() {
        this.level.endboss.forEach((enemy) => {
            if (this.character.isColliding(enemy) && !enemy.enemyIsDead && !this.character.isHurt()) {
                this.character.hit(enemy);
                enemy.animationAttack();
                this.statusbarHealth.setPercentage(this.character.energy);
            }
        });
    }



    /**
     * Checks for collisions between the character and collectible items (coins and bottles).
     * If a collision is detected, the character collects the item and the corresponding collection method is called.
     * Additionally, the character's item count is increased by 20, up to a maximum of 100.
     */
    checkCollisionsCharacterVSItems() {
        this.arrayOfItems.forEach(arrayOfItems => {
            arrayOfItems.forEach((item, index) => {
                if (this.character.isColliding(item)) {
                    this.collectItem(item, index, arrayOfItems);
                    this.increaseCharacterItem();
                }
            });
        });
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
     * Checks for collisions of throwable objects (bottles) with enemies, the end boss, and the ground.
     */
    checkCollisionsOfThrowObjects() {
        this.throwableObjects.forEach((bottle, index) => {
            this.checkCollisionsBottleEnemie(bottle, index);
            this.checkCollisionsBottleEndboss(bottle, index);
            this.checkCollisionsBottleGround(bottle, index);
        });
    }


     /**
     * Checks for collisions between a bottle and the ground.
     * If the bottle is not above ground, it plays a splash sound and removes the bottle from the throwableObjects array after a short delay.
     * 
     * @param {Object} bottle - The bottle object to check for ground collision.
     * @param {number} index - The index of the bottle in the throwableObjects array.
     */
        checkCollisionsBottleGround(bottle, index) {
            if (!bottle.isAboveGround()) {
                this.soundBottleSplash.volume = 0.1;
                bottle.playSound(this.soundBottleSplash);
                setTimeout(() => {
                    this.throwableObjects.splice(index, 1);
                }, 1000 / 60);
            }
        }
    


     /**
     * Checks for collisions between a thrown bottle and the endboss.
     * If a collision is detected, it plays a splash sound, applies damage to the endboss,
     * updates the endboss's health status, and removes the bottle from the throwableObjects array after a short delay.
     * 
     * @param {Object} bottle - The bottle object to check for collisions with the endboss.
     * @param {number} index - The index of the bottle in the throwableObjects array.
     */
     checkCollisionsBottleEndboss(bottle, index) {
        const { endboss } = this.level;

        for (const boss of endboss) {
            if (bottle.isColliding(boss)) {
                bottle.objectIsColiding = true;
                this.soundBottleSplash.volume = 0.1;
                bottle.playSound(this.soundBottleSplash);
                boss.endbossHit(boss);
                this.statusbarEndboss.setPercentage(boss.energy);

                setTimeout(() => {
                    this.throwableObjects.splice(index, 1);
                }, 100);

                break; // Stop iterating after the first collision
            }
        }
    }


     /**
     * Checks for collisions between a thrown bottle and enemies.
     * If a collision is detected and the enemy is not dead, it plays a splash sound,
     * marks the bottle as colliding, sets the enemy as dead, 
     * and removes the bottle from the throwableObjects array after a short delay.
     * 
     * @param {Object} bottle - The bottle object to check for collisions with enemies.
     * @param {number} index - The index of the bottle in the throwableObjects array.
     */    
    checkCollisionsBottleEnemie(bottle, index) {
        this.arrayOfEnemies.forEach(array => {
            array.forEach(enemy => {
                if (bottle.isColliding(enemy) && !enemy.enemyIsDead) {
                    bottle.objectIsColiding = true;
                    this.soundBottleSplash.volume = 0.1;
                    bottle.playSound(this.soundBottleSplash);
                    enemy.enemyIsDead = true;
                    setTimeout(() => {
                        this.throwableObjects.splice(index, 1)
                    }, 250);
                };
            });
        });
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
     * Checks if the character or the endboss is dead.
     * If the character is dead, it triggers the game over sequence.
     * If the endboss is dead, it triggers the win sequence.
     * 
     * @returns {void}
     */
    checkIfCharacterOrEndbossIsDead() {
        if (this.character.characterIsDead && !isPaused) {
            this.gameOverTest();
            setTimeout(() => {
                this.stopGame = true;
                gameLost();
            }, 1000);
        } else if (this.level.endboss[0].endbossIsDead && !isPaused) {
            this.gameOverTest();
            setTimeout(() => {
                this.stopGame = true;
                gameWon();
            }, 1000);
        }
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
     * Checks if the character can throw a bottle based on cooldown and paused state.
     * If the 'D' key is pressed and the character has bottles, it calls the throwBottle method.
     */
    checkThrownObjects() {
        if (this.throwCooldown || isPaused) {
            return; // Exit if throwing is on cooldown or the game is paused
        }
        if (this.keyboard.D && this.character.bottles > 0) {
            this.throwBottle(); // Throw a bottle if conditions are met
        }
    }

    /**
     * Creates a new throwable bottle object and adds it to the list of throwable objects.
     * Updates the character's idle time and plays the throw sound.
     * Decreases the number of bottles the character has and starts the throw cooldown.
     */
    throwBottle() {
        const bottle = new BottleThrowable(this.character.x + 20, this.character.y + 100, this.character.otherDirection);
        bottle.isThrown = true;
        this.throwableObjects.push(bottle); // Add the thrown bottle to the array
        this.character.idleTime = 0; // Reset idle time to indicate action
        this.playThrowSound(bottle); // Play throw sound
        this.updateCharacterBottles(); // Update the character's bottle count
        this.startThrowCooldown(); // Start cooldown period to prevent immediate subsequent throws
    }

    /**
     * Plays the sound of throwing a bottle if it is not already playing.
     * Sets playback rate and volume before playing the sound.
     * 
     * @param {BottleThrowable} bottle - The bottle object being thrown, used for sound playback.
     */
    playThrowSound(bottle) {
        if (this.soundBottleThrow.paused) {
            this.soundBottleThrow.playbackRate = 1; // Set playback speed
            this.soundBottleThrow.volume = 0.1; // Set volume level
            bottle.playSound(this.soundBottleThrow); // Play the sound associated with throwing a bottle
        }
    }

    /**
     * Updates the character's bottle count and the corresponding status bar.
     * Decreases the number of bottles by 20.
     */
    updateCharacterBottles() {
        this.character.bottles -= 20; // Reduce bottle count
        this.statusbarBottle.setPercentage(this.character.bottles); // Update status bar display
    }

    /**
     * Initiates a cooldown period for throwing bottles to prevent spamming.
     * Sets the throwCooldown flag to true and resets it after 1000 milliseconds.
     */
    startThrowCooldown() {
        this.throwCooldown = true; // Set cooldown flag
        setTimeout(() => {
            this.throwCooldown = false; // Reset cooldown after the specified time
        }, 1000);
    }


    /**
     * Clears the canvas and renders all game objects, including background elements, 
     * characters, throwable objects, and status bars. Continuously calls itself 
     * to create an animation loop.
     */
    draw() {
        this.clearCanvas(); // Clear the canvas for redrawing
        this.translateCanvas(); // Adjust canvas position based on camera

        // Render level objects
        this.renderBackgroundObjects();
        this.renderClouds();
        this.renderCoins();
        this.renderBottles();
        this.renderChickens();
        this.renderEndboss();

        // Render character and throwable objects
        this.addToMap(this.character);
        this.addObjectsToMap(this.throwableObjects);

        this.resetCanvasTranslation(); // Reset canvas position to original
        this.renderStatusBars(); // Render health and item status bars

        // Show endboss status bar after first contact
        if (this.level.endboss[0].hadFirstContact) {
            this.addToMap(this.statusbarEndboss);
        }

        this.showCoins(); // Display coins count
        this.showBottles(); // Display bottles count
        this.showHealth(); // Display health status

        requestAnimationFrame(() => this.draw()); // Request the next animation frame
    }

    /**
     * Clears the entire canvas.
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Translates the canvas context by the camera's X position.
     */
    translateCanvas() {
        this.ctx.translate(this.cameraX, 0);
    }

    /**
     * Resets the canvas translation to the original position.
     */
    resetCanvasTranslation() {
        this.ctx.translate(-this.cameraX, 0);
    }

    /**
     * Renders background objects onto the canvas.
     */
    renderBackgroundObjects() {
        this.addObjectsToMap(this.level.backgroundObjects);
    }

    /**
     * Renders clouds onto the canvas.
     */
    renderClouds() {
        this.addObjectsToMap(this.level.clouds);
    }

    /**
     * Renders coins onto the canvas.
     */
    renderCoins() {
        this.addObjectsToMap(this.level.coins);
    }

    /**
     * Renders bottles onto the canvas.
     */
    renderBottles() {
        this.addObjectsToMap(this.level.bottles);
    }

    /**
     * Renders chickens (both small and regular) onto the canvas.
     */
    renderChickens() {
        this.addObjectsToMap(this.level.chickenSmall);
        this.addObjectsToMap(this.level.chicken);
    }

    /**
     * Renders the endboss onto the canvas.
     */
    renderEndboss() {
        this.addObjectsToMap(this.level.endboss);
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