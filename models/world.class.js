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

    endboss_sightable = true;
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
    soundEndboss = new Audio('./assets/audio/endboss.mp3');
    
    




    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;               // so, damit draw() das canvas hat und dort clearRect ausführen kann
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();                    // damit übergeben ich die Variablen von world eine Ebene tiefer (hier besonders das Keyboard (Spiellogic - 07))
        this.run();

    }


    setWorld() {
        this.character.world = this;                        // character hat damit die Variablen von world => keyboard z.B. ACHTUNG: wir übergeben 'this' ... also world komplett!
        this.level.endboss[0].world = this;                          // endboss hat damit die Variablen von world => keyboard z.B. ACHTUNG: wir übergeben 'this' ... also world komplett!
        if (!this.ismuted) {
            this.backgroundSound.volume = this.backgroundSoundVolume;
            this.backgroundSound.play();
        };
    }


    run() {
        setInterval(() => {
            this.checkCollisions();
        }, 100);                                // set this to 1000 / 60
        setInterval(() => {
            this.checkThrownObjects();
            this.checkCollisionsOfThrowObjects();

            this.checkIfCharacterOrEndbossIsDead();

            this.deleteThrowingObjects();       // deleting ThrowableObjects, if y > 500 to be more performant
        }, 200);
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
                if (this.character.isColliding(enemy) && !enemy.enemyIsDead) {
                    this.character.hit(enemy);
                    this.statusbarHealth.setPercentage(this.character.energy);
                };
            });
        });
    }



    checkCollisionsCharacterVsEndboss() {
        this.level.endboss.forEach((enemy) => {
            if (this.character.isColliding(enemy) && !enemy.enemyIsDead) {
                this.character.hit(enemy);
                this.statusbarHealth.setPercentage(this.character.energy);
            };
        })
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
            this.checkCollisionsBottleGround(bottle, index);
            this.checkCollisionsBottleEndboss(bottle, index);
            this.checkCollisionsBottleEnemie(bottle, index);
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
                }, 1000 / 60);
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
                    }, 1000 / 60);
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
    
        if (this.keyboard.D && this.character.bottles >= 0) {
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
        this.ctx.translate(this.cameraX, 0);                   // Kameraverschiebung bzw. Verschiebung Koordinatensystem
        
        this.addObjectsToMap(this.level.backgroundObjects);     // background zeichnen
        this.addObjectsToMap(this.level.clouds);                 // this.addToMap(this.level.clouds[0]);     // addObjectsToMap nehmen, oder bei addToMap muß light[0] angegeben werden!!!!
        this.addObjectsToMap(this.level.coins);                  // coin zeichnen
        this.addObjectsToMap(this.level.bottles);                // bottles zeichnen
        
        this.addObjectsToMap(this.level.chickenSmall); 
        this.addObjectsToMap(this.level.chicken);
        // if (this.endboss_sightable) {
        //     this.addObjectsToMap(this.level.endboss)
        // };
        this.addObjectsToMap(this.level.endboss);
        this.addToMap(this.character);                          // charakter zeichnen

        this.addObjectsToMap(this.throwableObjects);
        
        this.ctx.translate(-this.cameraX, 0);                  // Kamera-Verschiebung zurück bzw. Koordinatensystem zurück



        // FIXED OBJECTS
        // AUssERHALB der VERSCHIEBUNG der KAMERA
        // behind this.ctx.translate(-this.camera_x, 0) because now its pinned to canvas and not moving while character is moving!!!!
        this.addToMap(this.statusbarHealth);
        this.addToMap(this.statusbarCoin);
        this.addToMap(this.statusbarBottle);
        if (this.endboss_sightable) {this.addToMap(this.statusbarEndboss);}


        // Chicken-Loop. If chicken runs out of canvas to the left, it will re-spawn at the right side
        this.chickenLoop(this.level.chicken);
        this.chickenLoop(this.level.chickenSmall);
        this.cloudLoop(this.level.clouds);


        this.showCoins();
        this.showBottles();
        this.showHealth();

        // this.gameOverTest();

        if (this.stopGame) {
            this.clearCanvas();
            this.gameOverTest2();
        };
        

        requestAnimationFrame(() => {                           // draw() wird immer wieder aufgerufen!
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


    
    addObjectsToMap(objects) {              // funktion zum Zeichnen von Arrays von Objekten - X, Y, Width, Height sind zwingend erforderlich
        objects.forEach((object) => {
            this.addToMap(object);
        });
    }

    // funktion zum Zeichnen von einzelnen Objekten - X, Y, Width, Height sind zwingend erforderlich
    addToMap(mo) {
        if (mo.otherDirection) {    // nur der Character hat otherDirection als true => das hier kann nur für ihn gelten. Wir ändern alles für ihn...
            this.flipImage(mo);
        }     
        mo.draw(this.ctx);
        // mo.drawFrame(this.ctx);
        // mo.drawOffsetFrame(this.ctx);
        if (mo.otherDirection) {        // ... und setzen alles andere wieder auf Standard zurück z.B. für die enemies.
            this.flipImageBack(mo)
        }
    }


    flipImage(mo) {
        this.ctx.save();                        // Speichert den aktuellen Zustand des Kontextes
        this.ctx.translate(mo.width, 0);        // Verschiebt den Ursprung des Koordinatensystems um die Breite des Bildes
        this.ctx.scale(-1, 1);                  // Spiegelt das Koordinatensystem an der Y-Achse
        mo.x = mo.x * -1;                       // Multipliziert die X-Koordinate des Objekts mit -1
    }


    flipImageBack(mo) {
        mo.x = mo.x * -1;                       // Setzt die X-Koordinate wieder auf den ursprünglichen Wert zurück
        this.ctx.restore();                     // Stellt den ursprünglichen Zustand des Kontextes wieder her
    }


    chickenLoop(chicken) {
        chicken.forEach((chick) => {
            if (chick.x <= -150) {
                chick.x = 3500;
            }
        })
    }

    cloudLoop() {
        this.level.clouds.forEach((cloud) => {
            if (cloud.x <= -150) {
                cloud.x = 3500;
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
        this.ctx.fillText("You've reached bottles " + this.character.bottles + " and your coins is " + this.character.coins + ".", this.canvas.width / 2, this.canvas.height/2 - 40);
    
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
            // console.log('Character is Dead');
            // this.stopGame = true;
        } else if (this.level.endboss[0].endbossIsDead) {
            console.log('Endboss is Dead');
            this.gameOverTest();
            this.final();
            setTimeout(() => {
                this.stopGame = true;
            }, 1500);
        }
    }

    final() {
        console.log('Still here');
        
    }


}







