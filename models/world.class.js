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






    /* ================================================================================================================        */
    /* ================================================================================================================        */
    /* ================================================================================================================        */
    /* ================================================================================================================        */
    /* ================================================================================================================        */
    /* ================================================================================================================        */
    /* ================================================================================================================        */
    /* ================================================================================================================        */
    /* ================================================================================================================        */
    /* ================================================================================================================        */


    

    checkCollisionsOfThrowObjects () {
        this.throwableObjects.forEach((bottle, index) => {
            this.checkCollisionsBottleEnemie(bottle, index);
            this.checkCollisionsBottleEndboss(bottle, index);
            this.checkCollisionsBottleGround(bottle, index);
        });
    }


    checkCollisionsBottleGround(bottle, index) {
        if (!bottle.isAboveGround()) {
            this.soundBottleSplash.volume = 0.1;
            bottle.playSound(this.soundBottleSplash);
            setTimeout(() => {
                this.throwableObjects.splice(index, 1)
            }, 1000 / 60);
        };
    }


    checkCollisionsBottleEndboss(bottle, index) {
        this.level.endboss.forEach((endboss) => {
            if (bottle.isColliding(endboss)) {
                bottle.objectIsColiding = true;
                this.soundBottleSplash.volume = 0.1;
                bottle.playSound(this.soundBottleSplash);
                endboss.endbossHit(endboss);
                this.statusbarEndboss.setPercentage(endboss.energy);
                setTimeout(() => {
                    this.throwableObjects.splice(index, 1)
                }, 100);
            };
        })
    }


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



    deleteThrowingObjects() {
        this.throwableObjects = this.throwableObjects.filter((object) => {
            return object.y <= 1000;
        });
    }



    
    checkThrownObjects() {
        if (this.throwCooldown) {
            return;
        }
    
        if (!isPaused) {
            if (this.keyboard.D && this.character.bottles > 0) {
                let bottle = new BottleThrowable((this.character.x + 20), this.character.y + 100, this.character.otherDirection);
                bottle.isThrown = true;
                this.throwableObjects.push(bottle);
                this.character.idleTime = 0;
                if (this.soundBottleThrow.paused) {
                    this.soundBottleThrow.playbackRate = 1;
                    this.soundBottleThrow.volume = 0.1;
                    bottle.playSound(this.soundBottleThrow);
                }
                this.character.bottles = this.character.bottles - 20;
                this.statusbarBottle.setPercentage(this.character.bottles);
                this.throwCooldown = true;
                setTimeout(() => {
                    this.throwCooldown = false;
                }, 1000);
            }
        }
    };
    


    draw() {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.cameraX, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.chickenSmall); 
        this.addObjectsToMap(this.level.chicken);
        this.addObjectsToMap(this.level.endboss);
        this.addToMap(this.character);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-this.cameraX, 0);
        this.addToMap(this.statusbarHealth);
        this.addToMap(this.statusbarCoin);
        this.addToMap(this.statusbarBottle);
        if (this.level.endboss[0].hadFirstContact) {
            this.addToMap(this.statusbarEndboss);
        }

        this.showCoins();
        this.showBottles();
        this.showHealth();
       
        requestAnimationFrame(() => {
            this.draw();
        });


    }


    showCoins() {
        this.ctx.font="24px Zabars";
        this.ctx.fillStyle = '#D7DF01';
        this.ctx.fillText(': ' + this.character.coins + ' %', 225, 97);
    }


    showBottles() {
        this.ctx.font="24px Zabars";
        this.ctx.fillStyle = '#D7DF01';
        this.ctx.fillText(': ' + this.character.bottles + ' %', 225, 142);
    }


    showHealth() {
        this.ctx.font="24px Zabars";
        this.ctx.fillStyle = '#D7DF01';
        this.ctx.fillText(': ' + this.character.energy + ' %', 225, 52);
    }


    
    addObjectsToMap(objects) {
        objects.forEach((object) => {
            this.addToMap(object);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }     
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo)
        }
    }


    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }


    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }


    chickenLoop(chicken) {
        chicken.forEach((chick) => {
            if (chick.x <= -150) {
                chick.x = 4000;
            }
        })
    }

    cloudLoop() {
        this.level.clouds.forEach((cloud) => {
            if (cloud.x <= -150) {
                cloud.x = 4000;
            }
        })
    }


    clearCanvas() {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    }

    clearAllIntervals() {
        for (let i = 1; i < 9999; i++) window.clearInterval(i);
    }

    playSound(sound) {
        if (!isMuted) {
            sound.play();
            activeSounds.push(sound);
        }
    }
    
    stopSound(sound) {
        sound.pause();
        sound.currentTime = 0;
        activeSounds = activeSounds.filter(s => s !== sound);
    }

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

    gameOverTest() {
        setTimeout(() => {
            this.backgroundSound.pause();
            this.clearAllIntervals();
        }, 2000);
    }

}



