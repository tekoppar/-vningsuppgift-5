//import { GUI } from '../gui/gui.js';

import { GUI } from '../internal.js';

class HTMLInfo {
    constructor() {
        this.parentContainer;
        this.selectedItemHTML;
        this.hoveredHTML;
        this.selectedContainerHTML;
        this.hoveredContainerHTML;

        this.CreateHTML();
    }

    CreateHTML() {
        this.parentContainer = document.createElement('div');
        this.parentContainer.style.position = 'absolute';
        this.parentContainer.style.left = '105%';
        this.parentContainer.style.display = 'flex';
        this.parentContainer.style.flexDirection = 'column';

        this.selectedItemHTML = GUI.CreateLabel("Selected Item");
        this.hoveredHTML = GUI.CreateLabel("Hovered Item");

        let template = document.getElementById('gameui-panel');
        let clone = template.content.cloneNode(true);
        this.selectedContainerHTML = clone.children[0];
        clone = template.content.cloneNode(true);
        this.hoveredContainerHTML = clone.children[0];

        this.hoveredContainerHTML.querySelector('div.panel-middle').style.padding = this.selectedContainerHTML.querySelector('div.panel-middle').style.padding = '0px 5px 0px 5px';
        this.hoveredContainerHTML.querySelector('div.panel-middle').style.justifyContent = this.selectedContainerHTML.querySelector('div.panel-middle').style.justifyContent = 'flex-start';
        this.hoveredContainerHTML.querySelector('div.panel-middle').style.width = this.selectedContainerHTML.querySelector('div.panel-middle').style.width = '100%';

        this.selectedContainerHTML.querySelector('div.panel-middle').appendChild(this.selectedItemHTML);
        this.hoveredContainerHTML.querySelector('div.panel-middle').appendChild(this.hoveredHTML);

        this.parentContainer.appendChildren([this.selectedContainerHTML, this.hoveredContainerHTML]);

        this.RemoveSelect();
        this.RemoveHovered();
    }

    AddSelect(html) {
        this.selectedContainerHTML.querySelector('div.panel-middle').appendChildren(html);
        this.selectedContainerHTML.style.visibility = 'visible';
    }

    AddHovered(html) {
        this.hoveredContainerHTML.querySelector('div.panel-middle').appendChildren(html);
        this.hoveredContainerHTML.style.visibility = 'visible';
    }

    RemoveSelect() {
        this.selectedContainerHTML.querySelector('div.panel-middle').innerHTML = this.selectedItemHTML.outerHTML;
        this.selectedContainerHTML.style.visibility = 'collapse';
    }

    RemoveHovered() {
        this.hoveredContainerHTML.querySelector('div.panel-middle').innerHTML = this.hoveredHTML.outerHTML;
        this.hoveredContainerHTML.style.visibility = 'collapse';
    }
}

export { HTMLInfo };