import { Item } from './item.js';
import { plantAnimations } from './AllAnimations.js';
import { Plant, AllPlantData } from './plants.js';
import { CollisionHandler } from './collision.js';
import { CustomEventHandler } from './customEvents.js';
import { GUI } from './gui.js';
import { Vector2D } from './vectors.js';
import { CanvasDrawer } from './customDrawer.js';

class Seed extends Item {
    constructor(name, amount, seedType) {
        super(name, amount);
        this.SeedType = seedType;
    }

    UseItem(ownerCollision) {
        let overlap = CollisionHandler.GCH.GetOverlap(ownerCollision);

        if (overlap === false && ownerCollision.CheckInRange(ownerCollision.collisionOwner.BoxCollision, 64)) {

            let checkPos = ownerCollision.collisionOwner.BoxCollision.position.Clone();
            checkPos.ToGrid(32);
            let tiles = CanvasDrawer.GCD.GetTileAtPosition(checkPos, false);

            for (let tile of tiles) {
                if (tile.tile.tileSet !== 'soilTiled' && tile.tile.tileSet !== 'soilTiledCorner')
                    return
            }

            let plantPos = ownerCollision.GetCenterTilePosition();
            let plantName = this.name.replace('Seed', '');
            plantPos.SnapToGrid(32);
            let newPlant = new Plant("/content/sprites/crops.png", 'crops', plantName, plantPos, plantAnimations[plantName], AllPlantData[plantName]);
            CustomEventHandler.AddListener(newPlant);

            super.UseItem(ownerCollision);
        }
    }

    GetHTMLInformation() {
        super.GetHTMLInformation();
        let sprite = GUI.CreateSprite(this);
        sprite.style.alignSelf = 'center';
        return [sprite, GUI.CreateParagraph(this.GetRealName()), GUI.CreateParagraph('Amount: ' + this.amount),  GUI.CreateParagraph('Cost: ' + this.value)];
    }
}

export { Seed };