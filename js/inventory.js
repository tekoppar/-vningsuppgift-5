import { Cobject } from './object.js';
import { Vector2D, Vector4D } from './vectors.js';
import { CustomEventHandler } from './customEvents.js';
import { CollisionHandler, BoxCollision } from './collision.js';
import { CanvasDrawer } from './customDrawer.js';
import { Tile, TileType, TileF } from './tile.js';
import { TileLUT } from './TileLUT.js';

let inventoryItemIcons = {
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
}

class Item {
    constructor(name, amount) {
        this.name = name;
        this.amount = amount;
        this.sprite = inventoryItemIcons[name].sprite;
        this.atlas = inventoryItemIcons[name].atlas;
        this.url = inventoryItemIcons[name].url;
    }

    AddAmount(value) {
        this.amount += value;
    }

    UseItem(ownerCollision) {

    }
}

class Hoe extends Item {
    constructor(name, amount) {
        super(name, amount);
    }

    UseItem(ownerCollision) {
        let overlap = CollisionHandler.GCH.GetOverlap(ownerCollision);

        if (overlap !== false) {
            console.log('hoeOverlap');
        } else {
            let pos = ownerCollision.position.Clone();
            pos.Div(new Vector2D(32, 32));
            pos.Floor();
            let operations = CanvasDrawer.GCD.GetTileAtPosition(pos, false);

            for (let i = 0; i < operations.length; i++) {
                if (operations[i].tile.tileType === TileType.Ground) {
                    TileF.PaintTile(new Tile(new Vector2D(0,0), new Vector2D(6, 18), new Vector2D(32, 32), TileLUT.terrain[18][6].transparent, 'terrain'), pos);
                    operations[i].tile.ChangeSprite(new Tile(new Vector2D(0,0), new Vector2D(6, 18), new Vector2D(32, 32), TileLUT.terrain[18][6].transparent, 'terrain'));
                }
            }
        }
        CustomEventHandler.NewCustomEvent(this.name, this);
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
    }
}

class Inventory extends Cobject {
    constructor(owner) {
        super();
        this.inventory = {};
        this.characterOwner = owner;
        this.isVisible = true;
        this.inventoryHTML;
        this.inventoryHTMLList;
        this.didInventoryChange = false;
    }

    SetupHTML() {
        if (document.getElementById('inventory-panel') !== null) {
            let template = document.getElementById('inventory-panel');
            let clone = template.content.cloneNode(true);
            this.inventoryHTMLList = clone.children[0].children[0];
            this.inventoryHTML = clone.children[0].children[1];
            document.getElementById('game-gui').appendChild(clone);
        } else
            window.requestAnimationFrame(() => this.SetupHTML());
    }

    AddItem(item) {
        if (this.inventory[item.name] !== undefined) {
            this.inventory[item.name].AddAmount(item.amount);
        } else {
            this.inventory[item.name] = item;
        }
        this.didInventoryChange = true;

        if (item.name === 'corn') {
            document.getElementById('total-corn').value = this.inventory['corn'].amount;
        }
    }

    DisplayInventory() {
        let keys = Object.keys(this.inventory);
        this.inventoryHTMLList.innerHTML = '';
        for (let i = 0; i < keys.length; i++) {
            let template = document.getElementById('inventory-panel-item');
            let clone = template.content.cloneNode(true);

            let div = clone.querySelector('div.inventory-item-sprite');
            div.style.backgroundPosition = '-' + (this.inventory[keys[i]].sprite.x * this.inventory[keys[i]].sprite.z) * 1.35 + 'px -' + (this.inventory[keys[i]].sprite.y * this.inventory[keys[i]].sprite.a) * 1.5 + 'px';
            div.style.backgroundSize = this.inventory[keys[i]].atlas.x * 1.35 + 'px ' + this.inventory[keys[i]].atlas.y * 1.5 + 'px';
            div.style.backgroundImage = 'url(' + this.inventory[keys[i]].url + ')';

            clone.querySelector('label.inventory-item-text').innerHTML = this.inventory[keys[i]].amount;
            this.inventoryHTMLList.appendChild(clone);
        }

        this.didInventoryChange = false;
    }

    FixedUpdate() {
        if (this.didInventoryChange === true) {
            this.DisplayInventory();
        }

        super.FixedUpdate();
    }

    CEvent(eventType, key, data) {
        switch (eventType) {
            case 'input':
                if (key === 'i' && data.eventType === 2) {
                    this.inventoryHTMLList.style.display = this.inventoryHTML.style.display = (this.isVisible === true ? 'flex' : 'none');
                    this.isVisible = !this.isVisible;
                }
                break;
        }
    }
}

export { Inventory, Item, Hoe, Shovel };