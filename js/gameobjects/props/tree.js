import { Prop } from '../props/props.js';
import { CFrame } from '../../animations/animations.js';
import { OperationType } from '../../drawers/canvas/operation.js';
import { Vector2D, Vector4D } from '../../classes/vectors.js';
import { CanvasDrawer } from '../../drawers/canvas/customDrawer.js';
import { PolygonCollision } from '../collision/collision.js';
import { Shadow } from '../gameObject.js';

const TreeCollisions = {
    treeBirch1: [new Vector2D(46, 164), new Vector2D(36, 152), new Vector2D(41, 140), new Vector2D(41, 80), new Vector2D(5, 61.99999999999999), new Vector2D(6, 34), new Vector2D(22, 8), new Vector2D(23, 8), new Vector2D(47, 2), new Vector2D(71, 6), new Vector2D(91, 42), new Vector2D(86, 61.99999999999999), new Vector2D(55, 78), new Vector2D(55, 144), new Vector2D(61, 154) ],
    treeBirch2: [new Vector2D(48, 126.66666666666666), new Vector2D(35, 124), new Vector2D(40, 116), new Vector2D(40, 80), new Vector2D(6, 64), new Vector2D(5, 36), new Vector2D(23, 8), new Vector2D(49, 0), new Vector2D(80, 17.333333333333332), new Vector2D(92, 44), new Vector2D(78, 73.33333333333333), new Vector2D(54, 78.66666666666666), new Vector2D(55.99999999999999, 114.66666666666666), new Vector2D(61.99999999999999, 122.66666666666666)],
}

class Tree extends Prop {
    constructor(spriteSheet, name, position, animations, canvasName, drawIndex = 0) {
        super(spriteSheet, name, position, animations, canvasName, drawIndex);
        this.isVisible = true;
        this.currentAnimation = undefined;
        this.shadow = undefined;
    }

    PlayAnimation() {
        super.PlayAnimation();
    }

    FixedUpdate() {
        super.FixedUpdate();
    }

    FlagDrawingUpdate(position) {
        super.FlagDrawingUpdate(position);
        this.shadow.FlagDrawingUpdate(position);
    }

    GameBegin() {
        super.GameBegin();
        let size = new Vector2D(CanvasDrawer.GCD.canvasAtlases[this.canvasName].width, CanvasDrawer.GCD.canvasAtlases[this.canvasName].height);
        this.CreateDrawOperation(
            new CFrame(
                0,
                0,
                size.x,
                size.y
            ),
            this.position,
            false,
            CanvasDrawer.GCD.canvasAtlases[this.canvasName].canvas,
            OperationType.gameObjects
        );
        this.BoxCollision.size = size.Clone();
        this.NewCollision(new PolygonCollision(
            this.position.Clone(),
            this.size.Clone(),
            TreeCollisions[this.name],
            false,
            this,
            true
        ));

        this.shadow = new Shadow(this, 'treeBirchShadow', new Vector2D(this.BoxCollision.position.x, this.BoxCollision.GetCenterTilePosition().y + size.y + 0.5));
        this.shadow.GameBegin();
    }
}

export { Tree };