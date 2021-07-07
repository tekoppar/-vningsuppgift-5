import { GameObject } from './gameObject.js';
import { CanvasDrawer, CanvasSprite, OperationType } from './customDrawer.js';
import { Vector2D } from './vectors.js';
import { BoxCollision } from './collision.js';

class Prop extends GameObject {
    constructor(spriteSheet, name, position, animations, canvasName, drawIndex = 0) {
        super(canvasName, position, false, drawIndex);
        this.spriteSheet = spriteSheet;
        this.name = name;
        this.position = position;
        this.animations = animations;
        this.currentAnimation;
    }

    Delete() {
        super.Delete();
        this.animations = null;
        this.currentAnimation = null;
        this.position = null;
        this.name = null;
    }

    FixedUpdate() {
        if (this.currentAnimation !== undefined) {
            this.PlayAnimation();
        }
        super.FixedUpdate();
    }

    NeedsRedraw(position) {
        super.NeedsRedraw(position);
    }

    PlayAnimation() {
        if (this.currentAnimation !== undefined) {
            let frame = this.currentAnimation.GetFrame();

            if (frame !== null) {
                this.BoxCollision.size = this.currentAnimation.GetSize();

                this.CreateDrawOperation(frame, this.position, true, this.canvas, OperationType.gameObjects);
            }
        }
    }
}

export { Prop };