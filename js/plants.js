import { CMath } from './customMath.js';
import { Prop } from './props.js';
import { Inventory, Item } from './inventory.js'; 
import { CanvasDrawer } from './customDrawer.js';
import { MasterObject } from './masterObject.js';

class PlantData {
    constructor(growthSpeed, regrowthSpeed, gatherRange = { low: 1, high: 4 }, plantIcon = new CanvasSprite(29, 10, 32, 32, 'fruitsveggies', true)) {
        this.growthSpeed = growthSpeed;
        this.growth = 0;
        this.regrowthSpeed = regrowthSpeed;
        this.gatherRange = gatherRange;
        this.hasFinishedGrowing = false;
        this.hasBeenPicked = false;
        this.plantIcon = plantIcon;
    }
}

class Plant extends Prop {
    constructor(spriteSheet, name, position, animations, plantData) {
        super(spriteSheet, name, position, animations);
        this.plantData = plantData;
        this.currentAnimation = this.animations.seed.Clone();
    }

    CheckGrowth() {
        this.growthSpeed
    }

    PlayAnimation() {
        if (this.currentAnimation !== undefined) {
            if (this.animations.grow !== undefined && this.currentAnimation.name === 'picked' && this.currentAnimation.animationFinished === true)
                this.currentAnimation = this.animations.grow.Clone();

            let frame = this.currentAnimation.GetFrame();

            if ((this.currentAnimation.name === 'grow' || this.currentAnimation.name === 'seed') && this.currentAnimation.animationFinished === true)
                this.plantData.hasFinishedGrowing = true;

            if (frame !== null) {
                CanvasDrawer.GCD.AddDrawOperation(this.CreateDrawOperation(frame, this.position, false, this.canvas));
            }
        }
    }

    FixedUpdate() {
        super.FixedUpdate();

        this.PlayAnimation();
    }

    PlantGathered(otherObject) {
        if (this.plantData.hasFinishedGrowing === true && this.CheckInRange(otherObject.position, 30.0) === true) {
            let gatherAmount = CMath.RandomInt(this.plantData.gatherRange.low, this.plantData.gatherRange.high);
            otherObject.inventory.AddItem(new Item(this.name, gatherAmount));
            this.plantData.hasFinishedGrowing = false;
            this.plantData.hasBeenPicked = true;

            if (this.animations.picked !== undefined) {
                this.currentAnimation = this.animations.picked.Clone();
            } else if (this.animations.grow !== undefined) {
                this.currentAnimation = this.animations.grow.Clone();
            }

            CanvasDrawer.GCD.UIDrawer.DrawUIElement(this.plantData.plantIcon, '+' + gatherAmount, this.position);
        }
    }

    CEvent(eventType, otherObject, key, data) {
        switch (eventType) {
            case 'use':
                this.PlantGathered(otherObject);
                break;
        }
    }
}

export { Plant, PlantData };