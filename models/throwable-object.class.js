/** 
 * Represents a throwable object in the game, such as a bottle.
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
  /** 
   * Horizontal speed of the throwable object.
   * @type {number}
   */
  speedX = 8;

  /** 
   * Vertical speed of the throwable object.
   * @type {number}
   */
  speedY = 20;

  /** 
   * Creates an instance of a throwable object at the specified position.
   * @param {number} x - The x-coordinate of the throwable object.
   * @param {number} y - The y-coordinate of the throwable object.
   */
  constructor(x, y) {
      super();
      this.loadImage('./assets/img/6_salsa_bottle/salsa_bottle.png');
      this.x = x;
      this.y = y;
      this.height = 80;
      this.width = 80;
  }

  /** 
   * Offset for collision detection.
   * @type {Object}
   * @property {number} top - The top offset.
   * @property {number} bottom - The bottom offset.
   * @property {number} left - The left offset.
   * @property {number} right - The right offset.
   */
  offset = {
      top: 5,
      bottom: 5,
      left: 13,
      right: 13,
  };

  /** 
   * Initiates the throwing action for the throwable object.
   * @param {number} x - The x-coordinate where the object is thrown.
   * @param {number} y - The y-coordinate where the object is thrown.
   * @param {boolean} otherDirection - Indicates the direction of the throw.
   */
  throw(x, y, otherDirection) {
      this.applyGravity();
      if (!isPaused) {
          setInterval(() => {
              if (otherDirection) {
                  if (!isPaused) {
                      this.x -= this.speedX;
                  }
              } else {
                  if (!isPaused) {
                      this.x += this.speedX;
                  }
              }
          }, 25);
      }
  }
}
