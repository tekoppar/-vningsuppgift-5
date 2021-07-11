import { Vector2D } from '../classes/vectors.js';
import { Cobject } from '../classes/baseClasses/object.js';
import { BoxCollision, CollisionHandler, PolygonCollision } from './collision/collision.js';
import { DrawingOperation, CanvasDrawer, OperationType } from '../drawers/customDrawer.js';
import { MasterObject } from '../classes/masterObject.js';
import { Tile } from '../drawers/tiles/tile.js';

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

    Delete() {
        super.Delete();
        this.BoxCollision.Delete();
        this.canvas = null;

        if (this.drawingOperation !== undefined) {
            this.drawingOperation.shouldDelete = true;
            this.drawingOperation = null;
        }
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
        if (this.drawingOperation !== undefined && this.drawingOperation.DrawState() === false) {
            this.FlagDrawingUpdate(position);
            let overlaps = CollisionHandler.GCH.GetOverlaps(this.BoxCollision);//new BoxCollision(position, this.BoxCollision.size, this.enableCollision, this));

            for (let i = 0; i < overlaps.length; i++) {
                if (overlaps[i].collisionOwner !== undefined && overlaps[i].collisionOwner !== false && overlaps[i].collisionOwner.drawingOperation !== undefined) {
                    overlaps[i].collisionOwner.FlagDrawingUpdate(overlaps[i].collisionOwner.position);
                    //overlaps[i].collisionOwner.NeedsRedraw(overlaps[i].collisionOwner.position);
                }
            }
        }
    }

    NewCollision(collision) {
        if (this.drawingOperation === undefined) {
            window.requestAnimationFrame(() => this.NewCollision(collision));
            return;
        }
        this.BoxCollision.Delete();
        this.BoxCollision = undefined;
        this.BoxCollision = collision;

        if (this.BoxCollision instanceof PolygonCollision) {
            this.BoxCollision.UpdatePoints();
            this.BoxCollision.CalculateBoundingBox();
            this.drawingOperation.collisionSize = new Vector2D(this.BoxCollision.boundingBox.z, this.BoxCollision.boundingBox.a);
        }
    }

    FlagDrawingUpdate(position) {
        this.drawingOperation.Update(position);
    }

    UpdateMovement() {
        if (this.Velocity.x !== 0 || this.Velocity.y !== 0) {
            if (this.drawingOperation !== undefined)
                this.NeedsRedraw(this.previousPosition.Clone());

            this.BoxCollision.position = this.position.Clone();
            this.BoxCollision.position.Add(Vector2D.Mult(this.MovementSpeed, this.Velocity));

            if (this.CheckCollision() === true) {
                this.previousPosition = this.position.Clone();
                this.position.Add(Vector2D.Mult(this.MovementSpeed, this.Velocity));
            } else {
                this.BoxCollision.position = this.position;
            }
        }
    }

    CheckCollision() {
        return CollisionHandler.GCH.CheckCollisions(this.BoxCollision);//new BoxCollision(position, this.BoxCollision.size, this.enableCollision, this));
    }

    CreateDrawOperation(frame, position, clear, canvas, operationType = OperationType.GameObject) {
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

            CanvasDrawer.GCD.AddDrawOperation(this.drawingOperation, operationType);
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

        this.NeedsRedraw(this.position);
    }

    CreateDrawOperations(frames, position, clear, canvas, operationType = OperationType.GameObject, tileOffsets = [new Vector2D(0, 0)]) {
        if (this.drawingOperations.length < 1) {
            for (let i = 0; i < frames.length; i++) {
                this.drawingOperations.push(
                    new DrawingOperation(
                        new Tile(
                            position,
                            new Vector2D(frames[i].x, frames[i].y),
                            new Vector2D(frames[i].w, frames[i].h),
                            clear,
                            this.canvasName,
                            this.drawIndex
                        ),
                        document.getElementById('sprite-objects-canvas'),
                        canvas
                    )
                );
            }
            CanvasDrawer.GCD.AddDrawOperations(this.drawingOperations, operationType);
        } else {
            for (let i = 0; i < frames.length; i++) {
                this.drawingOperations[i].tile.position = position;

                if (frames[i] !== undefined && frames[i] !== null) {
                    this.drawingOperations[i].tile.tilePosition = new Vector2D(frames[i].x, frames[i].y);
                    this.drawingOperations[i].tile.size = new Vector2D(frames[i].w, frames[i].h);
                }
                this.drawingOperations[i].tile.clear = clear;
                this.drawingOperations[i].tile.atlas = this.canvasName;
                this.drawingOperations[i].tile.drawIndex = this.drawIndex;
                this.drawingOperations[i].targetCanvas = canvas;
                this.drawingOperations[i].Update();
            }
        }

        this.NeedsRedraw(this.position);
    }
}

export { GameObject };