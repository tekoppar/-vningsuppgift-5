/* import { CMath } from '../../../classes/math/customMath.js';
import { Prop } from '../props.js';
import { Item } from '../../items/item.js';
import { CanvasDrawer } from '../../../drawers/canvas/customDrawer.js';
import { CanvasSprite } from '../../../drawers/canvas/canvasSprite.js'; */

import { CMath, Prop, Item, CanvasDrawer, CanvasSprite } from '../../../internal.js'

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

    Clone() {
        return new PlantData(this.growthSpeed, this.regrowthSpeed, this.gatherRange, this.plantIcon);
    }
}

const AllPlantData = {
    corn: new PlantData(60, 600, { low: 1, high: 4 }, new CanvasSprite(29, 10, 32, 32, 'fruitsveggies', true), 0.22),
    potato: new PlantData(700, 0, { low: 5, high: 15 }, new CanvasSprite(0, 0, 32, 32, 'fruitsveggies', true), 0.28),
    watermelon: new PlantData(1300, 900, { low: 1, high: 2 }, new CanvasSprite(22, 0, 32, 32, 'fruitsveggies', true), 0.96),
    pumpkin: new PlantData(1200, 800, { low: 1, high: 3 }, new CanvasSprite(28, 0, 32, 32, 'fruitsveggies', true), 0.86),
    bellpepperGreen: new PlantData(1250, 1000, { low: 1, high: 2 }, new CanvasSprite(12, 0, 32, 32, 'fruitsveggies', true), 1.96),
    bellpepperRed: new PlantData(1450, 1250, { low: 1, high: 2 }, new CanvasSprite(13, 0, 32, 32, 'fruitsveggies', true), 2.66),
    bellpepperOrange: new PlantData(1350, 1150, { low: 1, high: 2 }, new CanvasSprite(14, 0, 32, 32, 'fruitsveggies', true), 2.21),
    bellpepperYellow: new PlantData(900, 600, { low: 1, high: 2 }, new CanvasSprite(15, 0, 32, 32, 'fruitsveggies', true), 0.56),
    carrot: new PlantData(900, 0, { low: 5, high: 8 }, new CanvasSprite(24, 20, 32, 32, 'fruitsveggies', true), 0.32),
    parsnip: new PlantData(1700, 0, { low: 2, high: 3 }, new CanvasSprite(25, 20, 32, 32, 'fruitsveggies', true), 1.49),
    radish: new PlantData(1350, 0, { low: 4, high: 7 }, new CanvasSprite(18, 5, 32, 32, 'fruitsveggies', true), 1.21),
    beetroot: new PlantData(900, 0, { low: 1, high: 3 }, new CanvasSprite(16, 15, 32, 32, 'fruitsveggies', true), 0.69),
    garlic: new PlantData(2450, 0, { low: 1, high: 18 }, new CanvasSprite(23, 15, 32, 32, 'fruitsveggies', true), 2.38),
    onionYellow: new PlantData(800, 0, { low: 1, high: 5 }, new CanvasSprite(24, 15, 32, 32, 'fruitsveggies', true), 0.42),
    onionRed: new PlantData(800, 0, { low: 1, high: 5 }, new CanvasSprite(25, 15, 32, 32, 'fruitsveggies', true), 0.86),
    onionWhite: new PlantData(800, 0, { low: 1, high: 5 }, new CanvasSprite(26, 15, 32, 32, 'fruitsveggies', true), 0.61),
    onionGreen: new PlantData(800, 0, { low: 1, high: 5 }, new CanvasSprite(27, 15, 32, 32, 'fruitsveggies', true), 1.61),
    hotPepper: new PlantData(2200, 1800, { low: 1, high: 4 }, new CanvasSprite(11, 0, 32, 32, 'fruitsveggies', true), 3.93),
    chiliPepper: new PlantData(2000, 1900, { low: 3, high: 10 }, new CanvasSprite(19, 0, 32, 32, 'fruitsveggies', true), 1.92),
    lettuceIceberg: new PlantData(1500, 1200, { low: 1, high: 1 }, new CanvasSprite(11, 5, 32, 32, 'fruitsveggies', true), 0.85),
    cauliflower: new PlantData(1700, 1500, { low: 1, high: 1 }, new CanvasSprite(14, 5, 32, 32, 'fruitsveggies', true), 1.21),
    broccoli: new PlantData(2000, 1750, { low: 10, high: 25 }, new CanvasSprite(15, 5, 32, 32, 'fruitsveggies', true), 0.31),
}

class Plant extends Prop {
    constructor(spriteSheetName, name, position, animations, plantData, drawIndex = 0) {
        super(name, position, animations, spriteSheetName, drawIndex);
        this.plantData = plantData.Clone();
        this.currentAnimation = this.animations.seed.Clone();
        this.currentAnimation.SetSpeed(this.plantData.growthSpeed);
        this.BoxCollision.size = this.currentAnimation.GetSize();
    }

    Delete() {
        super.Delete();
        this.currentAnimation = null;
        this.plantData = null;
    }

    FixedUpdate() {
        super.FixedUpdate();
    }

    CheckGrowth() {
        this.growthSpeed
    }

    PlayAnimation() {
        if (this.currentAnimation !== null && this.currentAnimation !== undefined) {
            if (this.animations !== null && this.animations.grow !== undefined && this.currentAnimation.name === 'picked' && this.currentAnimation.animationFinished === true) {
                this.currentAnimation = this.animations.grow.Clone();
                this.currentAnimation.SetSpeed(this.plantData.growthSpeed);
            }

            if ((this.currentAnimation.name === 'grow' || this.currentAnimation.name === 'seed') && this.currentAnimation.animationFinished === true)
                this.plantData.hasFinishedGrowing = true;

            super.PlayAnimation();
        }
    }

    PlantGathered(otherObject) {
        if (this.plantData.hasFinishedGrowing === true && this.plantData.hasBeenPicked === false && this.BoxCollision.GetCenterPosition().CheckInRange(otherObject.BoxCollision.GetCenterPosition(), 32.0) === true) {
            let gatherAmount = CMath.RandomInt(this.plantData.gatherRange.low, this.plantData.gatherRange.high);
            
            otherObject.inventory.AddItem(new Item(this.name, gatherAmount));
            this.plantData.hasFinishedGrowing = false;
            this.plantData.hasBeenPicked = true;

            if (this.animations.picked !== undefined) {
                this.currentAnimation = this.animations.picked.Clone();
            } else if (this.animations.grow !== undefined) {
                this.currentAnimation = this.animations.grow.Clone();
                this.plantData.hasBeenPicked = false;
            }

            let frame = this.currentAnimation.GetFrame();
            this.CreateDrawOperation(frame, this.position, true, this.canvas);
            this.currentAnimation.SetSpeed(this.plantData.growthSpeed);

            CanvasDrawer.GCD.UIDrawer.DrawUIElement(this.plantData.plantIcon, '+' + gatherAmount, this.position);
            super.NeedsRedraw(this.position);
        }
    }

    CEvent(eventType, otherObject) {
        switch (eventType) {
            case 'use':
                this.PlantGathered(otherObject);
                break;
        }
    }
}

export { Plant, PlantData, AllPlantData };