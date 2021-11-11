import { Cobject, MasterObject, Item, InputHandler } from '../internal.js';
//import { Cobject } from '../classes/baseClasses/object.js';
//import { MasterObject } from '../classes/masterObject.js';
//import { Item } from '../gameobjects/items/item.js';

class GameToolbar extends Cobject {
    static GGT = new GameToolbar();

    constructor() {
        super();
        this.toolbar = document.getElementById('game-gui-toolbar');
        this.toolbar.addEventListener('click', this);
        this.activeToolbar;
        this.toolbarItems = { };
        this.didToolbarChange = false;

        this.SetupHTML();
    }

    SetupHTML() {
        let count = this.toolbar.children.length;

        for (let i = 0; i < count; i++) {
            let div = this.toolbar.children[i];
            div.dataset.toolbarIndex = i;
            div.addEventListener('drop', this);
            div.addEventListener('dragover', this);
        }
    }

    FixedUpdate() {
        if (this.didToolbarChange === true) {
            this.DisplayToolbar();
        }

        super.FixedUpdate();
    }

    AddToolbarItem(slot, item) {
        this.toolbarItems[slot] = item;
        this.didToolbarChange = true;
    }

    static RemoveToolbarItem(item) {
        let keys = Object.keys(GameToolbar.GGT.toolbarItems);
        for (let i = 0; i < keys.length; i++) {
            if (GameToolbar.GGT.toolbarItems[keys[i]].name === item.name) {
                delete GameToolbar.GGT.toolbarItems[keys[i]];
                GameToolbar.GGT.RemoveToolbarGUIItem(keys[i]);
            }
        }
        GameToolbar.GGT.didToolbarChange = true;

        if (MasterObject.MO.playerController.playerCharacter.activeItem === item) {
            MasterObject.MO.playerController.playerCharacter.activeItem = undefined;
        }
    }

    SetActiveToolbar(element) {
        if (this.activeToolbar !== undefined)
            this.activeToolbar.classList.remove('toolbar-item-active');

        if (this.activeToolbar == element) {
            this.activeToolbar.classList.remove('toolbar-item-active');
            this.activeToolbar = undefined;
            MasterObject.MO.playerController.playerCharacter.activeItem = undefined;
        } else {
            element.classList.add('toolbar-item-active');
            this.activeToolbar = element;
            MasterObject.MO.playerController.playerCharacter.activeItem = this.toolbarItems[element.querySelector('label.toolbar-item-text').innerText - 1];
        }
    }

    RemoveToolbarGUIItem(index) {
        let div = this.toolbar.children[index].querySelector('div.toolbar-item-sprite');
        div.style.backgroundImage = 'unset';

        if (this.activeToolbar !== undefined)
            this.activeToolbar.classList.remove('toolbar-item-active');
    }

    DisplayToolbar() {
        let keys = Object.keys(this.toolbarItems);
        for (let i = 0; i < keys.length; i++) {
            let item = this.toolbarItems[keys[i]];
            let div = this.toolbar.children[keys[i]].querySelector('div.toolbar-item-sprite');
            div.style.backgroundPosition = '-' + (item.sprite.x * item.sprite.z) * 1.35 + 'px -' + (item.sprite.y * item.sprite.a) * 1.5 + 'px';
            div.style.backgroundSize = item.atlas.x * 1.35 + 'px ' + item.atlas.y * 1.5 + 'px';
            div.style.backgroundImage = 'url(' + item.url + ')';
        }

        this.didToolbarChange = false;
    }

    handleEvent(e) {
        switch (e.type) {
            case 'click':
                if (e.target.classList.contains('toolbar-item')) {
                    this.SetActiveToolbar(e.target);
                }
                break;

            case 'dragover':
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                break;

            case 'drop':
                e.preventDefault();

                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                let droppedItem = document.getElementById(data.id);
                let item = Cobject.GetObjectFromUID(data.item);

                droppedItem.id = '';
                if (item instanceof Item) {
                    this.AddToolbarItem(e.target.dataset.toolbarIndex, item);
                }
                break;
        }
    }

    CEvent(eventType, key, data) {
        switch (eventType) {
            case 'input':
                if (data.eventType == 0) {
                    switch (key) {
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                            if (MasterObject.MO.playerController.playerCharacter.inventory.isVisible === false)
                                this.SetActiveToolbar(this.toolbar.children[key - 1]);
                            break;
                    }
                } else if (data.eventType == 3) {
                    switch (key) {
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                            break;
                    }
                }
                break;
        }
    }
}

/* GameToolbar.GGT.toolbarItems = [
    new Shovel('shovel', 1),
    new Hoe('hoe', 1),
];
GameToolbar.GGT.didToolbarChange = true; */

InputHandler.GIH.AddListener(GameToolbar.GGT);

export { GameToolbar };