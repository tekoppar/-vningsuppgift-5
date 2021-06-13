import { Vector2D } from './vectors.js';
import { Cobject } from './object.js';
import { BoxCollision, CollisionHandler } from './collision.js';
import { DrawingOperation, CanvasSprite, CanvasDrawer } from './customDrawer.js';
import { MasterObject } from './masterObject.js';
import { Tile } from './tile.js';

class GameObject extends Cobject {
    constructor(canvasName, position, enableCollision = false, drawIndex = 0) {
        super();
        this.Direction = new Vector2D(0, 0);
        this.Velocity = new Vector2D(0, 0);
        this.MovementSpeed = new Vector2D(-1, -1);
        this.BoxCollision = new BoxCollision(position, this.size, enableCollision, this);
        this.canvas;
        this.canvasName = canvasName;
        this.enableCollision = enableCollision;
        this.drawingOperation = undefined;
        this.drawIndex = drawIndex;
        this.previousPosition = new Vector2D(-1, -1);

        this.LoadAtlas();
    }

    FixedUpdate() {
        super.FixedUpdate();

        if (this.enableCollision === true)
            this.CheckCollision(this.position);

        if (CanvasDrawer.GCD.canvasAtlases[this.canvasName] !== undefined) {
            this.canvas = CanvasDrawer.GCD.canvasAtlases[this.canvasName].canvas;
        }
    }

    LoadAtlas() {
        if (MasterObject.MO.objectsHasBeenInitialized === false) {
            window.requestAnimationFrame(() => this.LoadAtlas(this.canvasName));
        } else
            CanvasDrawer.GCD.LoadNewSpriteAtlas(this.spriteSheet, 32, this.canvasName);
    }

    NeedsRedraw(position) {
        if (this.drawingOperation !== undefined) {
            this.drawingOperation.Update(position);
            let overlaps = CollisionHandler.GCH.GetOverlaps(new BoxCollision(position, this.BoxCollision.size, this.enableCollision, this));

            for (let i = 0; i < overlaps.length; i++) {
                if (overlaps[i].collisionOwner.drawingOperation !== undefined && overlaps[i].collisionOwner.drawingOperation.tile.needsToBeRedrawn === false) {
                    overlaps[i].collisionOwner.drawingOperation.Update();
                    //overlaps[i].collisionOwner.NeedsRedraw(overlaps[i].collisionOwner.position);
                }
            }
        }
    }

    UpdateMovement() {
        if (this.Velocity.x !== 0 || this.Velocity.y !== 0) {
            if (this.drawingOperation !== undefined)
                this.NeedsRedraw(this.previousPosition.Clone());

            let tempPosition = this.position.Clone();
            tempPosition.Add(Vector2D.Mult(this.MovementSpeed, this.Velocity));
            if (this.CheckCollision(tempPosition) === true) {
                this.previousPosition = this.position.Clone();
                this.position.Add(Vector2D.Mult(this.MovementSpeed, this.Velocity));
                this.BoxCollision.position = this.position;
            }
        }
    }

    CheckCollision(position) {
        return CollisionHandler.GCH.CheckCollisions(new BoxCollision(position, this.BoxCollision.size, this.enableCollision, this));
    }

    CreateDrawOperation(frame, position, clear, canvas) {
        if (this.drawingOperation === undefined) {
            this.drawingOperation = new DrawingOperation(
                new Tile(
                    position,
                    new Vector2D(frame.x, frame.y),
                    new Vector2D(frame.w, frame.h),
                    clear,
                    this.canvasName,
                    this.drawIndex
                ),
                document.getElementById('sprite-objects-canvas'),
                canvas
            );

            return this.drawingOperation;
        } else {
            this.drawingOperation.tile.position = position;

            if (frame !== undefined && frame !== null) {
                this.drawingOperation.tile.tilePosition = new Vector2D(frame.x, frame.y);
                this.drawingOperation.tile.size = new Vector2D(frame.w, frame.h);
            }
            this.drawingOperation.tile.clear = clear;
            this.drawingOperation.tile.atlas = this.canvasName;
            this.drawingOperation.tile.drawIndex = this.drawIndex;
            this.drawingOperation.targetCanvas = canvas;
            this.drawingOperation.Update();
        }
    }
}

export { GameObject };