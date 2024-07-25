class World {

    character = new Character();

    ctx;
    canvas;
    keyboard;
    level = level1;
    camera_x = 0;

    statusbar_health = new StatusbarHealth();
    statusbar_coin = new StatusbarCoin();
    statusbar_bottle = new StatusbarBottle();
    
    soundVolume = 0.01;
    backgroundSound_on = false;
    backgroundSound = new Audio('./assets/audio/background.mp3');


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;               // so, damit draw() das canvas hat und dort clearRect ausführen kann
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();                    // damit übergeben ich die Variablen von world eine Ebene tiefer (hier besonders das Keyboard (Spiellogic - 07))
        this.checkCollisions();

    }


    setWorld() {
        this.character.world = this;                        // character hat damit die Variablen von world => keyboard z.B. ACHTUNG: wir übergeben 'this' ... also world komplett!
        this.backgroundSound.volume = this.soundVolume;
        if (this.backgroundSound_on) {this.backgroundSound.play();};
    }


    checkCollisions() {
        setInterval(() => {
            this.level.chicken.forEach((enemy) => {
                if (this.character.iscolliding(enemy)) {
                    this.character.hit();
                    this.statusbar_health.setPercentage(this.character.energy);
                    // console.log('Character is dead? ', this.character.isDead());
                };
            })

            // this.level.chicken_small.forEach((enemy) => {
            //     if (this.character.iscolliding(enemy)) {
            //         this.character.hit();
            //         this.statusbar_health.setPercentage(this.character.energy);
            //     };
            // })

            // this.level.endboss.forEach((enemy) => {
            //     if (this.character.iscolliding(enemy)) {
            //         this.character.hit();
            //         this.statusbar_health.setPercentage(this.character.energy);
            //     };
            // })

            this.level.coins.forEach((enemy) => {
                if (this.character.iscolliding(enemy)) {
                    if (this.character.coins < 100) {
                        this.character.coins += 20;
                    };
                    this.statusbar_coin.setPercentage(this.character.coins);
                };
            })

            this.level.bottles.forEach((enemy) => {
                if (this.character.iscolliding(enemy)) {
                    if (this.character.bottles < 100) {
                        this.character.bottles += 20;
                    };
                    this.statusbar_bottle.setPercentage(this.character.bottles);
                };
            })

        }, 200)
    }


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
        // this.addObjectsToMap(this.level.endboss);
        this.addToMap(this.character);                          // charakter zeichnen
        
        this.ctx.translate(-this.camera_x, 0);                  // Kamera-Verschiebung zurück bzw. Koordinatensystem zurück



        // FIXED OBJECTS
        // AUssERHALB der VERSCHIEBUNG der KAMERA
        // behind this.ctx.translate(-this.camera_x, 0) because now its pinned to canvas and not moving while character is moving!!!!
        this.addToMap(this.statusbar_health);
        this.addToMap(this.statusbar_coin);
        this.addToMap(this.statusbar_bottle);


        // Chicken-Loop. If chicken runs out of canvas to the left, it will re-spawn at the right side
        this.chickenLoop(this.level.chicken);
        this.chickenLoop(this.level.chicken_small);
        this.cloudLoop(this.level.clouds);



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
        mo.drawFrame(this.ctx);
        mo.drawOffsetFrame(this.ctx);

        
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


    chickenLoop() {
        this.level.chicken.forEach((chick) => {
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







