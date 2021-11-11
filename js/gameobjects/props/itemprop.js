import { Vector2D, ExtendedProp } from '../../internal.js';
//import { Vector2D } from '../../classes/vectors.js';

class ItemProp extends ExtendedProp {
    constructor(name, position, animations, canvasName, drawIndex = 0, item = undefined) {
        super(name, position, animations, canvasName, drawIndex);
        this.isVisible = true;
        this.currentAnimation = animations.Clone();
        this.shadow = undefined;
        this.life = 100;
        this.item = item;
        this.amount = item !== undefined ? item.GetAmount() : 0;
    }

    GameBegin() {
        super.GameBegin(undefined, this.position.Clone(), new Vector2D(32, 32), this.currentAnimation.GetFrame(), false);
    }

    Delete() {
        super.Delete();
        this.item = undefined;
        this.currentAnimation = undefined;
    }

    OnHit(damage, source) {
        this.life -= damage;
        super.OnHit(source);

        if (this.life <= 0) {
            this.Delete();
        }
    }

    PickupItem(otherObject) {
        if (otherObject.inventory !== undefined) {
            this.isVisible = false;

            if (this.item !== undefined)
                otherObject.inventory.AddItem(this.item);
            else {
                otherObject.inventory.AddNewItem(`${this.name}`);
            }

            window.requestAnimationFrame(() => this.Delete());
        }
    }

    CEvent(eventType, otherObject) {
        switch (eventType) {
            case 'use':
                if (this.isVisible === true)
                    this.PickupItem(otherObject);
                break;
        }
    }
}

export { ItemProp };