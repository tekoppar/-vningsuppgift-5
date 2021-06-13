import { GameObject } from './gameObject.js';
import { Vector2D } from './vectors.js';

class Prop extends GameObject {
    constructor(spriteSheet, name, position, animations, canvasName, drawIndex = 0) {
        super(canvasName, position, false, drawIndex);
        this.spriteSheet = spriteSheet;
        this.name = name;
        this.position = position;
        this.animations = animations;
        this.currentAnimation;
    }

    FixedUpdate() {
        super.FixedUpdate();

        if (this.animation !== undefined) {
            this.PlayAnimation();
        }
    }

    PlayAnimation() {
        if (this.canvas !== undefined) {
            MasterObject.MO.canvasDrawer.AddDrawOperation(this.CreateDrawOperation(this.animation.GetFrame(), this.position, true, this.canvas), OperationType.gameObjects);
        }
    }
}

export { Prop };