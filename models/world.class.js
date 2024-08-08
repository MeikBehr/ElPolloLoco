class World {

    character = new Character();
    ctx;
    canvas;
    keyboard;
    level = level1;

    arrayOfEnemies = [
        this.level.chicken_small,
        this.level.chicken,
        // this.level.endboss,
    ];

    arrayOfItems = [
        this.level.coins,
        this.level.bottles,
    ];

    endboss_sightable = true;
    coinsCounter = 0;
    camera_x = 0;
    throwableObjects = [];
    statusbar_health = new StatusbarHealth();
    statusbar_coin = new StatusbarCoin();
    statusbar_bottle = new StatusbarBottle();
    statusbar_endboss = new StatusbarEndboss();

    ismuted = false;
    background_sound = new Audio('./assets/audio/background.mp3');
    background_sound_volume = 0.01;
    sound_walk = new Audio('./assets/audio/walking.mp3');
    sound_jump = new Audio('assets/audio/jump.mp3');
    sound_hurt = new Audio('assets/audio/hurt.mp3');
    sound_coin = new Audio('assets/audio/coin.mp3');
    sound_bottle = new Audio('assets/audio/bottle.mp3');
    sound_hit_chicken = new Audio('assets/audio/hit_chicken.mp3');
    




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
        if (!this.ismuted) {
            this.background_sound.loop = true;
            this.background_sound.volume = this.background_sound_volume;
            this.background_sound.play();
        };
    }


    run() {
        setInterval(() => {
            this.checkCollisions();
        }, 100);                                // set this to 1000 / 60
        setInterval(() => {
            this.checkThrowObjects();
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
                if(this.character.isColliding(enemy) && this.character.isAboveGround() && !enemy.enemyIsDead) {
                    if (!enemy.enemyIsDead) {
                        this.character.jump();
                    };
                    enemy.enemyIsDead = true;
                    (enemy instanceof Chicken) ? (enemy.y = enemy.y + 20) : (enemy.y = enemy.y + 5);
                    this.sound_hit_chicken.playbackRate = 1;
                    this.sound_hit_chicken.volume = 0.03;
                    this.character.playSound(this.sound_hit_chicken);
                }
            });
        });
    }


    checkCollisionsCharacterVsEnemy() {
        this.arrayOfEnemies.forEach(arrayOfEnemies => {
            arrayOfEnemies.forEach(enemy => {
                if (this.character.isColliding(enemy) && !enemy.enemyIsDead) {
                    this.character.hit(enemy);
                    this.statusbar_health.setPercentage(this.character.energy);
                };
            });
        });
    }


    checkCollisionsCharacterVsEndboss() {
        this.level.endboss.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusbar_health.setPercentage(this.character.energy);
                console.log('ENDBOSS HITS!');
                
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


    collectingCoins(index, arrayOfItems) {
        if (this.character.coins < 100) {
            this.character.coins += 20;
            arrayOfItems.splice(index, 1);
            this.statusbar_coin.setPercentage(this.character.coins);
            this.sound_coin.playbackRate = 1;
            this.sound_coin.volume = 0.05;
            this.character.playSound(this.sound_coin);
        };
    }


    collectingBottles(index, arrayOfItems) {
        if (this.character.bottles < 100) {
            this.character.bottles += 20;
            arrayOfItems.splice(index, 1);
            this.statusbar_bottle.setPercentage(this.character.bottles);
            this.sound_bottle.playbackRate = 1;
            this.sound_bottle.volume = 0.03;
            this.character.playSound(this.sound_bottle);
        };
    }





    deleteThrowingObjects() {
        this.throwableObjects = this.throwableObjects.filter((object) => {
            return object.y <= 500;
        });
    }



    checkThrowObjects() {
        if (this.keyboard.D  && this.character.bottles > 0) {
            let bottle = new ThrowableObject((this.character.x + 20), this.character.y + 100);
            this.throwableObjects.push(bottle);
        }
    };














    draw() {

        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);


        // MOVEABLE OBJECTS
        this.ctx.translate(this.camera_x, 0);                   // Kameraverschiebung bzw. Verschiebung Koordinatensystem
        
        this.addObjectsToMap(this.level.backgroundObjects);     // background zeichnen
        this.addObjectsToMap(this.level.clouds);                 // this.addToMap(this.level.clouds[0]);     // addObjectsToMap nehmen, oder bei addToMap muß light[0] angegeben werden!!!!
        this.addObjectsToMap(this.level.coins);                  // coin zeichnen
        this.addObjectsToMap(this.level.bottles);                // bottles zeichnen
        
        this.addObjectsToMap(this.level.chicken_small); 
        this.addObjectsToMap(this.level.chicken);
        if (this.endboss_sightable) {this.addObjectsToMap(this.level.endboss)};
        this.addToMap(this.character);                          // charakter zeichnen

        this.addObjectsToMap(this.throwableObjects);
        
        this.ctx.translate(-this.camera_x, 0);                  // Kamera-Verschiebung zurück bzw. Koordinatensystem zurück



        // FIXED OBJECTS
        // AUssERHALB der VERSCHIEBUNG der KAMERA
        // behind this.ctx.translate(-this.camera_x, 0) because now its pinned to canvas and not moving while character is moving!!!!
        this.addToMap(this.statusbar_health);
        this.addToMap(this.statusbar_coin);
        this.addToMap(this.statusbar_bottle);
        if (this.endboss_sightable) {this.addToMap(this.statusbar_endboss);}


        // Chicken-Loop. If chicken runs out of canvas to the left, it will re-spawn at the right side
        this.chickenLoop(this.level.chicken);
        this.chickenLoop(this.level.chicken_small);
        this.cloudLoop(this.level.clouds);


        if (this.character.x >= 2500) {
            this.level.endboss[0].x -= 5;
        }


        requestAnimationFrame(() => {                           // draw() wird immer wieder aufgerufen!
            this.draw();
        });


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


}







