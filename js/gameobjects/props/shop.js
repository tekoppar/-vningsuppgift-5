/* import { CFrame } from '../../animations/animations.js';
import { CanvasDrawer } from '../../drawers/canvas/customDrawer.js';
import { OperationType } from '../../drawers/canvas/operation.js';
import { InputHandler } from '../../eventHandlers/inputEvents.js';
import { Item } from '../items/item.js';
import { Prop } from '../props/props.js';
import { Vector2D } from '../../classes/vectors.js';
import { GUI } from '../../gui/gui.js';
import { HTMLInfo } from '../../gui/htmlinfo.js';
import { PolygonCollision } from '../collision/collision.js'; */

import { CFrame, CanvasDrawer, OperationType, InputHandler, Item, Prop, Vector2D, GUI, HTMLInfo, PolygonCollision } from '../../internal.js'; 

let ShopCollisions = {
    seedShop: [new Vector2D(0, 0), new Vector2D(95, 0), new Vector2D(95, 105), new Vector2D(0, 105)],
    seedShopBlocking: [new Vector2D(1, 104), new Vector2D(0, 85.33333333333333), new Vector2D(95, 85.33333333333333), new Vector2D(95, 104) ],
}

class MarketItem extends Item {
    constructor(itemCost, itemAmount, itemName) {
        super(itemName, itemAmount);
        this.itemCost = itemCost;
    }
}

class Shop extends Prop {
    constructor(shopName, position, animations, canvasName) {
        super(shopName, position, animations, canvasName);
        this.marketItems = {};
        this.isVisible = true;
        this.shopHTML;
        this.shopHTMLList;
        this.shopAmountHTML = undefined;
        this.didShopChange = false;
        this.shopSetupDone = false;
        this.currentAnimation = undefined;// this.animations.idle;
        this.shopSpriteSize = new Vector2D(32, 32);
        this.selectedShopItem = undefined;
        this.selectedShopHTML = undefined;
        this.gameObjectUsing = undefined;
        this.shopHTMLInfo;
        this.valueAmount = '';
    }

    AddItem(item) {
        if (this.marketItems[item.name] !== undefined) {
            this.marketItems[item.name].AddAmount(item.amount);
        } else {
            item.marketItems = this;
            this.marketItems[item.name] = item;
        }
        this.didShopChange = true;
    }

    AddItems(items) {
        for (let item of items) {
            this.AddItem(item);
        }
    }

    RemoveItem(item) {
        if (this.marketItems[item.name] !== undefined) {
            delete this.marketItems[item.name];
            this.didShopChange = true;
        }
    }

    PlayAnimation() {
        super.PlayAnimation();
    }

    SetupMarket() {
        //if (document.getElementById('game-panel') !== null && CanvasDrawer.GCD.canvasAtlases[this.canvasName] !== undefined && CanvasDrawer.GCD.canvasAtlases[this.canvasName].canvas !== undefined) {
            this.shopHTML = GUI.CreateContainer();
            this.shopHTML.addEventListener('mouseup', this);

            let eventContainer = GUI.CreateContainer();
            this.shopAmountHTML = GUI.CreateInput();
            this.shopAmountHTML.children[0].addEventListener('input', this);

            let buttonBuy = GUI.CreateButton('Buy');
            buttonBuy.classList.add('shop-buy');

            let buttonSell = GUI.CreateButton('Sell');
            buttonSell.classList.add('shop-sell');

            let buttoncontainer = GUI.CreateContainer(false);
            eventContainer.appendChild(this.shopAmountHTML);
            buttoncontainer.appendChild(buttonBuy);
            buttoncontainer.appendChild(buttonSell);
            eventContainer.appendChild(buttoncontainer);

            let template = document.getElementById('game-panel');
            let clone = template.content.cloneNode(true);
            this.shopHTMLList = clone.querySelector('div.panel-middle');

            this.shopHTMLInfo = new HTMLInfo();
            this.shopHTMLInfo.CreateHTML();
            clone.children[0].appendChild(this.shopHTMLInfo.parentContainer);

            this.shopHTML.appendChild(clone);
            this.shopHTML.appendChild(eventContainer);
            document.getElementById('game-gui').appendChild(this.shopHTML);

            this.shopSpriteSize = new Vector2D(CanvasDrawer.GCD.canvasAtlases[this.canvasName].width, CanvasDrawer.GCD.canvasAtlases[this.canvasName].height);
            this.CreateDrawOperation(
                new CFrame(
                    0,
                    0,
                    this.shopSpriteSize.x,
                    this.shopSpriteSize.y
                ),
                this.position,
                false,
                CanvasDrawer.GCD.canvasAtlases[this.canvasName].canvas,
                OperationType.gameObjects
            );
            this.BoxCollision.size = this.shopSpriteSize.Clone();
            this.shopHTML.style.top = (this.position.y - 352) + 'px';
            this.shopHTML.style.left = (this.position.x + 32) + 'px';

            this.NewCollision(new PolygonCollision(
                this.position.Clone(),
                this.size.Clone(),
                ShopCollisions[this.name],
                false,
                this,
                true
            ));

            this.BlockingCollision = new PolygonCollision(
                this.position.Clone(),
                this.size.Clone(),
                ShopCollisions[this.name + 'Blocking'],
                true,
                this,
                true
            );
            this.BlockingCollision.UpdatePoints();

            this.shopSetupDone = true;
    }

    DisplayShop() {
        let keys = Object.keys(this.marketItems);
        this.shopHTMLList.innerHTML = '';
        for (let i = 0; i < keys.length; i++) {
            let template = document.getElementById('inventory-panel-item');
            let clone = template.content.cloneNode(true);

            let div = clone.querySelector('div.inventory-item-sprite');
            div.style.backgroundPosition = '-' + (this.marketItems[keys[i]].sprite.x * this.marketItems[keys[i]].sprite.z) * 1.35 + 'px -' + (this.marketItems[keys[i]].sprite.y * this.marketItems[keys[i]].sprite.a) * 1.5 + 'px';
            div.style.backgroundSize = this.marketItems[keys[i]].atlas.x * 1.35 + 'px ' + this.marketItems[keys[i]].atlas.y * 1.5 + 'px';
            div.style.backgroundImage = 'url(' + this.marketItems[keys[i]].url + ')';

            clone.children[0].addEventListener('mouseenter', this);
            clone.children[0].addEventListener('mouseleave', this);

            if (this.marketItems[keys[i]].amount > 0)
                clone.querySelector('label.inventory-item-text').innerHTML = this.marketItems[keys[i]].GetAmount();

            clone.querySelector('div.inventory-item').dataset.shopItem = this.marketItems[keys[i]].name;
            this.shopHTMLList.appendChild(clone);
        }

        this.didShopChange = false;
    }

    HasItem(item, amount) {
        return this.marketItems[item.name] !== undefined && this.marketItems[item.name].amount >= amount;
    }

    BuyItem(item, amount) {
        if (this.HasItem(item, amount) && this.gameObjectUsing.inventory.HasMoney(item.value * amount) === true) {
            item.RemoveAmount(Number(amount));
            this.gameObjectUsing.inventory.SubtractMoney(Number(item.value * amount));
            this.gameObjectUsing.inventory.AddItem(Reflect.construct(item.constructor, [item.name, Number(amount)]));
            this.didShopChange = true;
        }
    }

    SellItem(item, amount) {
        if (this.marketItems[item.name] === undefined) {
            this.marketItems[item.name] = Reflect.construct(item.constructor, [item.name, Number(amount)]);
        } else {
            this.marketItems[item.name].AddAmount(Number(amount));
        }

        this.gameObjectUsing.inventory.AddMoney(Number(item.value * amount));
        this.gameObjectUsing.inventory.RemoveItem(new Item(this.gameObjectUsing.inventory.selectedItem.name, Number(this.shopAmountHTML.firstElementChild.value)));
        this.didShopChange = true;
    }

    GameBegin() {
        super.GameBegin();
        this.SetupMarket();
    }

    FixedUpdate() {
        if (this.didShopChange === true && this.shopSetupDone === true) {
            this.DisplayShop();
        }
        if (this.gameObjectUsing !== undefined) {
            if (this.position.CheckInRange(this.gameObjectUsing.position, 75.0) === false) {
                this.ShowShop();
                this.gameObjectUsing = undefined;
            }
        }

        super.FixedUpdate();
    }

    ShowShop(visibility = this.isVisible) {
        this.shopHTML.style.visibility = (visibility === true ? 'visible' : 'hidden');
        this.isVisible = !visibility;

        if (this.isVisible == true) {
            this.shopHTMLInfo.RemoveHovered();
            this.shopHTMLInfo.RemoveSelect();
            InputHandler.GIH.AddListener(this);
        } else {
            InputHandler.GIH.RemoveListener(this);
        }
    }

    CEvent(eventType, key, data) {
        switch (eventType) {
            case 'use':
                if (this.BoxCollision.CheckInCenterRangeB(key.BoxCollision, 75.0) === true) {
                    this.ShowShop();
                    key.inventory.ShowInventory(!this.isVisible);
                    this.gameObjectUsing = this.isVisible === false ? key : undefined;
                }
                break;
        }
    }

    handleEvent(e) {
        switch (e.type) {
            case 'mouseup':
                if (e.target.classList.contains('inventory-item') === true) {
                    if (this.selectedShopHTML !== undefined) {
                        this.shopHTMLInfo.RemoveSelect();
                        this.selectedShopHTML.classList.remove('toolbar-item-active');
                        this.selectedShopItem = undefined;
                    }

                    if (this.selectedShopHTML == e.target) {
                        this.selectedShopHTML.classList.remove('toolbar-item-active');
                        this.shopHTMLInfo.RemoveSelect();
                        this.selectedShopHTML = undefined;
                        this.selectedShopItem = undefined;
                    } else {
                        e.target.classList.add('toolbar-item-active');
                        this.selectedShopItem = this.marketItems[e.target.dataset.shopItem];
                        this.shopHTMLInfo.AddSelect(this.selectedShopItem.GetHTMLInformation());
                        this.selectedShopHTML = e.target;
                    }

                } else if (e.target.classList.contains('shop-buy') === true) {
                    if (this.selectedShopItem !== undefined && this.gameObjectUsing !== undefined) {
                        this.BuyItem(this.selectedShopItem, this.shopAmountHTML.firstElementChild.value);
                    }
                } else if (e.target.classList.contains('shop-sell') === true) {
                    if (this.gameObjectUsing !== undefined && this.gameObjectUsing.inventory.selectedItem !== undefined && this.gameObjectUsing.inventory.selectedItem.HasAmount(this.shopAmountHTML.firstElementChild.value) === true) {
                        this.SellItem(this.gameObjectUsing.inventory.selectedItem, this.shopAmountHTML.firstElementChild.value);
                    }
                }
                break;

            case 'mouseenter':
                if (e.target.classList.contains('inventory-item') === true) {
                    let hoveredItem = this.marketItems[e.target.dataset.shopItem];
                    this.shopHTMLInfo.AddHovered(hoveredItem.GetHTMLInformation());
                }
                break;
            case 'mouseleave':
                if (e.target.classList.contains('inventory-item') === true) {
                    this.shopHTMLInfo.RemoveHovered();
                }
                break;

            case 'input':
                if (isNaN(e.data) === true) {
                    this.shopAmountHTML.children[0].value = this.valueAmount;
                } else {
                    this.valueAmount = e.target.value;
                }
                break;
        }
    }
}

export { Shop, MarketItem };