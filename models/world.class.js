class World {

    character = new Character();

    ctx;
    canvas;
    keyboard;
    level = level1;
    camera_x = 0;
    // soundVolume = 0.3;
    // backgroundSound = new Audio('./assets/audio/background.mp3'); 


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;               // so, damit draw() das canvas hat und dort clearRect ausführen kann
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();    // damit übergeben ich die Variablen von world eine Ebene tiefer (hier besonders das Keyboard (Spiellogic - 07))
    }


    setWorld() {
        this.character.world = this;                        // character hat damit die Variablen von world => keyboard z.B. ACHTUNG: wir übergeben 'this' ... also world komplett!
        // this.backgroundSound.volume = this.soundVolume;
        // this.backgroundSound.play();
    }


    draw() {

        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);                   // Kameraverschiebung
        
        this.addObjectsToMap(this.level.backgroundObjects);     // background zeichnen
        this.addToMap(this.level.clouds[0]);
        // this.addObjectsToMap(this.level.clouds);                 // this.addToMap(this.level.light[0]);     // addObjectsToMap nehmen, oder bei addToMap muß light[0] angegeben werden!!!!
        // this.addObjectsToMap(this.level.endboss);          
        this.addObjectsToMap(this.level.chicken_small); 
        this.addObjectsToMap(this.level.chicken);
        // MISSING small chicken: this.addObjectsToMap(this.level.chicken);             // jellyfishe zeichnen
        // this.addObjectsToMap(this.level.coins);                  // coin zeichnen
        // this.addObjectsToMap(this.level.bottles);                // poison zeichnen
        
        this.addToMap(this.character);                          // charakter zeichnen

        this.ctx.translate(-this.camera_x, 0);                  // Kamera-Verschiebung zurück

        requestAnimationFrame(() => {                           // draw() wird immer wieder aufgerufen!
            this.draw();
        });


    }

    // funktion zum Zeichnen von Arrays von Objekten - X, Y, Width, Height sind zwingend erforderlich
    addObjectsToMap(objects) {
        objects.forEach((object) => {
            this.addToMap(object);
        });
    }

    // funktion zum Zeichnen von einzelnen Objekten - X, Y, Width, Height sind zwingend erforderlich
    addToMap(mo) {

        // nur der Character hat otherDirection als true => das hier kann nur für ihn gelten. Wir ändern alles für ihn...
        if (mo.otherDirection) {
            this.flipImage(mo);
        }     

        // .... zeichnen ihn
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height); // Zeichnet das Bild an der neuen Position
    
        // ... und setzen alles andere wieder auf Standard zurück z.B. für die enemies.
        if (mo.otherDirection) {
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

    

}












