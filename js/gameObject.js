import { Vector2D } from './vectors.js';
import { Cobject } from './object.js';
import { BoxCollision, CollisionHandler } from './collision.js';
import { DrawingOperation, CanvasSprite, CanvasDrawer } from './customDrawer.js';
import { MasterObject } from './masterObject.js';

class GameObject extends Cobject {
    constructor() {
        super();
        this.Direction = new Vector2D(0, 0);
        this.Velocity = new Vector2D(0, 0);
        this.MovementSpeed = new Vector2D(-1, -1);
        this.BoxCollision = new BoxCollision(this.position, this.size);
        this.canvas;
    }

    FixedUpdate() {
        super.FixedUpdate();
        this.CheckCollision(this.position);

        if (CanvasDrawer.GCD.canvasAtlases[this.name] !== undefined) {
            this.canvas = CanvasDrawer.GCD.canvasAtlases[this.name].canvas;
        }
    }

    LoadAtlas() {
        if (MasterObject.MO.objectsHasBeenInitialized === false) {
            window.requestAnimationFrame(() => this.LoadAtlas());
        } else
        CanvasDrawer.GCD.LoadNewSpriteAtlas(this.spriteSheet, 32, this.name);
    }

    UpdateMovement() {
        if (this.Velocity.x !== 0 || this.Velocity.y !== 0) {
            let tempPosition = new Vector2D(this.position.x, this.position.y);
            tempPosition.Add(Vector2D.Mult(this.MovementSpeed, this.Velocity));
            if (this.CheckCollision(tempPosition) === true) {
                this.position.Add(Vector2D.Mult(this.MovementSpeed, this.Velocity));
                this.BoxCollision.position = this.position;
            }
        }
    }

    CheckCollision(position) {
        return CollisionHandler.GCH.CheckCollisions(new BoxCollision(position, this.BoxCollision.size));
    }

    CreateDrawOperation(frame, position, clear, canvas) {
        return new DrawingOperation(
            new CanvasSprite(
                frame.x,
                frame.y,
                frame.w,
                frame.h,
                this.name
            ),
            document.getElementById('sprite-objects-canvas'),
            position,
            clear,
            canvas
        );
    }
}

export { GameObject };