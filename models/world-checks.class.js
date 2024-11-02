class WorldChecks {

    constructor() {
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
     * Checks if there are any bottles in the level. 
     * If not, a new Bottle is created at a random position and added to the level's bottles array.
     */
    checkForBottles() {
        if (this.level.bottles.length === 0) {
            const x = Math.random() * 1500;
            const y = 120 + Math.random() * 200;
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
            this.level.chickenSmall.push(new ChickenSmall(3800));
        }
        if (this.level.chicken.length === 0) {
            this.level.chicken.push(new Chicken(3800));
        }
    }

    /**
     * Checks for collisions between the character and various game entities.
     * This includes checking if the character jumps on enemies,
     * collides with enemies, collides with the endboss, and collides with items.
     */
    checkCollisions() {
        this.checkCollisionsCharacterJumpOnEnemy();
        this.checkCollisionsCharacterVsEnemy();
        this.checkCollisionsCharacterVsEndboss();
        this.checkCollisionsCharacterVSItems();
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
                break;
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

}