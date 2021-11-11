/*import { GameObject } from '../gameObject.js';
import { Vector2D, Vector4D } from '../../classes/vectors.js';
import { CanvasDrawer } from '../../drawers/canvas/customDrawer.js';
import { OperationType } from '../../drawers/canvas/operation.js';
import { PolygonCollision, BoxCollision } from '../collision/collision.js';
import { Shadow } from '../gameObject.js';
import { CAnimation } from '../../animations/animations.js';*/

import { GameObject, Vector2D, Vector4D, CanvasDrawer, OperationType, PolygonCollision, BoxCollision, Shadow, CAnimation } from '../../internal.js';

class Prop extends GameObject {
    constructor(name, position, animations, canvasName, drawIndex = 0) {
        super(canvasName, position, false, drawIndex);
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

class ExtendedProp extends Prop {
    constructor(name, position, animations, canvasName, drawIndex = 0, blockingCollisionSize = new Vector4D(16, 16, 0, 0)) {
        super(name, position, animations, canvasName, drawIndex);
        this.isVisible = true;
        this.currentAnimation = undefined;
        this.blockingCollisionSize = blockingCollisionSize;

        if (animations instanceof CAnimation)
            this.currentAnimation = animations.Clone();

        this.shadow = undefined;
    }

    Delete() {
        super.Delete();

        if (this.shadow !== undefined) {
            this.shadow.Delete();
            this.shadow = undefined;
        }
        this.currentAnimation = undefined;
    }

    GameBegin(polygonCollision = undefined, position = new Vector2D(0, 0), size = new Vector2D(0, 0), tilePosition = new Vector2D(0, 0), createShadow = false) {
        super.GameBegin();

        if (polygonCollision === undefined && this.currentAnimation !== undefined) {
            position.x = this.currentAnimation.start.x;
            position.y = this.currentAnimation.start.y;
            size.x = this.currentAnimation.w;
            size.y = this.currentAnimation.h;
        }

        this.CreateDrawOperation(
            { x: tilePosition.x, y: tilePosition.y, w: size.x, h: size.y },
            this.position.Clone(),
            false,
            CanvasDrawer.GCD.canvasAtlases[this.canvasName].canvas,
            OperationType.gameObjects
        );

        this.BoxCollision.size = size.Clone();
        this.drawingOperation.collisionSize = size;

        if (polygonCollision !== undefined) {
            this.NewCollision(new PolygonCollision(
                this.position.Clone(),
                this.size.Clone(),
                polygonCollision,
                false,
                this,
                true
            ));
        } else if (this.currentAnimation !== undefined) {
            this.NewCollision(new BoxCollision(
                this.position.Clone(),
                this.size.Clone(),
                false,
                this,
                true
            ));
        }

        this.BlockingCollision = new BoxCollision(this.position.Clone(), this.blockingCollisionSize.Clone(), true, this, true);
        this.BlockingCollision.position = this.BoxCollision.GetCenterPosition().Clone();
        this.BlockingCollision.position.Sub({ x: this.BlockingCollision.size.x / 2 + this.blockingCollisionSize.z, y: this.BlockingCollision.size.y / 2 + this.blockingCollisionSize.a });

        if (createShadow) {
            this.shadow = new Shadow(this, this.name + 'Shadow', new Vector2D(this.BoxCollision.position.x, this.BoxCollision.GetCenterTilePosition().y + size.y + 1));
            this.shadow.GameBegin();
        }
    }

    PlayAnimation() {
        super.PlayAnimation();
    }

    FixedUpdate() {
        super.FixedUpdate();
    }

    FlagDrawingUpdate(position) {
        super.FlagDrawingUpdate(position);

        if (this.shadow !== undefined)
            this.shadow.FlagDrawingUpdate(position);
    }
}

export { Prop, ExtendedProp };