/* import { ExtendedProp } from '../props/props.js';
import { Vector2D } from '../../classes/vectors.js';
import { CanvasDrawer, OperationType } from '../../drawers/canvas/customDrawer.js';
import { ItemProp } from '../props/itemprop.js';
import { CAnimation, AnimationType } from '../../animations/animations.js';
import { CMath } from '../../classes/math/customMath.js';
import { BoxCollision } from '../../gameobjects/collision/collision.js'; */

import { ExtendedProp, Vector2D, CanvasDrawer, OperationType, ItemProp, CAnimation, AnimationType, CMath, BoxCollision } from '../../internal.js';

const TreeCollisions = {
    treeBirch1: [new Vector2D(46, 164), new Vector2D(36, 152), new Vector2D(41, 140), new Vector2D(41, 80), new Vector2D(5, 61.99999999999999), new Vector2D(6, 34), new Vector2D(22, 8), new Vector2D(23, 8), new Vector2D(47, 2), new Vector2D(71, 6), new Vector2D(91, 42), new Vector2D(86, 61.99999999999999), new Vector2D(55, 78), new Vector2D(55, 144), new Vector2D(61, 154)],
    treeBirch2: [new Vector2D(48, 126.66666666666666), new Vector2D(35, 124), new Vector2D(40, 116), new Vector2D(40, 80), new Vector2D(6, 64), new Vector2D(5, 36), new Vector2D(23, 8), new Vector2D(49, 0), new Vector2D(80, 17.333333333333332), new Vector2D(92, 44), new Vector2D(78, 73.33333333333333), new Vector2D(54, 78.66666666666666), new Vector2D(55.99999999999999, 114.66666666666666), new Vector2D(61.99999999999999, 122.66666666666666)],
    treePine1: [new Vector2D(48, 159), new Vector2D(36, 155), new Vector2D(40, 149), new Vector2D(39, 103), new Vector2D(21, 110), new Vector2D(7, 90), new Vector2D(32, 30), new Vector2D(50, 20), new Vector2D(64, 29), new Vector2D(87, 60), new Vector2D(86, 100), new Vector2D(57, 112), new Vector2D(57, 148), new Vector2D(60, 155),],
    treePine2: [new Vector2D(48, 127), new Vector2D(36, 123), new Vector2D(40, 117), new Vector2D(39, 103), new Vector2D(21, 110), new Vector2D(7, 90), new Vector2D(32, 30), new Vector2D(50, 20), new Vector2D(64, 29), new Vector2D(87, 60), new Vector2D(86, 100), new Vector2D(57, 112), new Vector2D(57, 116), new Vector2D(60, 122),],
    treePine3: [new Vector2D(48, 191), new Vector2D(36, 188), new Vector2D(40, 181), new Vector2D(39, 103), new Vector2D(21, 110), new Vector2D(7, 90), new Vector2D(32, 30), new Vector2D(50, 20), new Vector2D(64, 29), new Vector2D(87, 60), new Vector2D(86, 100), new Vector2D(57, 112), new Vector2D(57, 180), new Vector2D(60, 188),],
    treePine1v2: [new Vector2D(49, 159), new Vector2D(36, 156), new Vector2D(39, 149), new Vector2D(39, 89), new Vector2D(19, 94), new Vector2D(5, 75), new Vector2D(6, 51), new Vector2D(47, 6), new Vector2D(84, 43), new Vector2D(87, 67), new Vector2D(84, 85), new Vector2D(56, 96), new Vector2D(55, 148), new Vector2D(61, 153),],
    treePine2v2: [new Vector2D(49, 127), new Vector2D(36, 124), new Vector2D(39, 117), new Vector2D(39, 89), new Vector2D(19, 94), new Vector2D(5, 75), new Vector2D(6, 51), new Vector2D(47, 6), new Vector2D(84, 43), new Vector2D(87, 67), new Vector2D(84, 85), new Vector2D(56, 96), new Vector2D(55, 116), new Vector2D(61, 121),],
}

class Tree extends ExtendedProp {
    constructor(name, position, animations, canvasName, drawIndex = 0) {
        super(name, position, animations, canvasName, drawIndex);
        this.isVisible = true;
        this.currentAnimation = undefined;
        this.shadow = undefined;
        this.life = 100;
        this.isStump = false;
    }

    GameBegin() {
        if (TreeCollisions[this.canvasName] !== undefined) {
            let tempArr = TreeCollisions[this.canvasName];
            super.GameBegin(
                tempArr.CloneObjects(),
                new Vector2D(0, 0),
                new Vector2D(CanvasDrawer.GCD.canvasAtlases[this.canvasName].width, CanvasDrawer.GCD.canvasAtlases[this.canvasName].height),
                new Vector2D(0, 0),
                true
            );
        }
    }

    Delete() {
        super.Delete();
        this.currentAnimation = undefined;

        let treePosition = this.BoxCollision.GetCenterPosition().Clone();
        let logsCount = CMath.RandomInt(1, 3);

        for (let i = 0; i < logsCount; i++) {
            let newLog = new ItemProp(
                'birchLog',
                new Vector2D(treePosition.x + CMath.RandomInt(-50, 50), treePosition.y + CMath.RandomInt(-50, 50)),
                new CAnimation('null', new Vector2D(5, 0), new Vector2D(5, 0), 32, 32, AnimationType.Single, 1),
                'farmingfishing'
            );
            newLog.GameBegin();
        }
    }

    Stump() {
        let treePosition = this.BoxCollision.GetCenterPosition().Clone();
        let logsCount = CMath.RandomInt(1, 5);

        for (let i = 0; i < logsCount; i++) {
            let newLog = new ItemProp(
                'birchLog',
                new Vector2D(treePosition.x + CMath.RandomInt(-50, 50), treePosition.y + CMath.RandomInt(-50, 50)),
                new CAnimation('null', new Vector2D(5, 0), new Vector2D(5, 0), 32, 32, AnimationType.Single, 1),
                'farmingfishing'
            );
            newLog.GameBegin();
        }

        this.life = 250;
        this.isStump = true;

        let newStumpPosition = this.BoxCollision.GetRealCenterPosition();
        newStumpPosition.y -= 16;
        newStumpPosition.Ceil();
        this.BoxCollision.Delete();
        this.BlockingCollision.position.y += this.BlockingCollision.size.y /= 2;
        this.BoxCollision = new BoxCollision(newStumpPosition.Clone(), new Vector2D(32, 32), false, this, true);
        this.shadow.Delete();

        this.drawingOperation.Delete();
        this.drawingOperation = undefined;

        window.requestAnimationFrame(() => this.CreateStump());
    }

    CreateStump() {
        if (this.drawingOperation !== undefined) {
            window.requestAnimationFrame(() => this.CreateStump());
            return;
        }

        this.CreateDrawOperation(
            { x: 23, y: 18, w: 32, h: 32 },
            this.BoxCollision.position.Clone(),
            false,
            CanvasDrawer.GCD.canvasAtlases['terrain'].canvas,
            OperationType.gameObjects
        );
    }

    OnHit(damage, source) {
        this.life -= damage;
        super.OnHit(source);

        if (this.life <= 0 && this.isStump === false) {
            this.Stump();
        } else if (this.life <= 0 && this.isStump === true) {
            this.Delete();
        }
    }
}

export { Tree };