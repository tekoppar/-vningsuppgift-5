/* import { Item } from '../../items/item.js';
import { plantAnimations } from '../../../animations/AllAnimations.js';
import { Plant, AllPlantData } from '../plants/plants.js';
import { CollisionHandler } from '../../collision/collision.js';
import { CustomEventHandler } from '../../../eventHandlers/customEvents.js';
import { GUI } from '../../../gui/gui.js';
import { Vector2D } from '../../../classes/vectors.js';
import { CanvasDrawer } from '../../../drawers/canvas/customDrawer.js'; */

import { Item, plantAnimations, Plant, AllPlantData, CollisionHandler, CustomEventHandler, GUI, Vector2D, CanvasDrawer } from '../../../internal.js';

class Seed extends Item {
    constructor(name, amount, seedType) {
        super(name, amount);
        this.SeedType = seedType;
    }

    UseItem(ownerCollision) {
        let overlap = CollisionHandler.GCH.GetOverlap(ownerCollision);
        let a = ownerCollision.collisionOwner.BoxCollision.GetCenterPosition();
        a.SnapToGrid(32);
        let b = ownerCollision.position.Clone();
        b.SnapToGrid(32);

        CanvasDrawer.GCD.AddDebugOperation(a, 5);
        CanvasDrawer.GCD.AddDebugOperation(b, 5, 'orange');
        if (overlap === false && a.CheckInRange(b, 96)) {

            let checkPos = ownerCollision.position.Clone();
            checkPos.ToGrid(32);
            let tiles = CanvasDrawer.GCD.GetTileAtPosition(checkPos, false);

            if (tiles !== undefined) {
                for (let tile of tiles) {
                    if (tile.tile.tileSet !== 'soilTiled' && tile.tile.tileSet !== 'soilTiledCorner')
                        return
                }

                let plantName = this.name.replace('Seed', '');
                b.y -= 32;
                let newPlant = new Plant("/content/sprites/crops.png", 'crops', plantName, b, plantAnimations[plantName], AllPlantData[plantName]);
                CustomEventHandler.AddListener(newPlant);

                super.UseItem(ownerCollision);
            }
        }
    }

    GetHTMLInformation() {
        super.GetHTMLInformation();
        let sprite = GUI.CreateSprite(this);
        sprite.style.alignSelf = 'center';
        return [sprite, GUI.CreateParagraph(this.GetRealName()), GUI.CreateParagraph('Amount: ' + this.amount), GUI.CreateParagraph('Cost: ' + this.value)];
    }
}

export { Seed };