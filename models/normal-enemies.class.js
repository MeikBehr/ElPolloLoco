
class NormalEnemies extends MovableObject {


    animationIsWalking() {
        if (!isPaused) {
            this.playAnimation(this.IMAGES_WALKING);    
        }
    }


    animationIsDead() {
        this.playAnimation(this.IMAGES_DEAD);
    }


    animate() {

        // this.moveLeft();
        
        setInterval(() => { 
            this.moveLeft();
        }, 1000 / 60)

        setInterval( () => {
            if (!this.enemyIsDead) {
                this.animationIsWalking();
            } else {
                this.animationIsDead();
                this.speed = 0;
            }
        }, 175);
    }

}