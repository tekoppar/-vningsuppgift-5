/* import { Cobject } from '../../classes/baseClasses/object.js';
import { Item, Shovel, Hoe } from '../items/item.js';
import { InputHandler } from '../../eventHandlers/inputEvents.js';
import { GameToolbar } from '../../gui/toolbar.js';
import { GUI } from '../../gui/gui.js';
import { CanvasDrawer } from '../../drawers/canvas/customDrawer.js';
import { Vector2D, Vector4D } from '../../classes/vectors.js';
import { ItemProp } from '../../gameobjects/props/itemprop.js';
import { CAnimation, AnimationType } from '../../animations/animations.js';
import { CMath } from '../../classes/math/customMath.js';
import { MasterObject } from '../../classes/masterObject.js'; */

import { Cobject, Item, Shovel, Hoe, InputHandler, GameToolbar, GUI, CanvasDrawer, Vector2D, Vector4D, ItemProp, CAnimation, AnimationType, CMath, MasterObject } from '../../internal.js';

class Inventory extends Cobject {
    constructor(owner) {
        super();
        this.inventory = { };
        this.characterOwner = owner;
        this.isVisible = false;
        this.inventoryHTML;
        this.inventoryHTMLList;
        this.inventoryHTMLValue;
        this.didInventoryChange = false;
        this.inventorySetupDone = false;
        this.selectedItem = undefined;
        this.moneyAmount = 0;
    }

    SetupInventory() {
        if (document.getElementById('inventory-panel') !== null) {
            this.inventoryHTML = GUI.CreateContainer();

            let template = document.getElementById('inventory-panel');
            let clone = template.content.cloneNode(true);
            this.inventoryHTMLList = clone.querySelector('div.panel-middle');
            this.inventoryHTMLList.addEventListener('click', this);

            this.inventoryHTML.setAttribute('droppable', true);
            this.inventoryHTML.addEventListener('drop', this);
            this.inventoryHTML.addEventListener('dragover', this);
            window.addEventListener('dragend', this);
            this.inventoryHTMLValue = clone.querySelector('input.inventory-input-value');

            this.inventoryHTML.appendChild(clone);
            document.getElementById('game-gui').appendChild(this.inventoryHTML);

            InputHandler.GIH.AddListener(this);
            this.inventorySetupDone = true;
        } else
            window.requestAnimationFrame(() => this.SetupInventory());
    }

    HasMoney(amount) {
        return this.moneyAmount !== 0 && this.moneyAmount >= amount;
    }

    SubtractMoney(amount) {
        this.moneyAmount -= amount;

        if (this.inventoryHTMLValue !== undefined)
            this.inventoryHTMLValue.value = this.moneyAmount;
    }

    AddMoney(amount) {
        this.moneyAmount += amount;

        if (this.inventoryHTMLValue !== undefined)
            this.inventoryHTMLValue.value = this.moneyAmount;
    }

    AddItem(item) {
        if (this.inventory[item.name] !== undefined) {
            this.inventory[item.name].AddAmount(Number(item.amount));
        } else {
            item.inventory = this;
            this.inventory[item.name] = item;
        }
        this.didInventoryChange = true;
    }

    AddNewItem(name, amount = 0) {
        if (this.inventory[name] === undefined) {
            let newItem = new Item(name, 0);

            if (newItem.isStackable === true)
                newItem.AddAmount(1);

            this.AddItem(newItem);
        } else {
            this.inventory[name].AddAmount(1);
            this.didInventoryChange = true;
        }
    }

    RemoveItem(item) {
        if (this.inventory[item.name] !== undefined) {
            if (this.inventory[item.name].GetAmount() > 1)
                this.inventory[item.name].RemoveAmount(Number(item.amount));

            if (this.inventory[item.name].GetAmount() <= 1) {
                delete this.inventory[item.name];
                GameToolbar.RemoveToolbarItem(item);
            }
        } else {
            delete this.inventory[item.name];
            GameToolbar.RemoveToolbarItem(item);
        }
        this.didInventoryChange = true;
    }

    DropItem(item) {
        if (this.inventory[item.name] !== undefined) {
            delete this.inventory[item.name];
            GameToolbar.RemoveToolbarItem(item);
            this.didInventoryChange = true;
        }
    }

    DisplayInventory() {
        let keys = Object.keys(this.inventory);
        this.inventoryHTMLList.innerHTML = '';
        for (let i = 0; i < keys.length; i++) {
            let template = document.getElementById('inventory-panel-item');
            let clone = template.content.cloneNode(true);

            if (this.inventory[keys[i]] !== null) {

                let div = clone.querySelector('div.inventory-item-sprite');
                div.style.backgroundPosition = '-' + (this.inventory[keys[i]].sprite.x * this.inventory[keys[i]].sprite.z) * 1.35 + 'px -' + (this.inventory[keys[i]].sprite.y * this.inventory[keys[i]].sprite.a) * 1.5 + 'px';
                div.style.backgroundSize = this.inventory[keys[i]].atlas.x * 1.35 + 'px ' + this.inventory[keys[i]].atlas.y * 1.5 + 'px';
                div.style.backgroundImage = 'url(' + this.inventory[keys[i]].url + ')';

                if (this.inventory[keys[i]].amount > 0)
                    clone.querySelector('label.inventory-item-text').innerHTML = this.inventory[keys[i]].GetAmount();

                clone.querySelector('div.inventory-item').dataset.inventoryItem = this.inventory[keys[i]].name;
                clone.querySelector('div.inventory-item').setAttribute('draggable', true);
                clone.querySelector('div.inventory-item').addEventListener('dragstart', this);
                this.inventoryHTMLList.appendChild(clone);
            }
        }

        this.didInventoryChange = false;
    }

    ShowInventory(visibility = !this.isVisible) {
        this.inventoryHTML.style.visibility = (visibility === true ? 'visible' : 'hidden');
        this.isVisible = visibility;
        this.inventoryHTMLValue.value = this.moneyAmount;
        this.selectedItem = undefined;
    }

    FixedUpdate() {
        if (this.didInventoryChange === true && this.inventorySetupDone === true) {
            this.DisplayInventory();
        }

        super.FixedUpdate();
    }

    CEvent(eventType, key, data) {
        switch (eventType) {
            case 'input':
                if ((key === 'i' || key === 'tab') && data.eventType === 2) {
                    this.ShowInventory();
                }
                break;
        }
    }

    handleEvent(e) {
        switch (e.type) {
            case 'click':
                if (e.target.classList.contains('inventory-item') === true) {
                    this.selectedItem = this.inventory[e.target.dataset.inventoryItem];
                }
                break;

            case 'dragend':
                if (e.dataTransfer.dropEffect === 'none') {
                    let canvasBB = CanvasDrawer.GCD.mainCanvas.getBoundingClientRect();
                    canvasBB = new Vector4D(canvasBB.x, canvasBB.y, canvasBB.width, canvasBB.height);
                    let mousePos = MasterObject.MO.playerController.MouseToScreen({target: CanvasDrawer.GCD.mainCanvas, x: e.screenX, y: e.screenY - 80});
                    let characterPos = this.characterOwner.BoxCollision.GetRealCenterPosition();

                    if (mousePos.Distance(characterPos) > 72)
                        mousePos = characterPos.LerpValue(mousePos, 72);

                    if (canvasBB.Inside(mousePos)) {
                        const data = JSON.parse(e.dataTransfer.getData('text/plain'));

                        if (data.id !== undefined) {
                            let droppedItem = document.getElementById(data.id);
                            let item = Cobject.GetObjectFromUID(data.item);

                            if (item !== undefined && droppedItem !== null) {
                                droppedItem.id = '';
                                let rect = CanvasDrawer.GCD.mainCanvas.getBoundingClientRect();

                                var newDroppedItem = new ItemProp(
                                    item.name,
                                    mousePos,
                                    new CAnimation('null', item.sprite, item.sprite, 32, 32, AnimationType.Single, 1),
                                    CanvasDrawer.GCD.GetAtlas(item.url),
                                    0,
                                    item
                                );
                                newDroppedItem.GameBegin();

                                this.DropItem(item);
                                GameToolbar.RemoveToolbarItem(item);
                                this.didInventoryChange = true;
                            }
                        }
                    }
                }
                break;

            case 'dragover':
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                break;

            case 'drop':
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                break;

            case 'dragstart':
                e.target.id = 'draggingItem';
                let json = JSON.stringify({ id: e.target.id, item: this.inventory[e.target.dataset.inventoryItem].UID });
                e.dataTransfer.setData('text/plain', json);
                e.dataTransfer.dropEffect = 'copy';
                break;
        }
    }
}

export { Inventory, Item, Hoe, Shovel };