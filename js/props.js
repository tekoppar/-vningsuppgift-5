import { GameObject } from './gameObject.js';

class Prop extends GameObject {
    constructor(spriteSheet, name, position, animations) {
        super();
        this.spriteSheet = spriteSheet;
        this.name = name;
        this.position = position;
        this.animations = animations;
        this.currentAnimation;

        this.LoadAtlas();
    }

    FixedUpdate() {
        super.FixedUpdate();

        if (this.animation !== undefined) {
            this.PlayAnimation();
        }
    }

    PlayAnimation() {
        if (this.canvas !== undefined) {
            MasterObject.MO.canvasDrawer.AddDrawOperation(this.CreateDrawOperation(this.animation.GetFrame(), this.position, true, this.canvas));
        }
    }
}

export { Prop };