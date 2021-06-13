import { InputHandler } from './inputEvents.js';
import { Hoe, Shovel } from './inventory.js';
import { Cobject } from './object.js';
import { character } from './masterObject.js';

class GameToolbar extends Cobject {
    static GGT = new GameToolbar();

    constructor() {
        super();
        this.toolbar = document.getElementById('game-gui-toolbar');
        this.toolbar.addEventListener('click', this);
        this.activeToolbar;
        this.toolbarItems = [];
        this.didToolbarChange = false;
    }


    FixedUpdate() {
        if (this.didToolbarChange === true) {
            this.DisplayToolbar();
        }

        super.FixedUpdate();
    }

    SetActiveToolbar(element) {
        if (this.activeToolbar !== undefined)
            this.activeToolbar.classList.remove('toolbar-item-active');

        if (this.activeToolbar == element) {
            this.activeToolbar.classList.remove('toolbar-item-active');
            this.activeToolbar = undefined;
            character.activeItem = undefined;
        } else {
            element.classList.add('toolbar-item-active');
            this.activeToolbar = element;
            character.activeItem = this.toolbarItems[element.querySelector('label.toolbar-item-text').innerText - 1];
        }
    }

    DisplayToolbar() {
        for (let i = 0; i < this.toolbarItems.length; i++) {

            let div = this.toolbar.children[i].querySelector('div.toolbar-item-sprite');
            div.style.backgroundPosition = '-' + (this.toolbarItems[i].sprite.x * this.toolbarItems[i].sprite.z) * 1.35 + 'px -' + (this.toolbarItems[i].sprite.y * this.toolbarItems[i].sprite.a) * 1.5 + 'px';
            div.style.backgroundSize = this.toolbarItems[i].atlas.x * 1.35 + 'px ' + this.toolbarItems[i].atlas.y * 1.5 + 'px';
            div.style.backgroundImage = 'url(' + this.toolbarItems[i].url + ')';
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

GameToolbar.GGT.toolbarItems = [
    new Shovel('shovel', 1),
    new Hoe('hoe', 1),
];
GameToolbar.GGT.didToolbarChange = true;

InputHandler.GIH.AddListener(GameToolbar.GGT);

export { GameToolbar };