import { Vector2D, Vector4D } from '../classes/vectors.js';
import { Cobject } from '../classes/baseClasses/object.js';
import { BoxCollision, CollisionHandler, PolygonCollision } from './collision/collision.js';
import { CanvasDrawer } from '../drawers/canvas/customDrawer.js';
import { DrawingOperation, OperationType } from '../drawers/canvas/operation.js';
import { MasterObject } from '../classes/masterObject.js';
import { Tile } from '../drawers/tiles/tile.js';

class GameObject extends Cobject {
    constructor(canvasName, position, enableCollision = false, drawIndex = 0) {
        super();
        this.Direction = new Vector2D(0, 0);
        this.Velocity = new Vector2D(0, 0);
        this.MovementSpeed = new Vector2D(-1, -1);
        this.BoxCollision = new BoxCollision(position, this.size, enableCollision, this);
        this.BlockingCollision = undefined;
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

    GameBegin() {
        super.GameBegin();

        if (CanvasDrawer.GCD.canvasAtlases[this.canvasName] !== undefined) {
            this.canvas = CanvasDrawer.GCD.canvasAtlases[this.canvasName].canvas;
        }
    }

    FixedUpdate() {
        super.FixedUpdate();

        if (this.enableCollision === true)
            this.CheckCollision(this.position);
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
            let overlaps = CollisionHandler.GCH.GetOverlaps(this.BoxCollision);

            for (let i = 0; i < overlaps.length; i++) {
                if (overlaps[i].collisionOwner !== undefined && overlaps[i].collisionOwner !== false && overlaps[i].collisionOwner.drawingOperation !== undefined) {
                    overlaps[i].collisionOwner.FlagDrawingUpdate(overlaps[i].collisionOwner.position);
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

    CheckCollision() {
        return CollisionHandler.GCH.CheckCollisions(this.BoxCollision);
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
                CanvasDrawer.GCD.frameBuffer,
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
                        CanvasDrawer.GCD.frameBuffer,//document.getElementById('sprite-objects-canvas'),
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

class Shadow extends Cobject {
    constructor(parent, canvasName, position) {
        super();
        this.position = position;
        this.size = new Vector2D(1, 1);
        this.BoxCollision = new BoxCollision(position, this.size, false, this);
        this.currentAnimation = undefined;
        this.name = 'shadow' + this.UID;
        this.parent = parent;
        this.drawingOperation = undefined;
        this.canvas;
        this.canvasName = canvasName;
        this.drawIndex = 0;
        this.previousPosition = new Vector2D(-1, -1);
    }

    ChangeAnimation(animation) {
        if (this.currentAnimation != animation)
            this.currentAnimation = animation;
    }

    FixedUpdate() {
        super.FixedUpdate();
        this.drawingOperation.tile.needsToBeRedrawn = true;
    }

    GameBegin() {
        super.GameBegin();

        if (CanvasDrawer.GCD.canvasAtlases[this.canvasName] !== undefined) {
            this.canvas = CanvasDrawer.GCD.canvasAtlases[this.canvasName].canvas;
            this.size.x = this.canvas.width;
            this.size.y = this.canvas.height;
            this.BoxCollision.size = this.size;
        }

        this.CreateDrawOperation({x:0, y:0, w:this.size.x, h:this.size.y}, this.position.Clone(), false, this.canvas, OperationType.gameObjects);
        this.drawingOperation.collisionSize = new Vector2D(this.size.x, 1);
    }

    NeedsRedraw(position) {
        if (this.drawingOperation !== undefined && this.drawingOperation.DrawState() === false) {
            this.FlagDrawingUpdate(position);
            let overlaps = CollisionHandler.GCH.GetOverlaps(this.BoxCollision);

            for (let i = 0; i < overlaps.length; i++) {
                if (overlaps[i].collisionOwner !== undefined && overlaps[i].collisionOwner !== false && overlaps[i].collisionOwner.drawingOperation !== undefined) {
                    overlaps[i].collisionOwner.FlagDrawingUpdate(overlaps[i].collisionOwner.position);
                }
            }
        }
    }

    FlagDrawingUpdate(position) {
        this.drawingOperation.Update(this.position);
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
                CanvasDrawer.GCD.frameBuffer,
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
}

export { GameObject, Shadow };