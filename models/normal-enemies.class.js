/** 
 * Represents a normal enemy in the game that can move and be animated.
 * @extends MovableObject
 */
class NormalEnemies extends MovableObject {
    /** 
     * Animates the walking animation of the enemy.
     */
    animationIsWalking() {
        if (!isPaused) {
            this.playAnimation(this.IMAGES_WALKING);    
        }
    }

    /** 
     * Animates the death animation of the enemy.
     */
    animationIsDead() {
        this.playAnimation(this.IMAGES_DEAD);
    }

    /**
     * Initiates the movement and animation of the enemy.
     */
    animate() {
        setInterval(() => { 
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            if (!this.enemyIsDead) {
                this.animationIsWalking();
            } else {
                this.animationIsDead();
                this.speed = 0;
            }
        }, 175);
    }
}
