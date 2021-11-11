//import { CanvasDrawer } from '../canvas/customDrawer.js';

import { CanvasDrawer } from '../../internal.js';

class SelectedTileEditor {
    static GSTE = new SelectedTileEditor();

    constructor() {
        this.containerHTML;
        this.SelectedTiles;

        this.CreateSelectedTilesEditor();
    }


    CreateSelectedTilesEditor() {
        if (document.getElementById('template-selected-tiles-editor') == null) {
            window.requestAnimationFrame(() => this.CreateSelectedTilesEditor());
            return;
        }

        let clone = document.getElementById('template-selected-tiles-editor').content.cloneNode(true);

        this.containerHTML = clone.children[0];
        document.body.appendChild(clone);
    }

    SetSelectedTiles(tiles) {
        this.SelectedTiles = tiles;

        this.containerHTML.innerHTML = "";

        for (let operation of this.SelectedTiles) {
            let clone = document.getElementById('template-selected-tiles-editor-entry').content.cloneNode(true);

            let canvas = clone.querySelector('canvas.selected-tiles-editor-sprite');
            canvas.setAttribute('width', 64);
            canvas.setAttribute('height', 64);
            let ctx = canvas.getContext('2d');

            ctx.drawImage(
                operation.targetCanvas,
                operation.tile.GetPosX(),
                operation.tile.GetPosY(),
                operation.tile.size.x,
                operation.tile.size.y,
                0,
                0,
                64,
                64
            );

            clone.querySelector('label.selected-tiles-editor-atlas').innerText = operation.tile.atlas;
            clone.querySelector('label.selected-tiles-editor-position').innerText = operation.tile.position.ToString();
            clone.querySelector('label.selected-tiles-editor-tileposition').innerText = operation.tile.tilePosition.ToString();
            clone.querySelector('label.selected-tiles-editor-transparent').innerText = operation.tile.transparent;
            clone.querySelector('label.selected-tiles-editor-tileset').innerText = operation.tile.tileSet;
            clone.querySelector('label.selected-tiles-editor-tileuldr').innerText = operation.tile.tileULDR;
            clone.querySelector('label.selected-tiles-editor-tiletype').innerText = operation.tile.tileType;
            clone.querySelector('label.selected-tiles-editor-tileterrain').innerText = operation.tile.tileTerrain;

            clone.querySelector('button.selected-tiles-editor-remove').addEventListener('click', this);
            clone.querySelector('button.selected-tiles-editor-remove').dataset.index = operation.tile.GetDrawPosY() + ', ' + operation.tile.GetDrawPosX() + ', ' + this.containerHTML.children.length;
            this.containerHTML.appendChild(clone);
        }
    }

    handleEvent(e) {
        switch(e.type) {
            case 'click':
                let indexes = e.target.dataset.index.split(', ');
                CanvasDrawer.GCD.RemoveOperation(indexes[0], indexes[1], indexes[2]);
                e.target.parentNode.remove();
                break;
        }
    }
}

export { SelectedTileEditor };