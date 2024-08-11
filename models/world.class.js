class World {

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

    ismuted = false;
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

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();

    }


    setWorld() {
        this.character.world = this;
        this.level.endboss[0].world = this;
        if (!this.ismuted) {
            this.backgroundSound.volume = this.backgroundSoundVolume;
            this.playSound(this.backgroundSound);
        };
    }


    run() {

        setInterval(() => {
            this.checkCollisions();
        }, 100);

        setInterval(() => {
            this.checkThrownObjects();
            this.checkCollisionsOfThrowObjects();
            this.checkIfCharacterOrEndbossIsDead();
            this.deleteThrowingObjects();
            this.chickenLoop(this.level.chicken);
            this.chickenLoop(this.level.chickenSmall);
            this.cloudLoop(this.level.clouds);
        }, 200);

        setInterval(() => {
            this.checkForBottles();
            this.checkForEnemies();
            this.deleteDeadEnemies();
        }, 5000);
    }


    deleteDeadEnemies() {
        this.arrayOfEnemies.forEach((enemyArray) => {
            for (let i = enemyArray.length - 1; i >= 0; i--) {
                if (enemyArray[i].enemyIsDead) {
                    enemyArray.splice(i, 1);
                }
            }
        });
    }
    


    checkForBottles() {
        if (this.level.bottles.length <= 0) {
            let x = Math.random() * 1500;
            let y = 120 + Math.random() * 200;
            this.level.bottles.push(new Bottle(x, y));
        };
    }


    checkForEnemies() {
        if (this.level.chickenSmall.length <= 0) {
            this.level.chickenSmall.push(new ChickenSmall(3800));
        }
        if (this.level.chicken.length <= 0) {
            this.level.chicken.push(new Chicken(3800));
        }
    }




    checkCollisions() {
        this.checkCollisionsCharacterJumpOnEnemy();
        this.checkCollisionsCharacterVsEnemy();
        this.checkCollisionsCharacterVsEndboss();
        this.checkCollisionsCharacterVSItems();

    }



    checkCollisionsCharacterJumpOnEnemy() {
        this.arrayOfEnemies.forEach(arrayOfEnemies => {
            arrayOfEnemies.forEach(enemy => {
                if(this.character.isColliding(enemy) && this.character.isAboveGround() && !enemy.enemyIsDead && this.character.speedY < 0) {
                    if (!enemy.enemyIsDead) {
                        this.character.jump();
                        this.character.characterJumpSound();
                    };
                    enemy.enemyIsDead = true;
                    (enemy instanceof Chicken) ? (enemy.y = enemy.y + 20) : (enemy.y = enemy.y + 5);
                    (enemy instanceof Chicken) ? (this.character.killCountChicken++) : (this.character.killCountSmallChicken++);
                    this.soundHitChicken.playbackRate = 1;
                    this.soundHitChicken.volume = 0.03;
                    this.character.playSound(this.soundHitChicken);
                }
            });
        });
    }


    checkCollisionsCharacterVsEnemy() {
        this.arrayOfEnemies.forEach(arrayOfEnemies => {
            arrayOfEnemies.forEach(enemy => {
                if (this.character.isColliding(enemy) && !enemy.enemyIsDead && !this.character.isHurt()) {
                    this.character.hit(enemy);
                    this.statusbarHealth.setPercentage(this.character.energy);
                };
            });
        });
    }



    checkCollisionsCharacterVsEndboss() {
        this.level.endboss.forEach((enemy) => {
            if (this.character.isColliding(enemy) && !enemy.enemyIsDead && !this.character.isHurt()) {
                this.character.hit(enemy);
                enemy.animationAttack();
                this.statusbarHealth.setPercentage(this.character.energy);
            };
        });
    }


    checkCollisionsCharacterVSItems() {
        this.arrayOfItems.forEach(arrayOfItems => {
            arrayOfItems.forEach((item, index) => {
                if (this.character.isColliding(item)) {
                    if (item instanceof Coin) {
                        this.collectingCoins(index, arrayOfItems);
                    } else {
                        this.collectingBottles(index, arrayOfItems);
                    }

                    if (this.character.item < 100) {
                        this.character.item += 20;
                    };
                };
            });
        })
    }
    

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
    };
    


    draw() {

        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);


        // MOVEABLE OBJECTS
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


        // FIXED OBJECTS
        this.addToMap(this.statusbarHealth);
        this.addToMap(this.statusbarCoin);
        this.addToMap(this.statusbarBottle);
        if (this.level.endboss[0].hadFirstContact) {
            this.addToMap(this.statusbarEndboss);
        }


        this.showCoins();
        this.showBottles();
        this.showHealth();


        if (this.stopGame) {
            this.clearCanvas();
            this.gameOverTest2();
        };
        

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


    
    gameOverTest2() {

        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.ctx.font="40px Comic Sans MS";
        this.ctx.textAlign="center"; 
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText("Game Over!", this.canvas.width / 2, this.canvas.height/2 - 120)

        this.ctx.font="18px Comic Sans MS";
        this.ctx.fillStyle = '#D7DF01';
        this.ctx.fillText("You have left " + this.character.bottles / 20 + " bottles and collected " + this.character.coins / 20 + " coins.", this.canvas.width / 2, this.canvas.height/2 - 40);
        this.ctx.fillText("You killed " + this.character.killCountChicken + " Chicken and " + this.character.killCountSmallChicken + " small Chicken.", this.canvas.width / 2, this.canvas.height/2 - 80);
    
	    this.ctx.font="36px Comic Sans MS";
        this.ctx.fillStyle = '#D7DF01';
        this.ctx.fillText("Press 'Space' to continue.", this.canvas.width / 2, this.canvas.height/2 + 40); 


    }

    gameOverTest() {
        setTimeout(() => {
            this.backgroundSound.pause();
            this.clearAllIntervals();
        }, 2000);   
    }


    checkIfCharacterOrEndbossIsDead() {
        if (this.character.characterIsDead) {
            this.gameOverTest();
            this.final();
            setTimeout(() => {
                this.stopGame = true;
            }, 1500);
        } else if (this.level.endboss[0].endbossIsDead) {
            this.gameOverTest();
            this.final();
            setTimeout(() => {
                this.stopGame = true;
            }, 1500);
        }
    }


    playSound(sound) {
        if (!isMuted) {
            sound.play();
        }
    }

    stopSound(sound) {
        sound.pause();
    }


    final() {
        
        
    }


}







