/* import { Cobject } from '../../classes/baseClasses/object.js';
import { Vector2D, Vector4D } from '../../classes/vectors.js';
import { CustomEventHandler } from '../../eventHandlers/customEvents.js';
import { CollisionHandler } from '../collision/collision.js';
import { CanvasDrawer } from '../../drawers/canvas/customDrawer.js';
import { Tile, TileType, TileF } from '../../drawers/tiles/tile.js';
import { TileLUT } from '../../drawers/tiles/TileLUT.js';
import { ItemValues } from '../items/itemValue.js'; */

import { Cobject, Vector2D, Vector4D, CustomEventHandler, CollisionHandler, CanvasDrawer, Tile, TileType, TileF, TileLUT, ItemValues } from '../../internal.js';

let inventoryItemIcons = {};

//products
Object.assign(inventoryItemIcons, {
    corn: { sprite: new Vector4D(29, 10, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    potato: { sprite: new Vector4D(0, 0, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    watermelon: { sprite: new Vector4D(22, 0, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    pumpkin: { sprite: new Vector4D(28, 0, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    bellpepperGreen: { sprite: new Vector4D(12, 0, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    bellpepperRed: { sprite: new Vector4D(13, 0, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    bellpepperOrange: { sprite: new Vector4D(14, 0, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    bellpepperYellow: { sprite: new Vector4D(15, 0, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    carrot: { sprite: new Vector4D(24, 20, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    parsnip: { sprite: new Vector4D(25, 20, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    radish: { sprite: new Vector4D(18, 5, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    beetroot: { sprite: new Vector4D(16, 15, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    garlic: { sprite: new Vector4D(23, 15, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    onionYellow: { sprite: new Vector4D(24, 15, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    onionRed: { sprite: new Vector4D(25, 15, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    onionWhite: { sprite: new Vector4D(26, 15, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    onionGreen: { sprite: new Vector4D(27, 15, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    hotPepper: { sprite: new Vector4D(11, 0, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    chiliPepper: { sprite: new Vector4D(19, 0, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    lettuceIceberg: { sprite: new Vector4D(11, 5, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    cauliflower: { sprite: new Vector4D(14, 5, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    broccoli: { sprite: new Vector4D(15, 5, 32, 32), atlas: new Vector2D(1024, 1536), url: '/content/sprites/fruits-veggies.png' },
    shovel: { sprite: new Vector4D(1, 8, 32, 32), atlas: new Vector2D(512, 512), url: '/content/sprites/items/items1.png' },
    hoe: { sprite: new Vector4D(4, 8, 32, 32), atlas: new Vector2D(512, 512), url: '/content/sprites/items/items1.png' },
    axe: { sprite: new Vector4D(5, 7, 32, 32), atlas: new Vector2D(512, 512), url: '/content/sprites/items/items1.png' },
    birchLog: { sprite: new Vector4D(5, 0, 32, 32), atlas: new Vector2D(640, 640), url: '/content/sprites/farming_fishing.png' },
});

//seeds
Object.assign(inventoryItemIcons, {
    cornSeed: { sprite: new Vector4D(28, 2, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    potatoSeed: { sprite: new Vector4D(0, 0, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    watermelonSeed: { sprite: new Vector4D(22, 0, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    pumpkinSeed: { sprite: new Vector4D(28, 0, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    bellpepperGreenSeed: { sprite: new Vector4D(12, 0, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    bellpepperRedSeed: { sprite: new Vector4D(13, 0, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    bellpepperOrangeSeed: { sprite: new Vector4D(14, 0, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    bellpepperYellowSeed: { sprite: new Vector4D(15, 0, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    carrotSeed: { sprite: new Vector4D(24, 4, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    parsnipSeed: { sprite: new Vector4D(25, 4, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    radishSeed: { sprite: new Vector4D(18, 1, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    beetrootSeed: { sprite: new Vector4D(16, 3, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    garlicSeed: { sprite: new Vector4D(23, 3, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    onionYellowSeed: { sprite: new Vector4D(24, 3, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    onionRedSeed: { sprite: new Vector4D(25, 3, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    onionWhiteSeed: { sprite: new Vector4D(26, 3, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    onionGreenSeed: { sprite: new Vector4D(27, 3, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    hotPepperSeed: { sprite: new Vector4D(11, 0, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    chiliPepperSeed: { sprite: new Vector4D(19, 0, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    lettuceIcebergSeed: { sprite: new Vector4D(11, 1, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    cauliflowerSeed: { sprite: new Vector4D(14, 1, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
    broccoliSeed: { sprite: new Vector4D(15, 1, 32, 32), atlas: new Vector2D(1024, 256), url: '/content/sprites/fruits-veggies-seeds.png' },
});

let stackableItems = {};

//products
Object.assign(stackableItems, {
    shovel: false,
    axe: false,
    hoe: false,
});

class Item extends Cobject {
    constructor(name, amount = 0) {
        super();
        this.name = name;
        this.amount = amount;
        this.sprite = inventoryItemIcons[name].sprite;
        this.atlas = inventoryItemIcons[name].atlas;
        this.url = inventoryItemIcons[name].url;
        this.isUsableItem = this.amount > 0 ? true : false;
        this.isStackable = stackableItems[this.name] === undefined ? true : stackableItems[this.name];
        this.value = ItemValues[this.name] !== undefined ? ItemValues[this.name] : 0;
        this.inventory;
    }

    Delete() {
        super.Delete();
    }

    GetRealName() {
        let realName = this.name.replace(/([A-Z])/g, ' $1');
        return realName.charAt(0).toUpperCase() + realName.slice(1, realName.length);
    }

    AddAmount(value) {
        this.amount += Number(value);
    }

    RemoveAmount(value) {
        this.amount -= Number(value);
    }

    HasAmount(amount) {
        return this.amount >= amount;
    }

    GetAmount() {
        if (this.amount < 1000)
            return this.amount;
        else if (this.amount > 1000 && this.amount < 1000000)
            return Math.floor(this.amount / 1000) + 'k';
        else if (this.amount > 1000000 && this.amount < 1000000000)
            return Math.floor(this.amount / 1000 / 1000) + 'm';
        else
            return Math.floor(this.amount / 1000 / 1000 / 1000) + 'b';
    }

    UseItem(ownerCollision) {
        this.RemoveAmount(1);
        this.inventory.didInventoryChange = true;

        if (this.amount <= 0 && this.isUsableItem === true) {
            this.inventory.RemoveItem(this);
            this.Delete();
        }
    }

    GetHTMLInformation() {

    }
}

class Hoe extends Item {
    constructor(name, amount) {
        super(name, amount);
    }

    UseItem(ownerCollision) {
        let overlap = CollisionHandler.GCH.GetOverlap(ownerCollision);

        if (overlap !== false) {
            if (overlap.collisionOwner.plantData !== undefined && ownerCollision.collisionOwner.BoxCollision.CheckInRealRange(overlap, 112)) {
                overlap.collisionOwner.Delete();
            }
        }

        if (ownerCollision.CheckInRealRange(ownerCollision.collisionOwner.BoxCollision, 112)) {
            let pos = ownerCollision.position.Clone();
            pos.Div(new Vector2D(32, 32));
            pos.Floor();
            let operations = CanvasDrawer.GCD.GetTileAtPosition(pos, false);

            for (let i = 0; i < operations.length; i++) {
                if (operations[i].tile.tileType === TileType.Ground) {
                    TileF.PaintTile(new Tile(new Vector2D(0, 0), new Vector2D(6, 18), new Vector2D(32, 32), TileLUT.terrain[18][6].transparent, 'terrain'), pos);
                    operations[i].tile.ChangeSprite(new Tile(new Vector2D(0, 0), new Vector2D(6, 18), new Vector2D(32, 32), TileLUT.terrain[18][6].transparent, 'terrain'));
                    CanvasDrawer.UpdateTerrainOperation(operations[i]);
                }
            }
        }
        CustomEventHandler.NewCustomEvent(this.name, this);
        super.UseItem(ownerCollision);
    }
}

class Shovel extends Item {
    constructor(name, amount) {
        super(name, amount);
    }

    UseItem(ownerCollision) {
        let overlap = CollisionHandler.GCH.GetOverlap(ownerCollision);

        if (overlap !== false) {
            console.log('shovelOverlap');
        }
        CustomEventHandler.NewCustomEvent(this.name, this);
        super.UseItem(ownerCollision);
    }
}

class Axe extends Item {
    constructor(name, amount) {
        super(name, amount);
    }

    UseItem(ownerCollision) {
        let overlap = CollisionHandler.GCH.GetOverlap(ownerCollision);

        if (overlap !== undefined && overlap !== false && ownerCollision.DoOverlap(overlap.collisionOwner.BlockingCollision, true)) { // ownerCollision.CheckInRealRange(ownerCollision.collisionOwner.BoxCollision, 112)) {
            console.log(overlap.collisionOwner);
            let objPrototype = Object.getPrototypeOf(overlap.collisionOwner);
            if (objPrototype.constructor.name === 'Tree') {
                overlap.OnHit(20, ownerCollision);
            }
        }
        CustomEventHandler.NewCustomEvent(this.name, this);
        super.UseItem(ownerCollision);
    }
}

export { Item, Shovel, Hoe, Axe, inventoryItemIcons };