/* import { Vector2D } from '../../classes/vectors.js';
import { Tile } from '../tiles/tile.js';
import { correctMouse } from '../canvas/customDrawer.js'; */

import { Vector2D, Tile, correctMouse } from '../../internal.js';

class CanvasAtlas {
    constructor(CanvasDrawer, url, width = 0, height = 0, atlasSize = 32, name = 'default') {
        this.sprites = { };
        this.canvas;
        this.canvasCtx;
        this.img;
        this.url = url;
        this.width = width;
        this.height = height;
        this.atlasSize = atlasSize;
        this.name = name;
        this.CanvasDrawer = CanvasDrawer;

        this.LoadImage();
    }

    toJSON() {
        return {
            url: this.url,
            width: this.width,
            height: this.height,
            atlasSize: this.atlasSize,
            name: this.name
        }
    }

    GenerateSprites(width, height) {

    }

    LoadImage() {
        this.img = new Image();

        this.img.crossOrigin = "Anonymous";
        this.img.onload = () => { this.CreateOffscreenCanvas() };
        this.img.src = this.url;
    }

    CreateOffscreenCanvas() {
        this.canvas = document.createElement('canvas');
        this.width = this.canvas.width = this.img.width;
        this.height = this.canvas.height = this.img.height;
        this.canvasCtx = this.canvas.getContext('2d');
        this.canvasCtx.webkitImageSmoothingEnabled = false;
        this.canvasCtx.msImageSmoothingEnabled = false;
        this.canvasCtx.imageSmoothingEnabled = false;
        this.canvas.id = this.name;

        this.canvasCtx.drawImage(this.img, 0, 0);

        document.body.appendChild(this.canvas);
        this.canvas.addEventListener('mousedown', this);
        this.canvas.addEventListener('mouseup', this);
        this.canvas.addEventListener('click', this);

        this.startDrag = new Vector2D(0, 0);
        this.endDrag = new Vector2D(0, 0);

        this.CanvasDrawer.hasLoadedAllImages[this.name] = true;
    }

    handleEvent(e) {
        switch (e.type) {
            case 'mousedown':
                this.startDrag = e;// mouseToAtlas(e, this.atlasSize);
                break;

            case 'mouseup':
                let canvasPos = new Vector2D(this.startDrag.x, this.startDrag.y);
                this.startDrag = correctMouse(this.startDrag);
                this.startDrag.ToGrid(this.startDrag.size);
                this.endDrag = correctMouse(e);
                this.endDrag.ToGrid(this.endDrag.size);

                let calcCoords = new Vector2D(this.endDrag.x, this.endDrag.y);
                calcCoords.Sub(this.startDrag);
                calcCoords.Add({ x: 1, y: 1 });

                this.CanvasDrawer.SetSelection(
                    new Tile(
                        canvasPos,
                        new Vector2D(this.startDrag.x, this.startDrag.y),
                        new Vector2D(calcCoords.x * this.atlasSize, calcCoords.y * this.atlasSize),
                        false,
                        this.name
                    )
                );
                break;

            /*case 'click':
                let atlasCoords = mouseToAtlas(e, this.atlasSize);
 
                this.CanvasDrawer.selectedSprite = new CanvasSprite(atlasCoords.x, atlasCoords.y, this.atlasSize, this.atlasSize, this.name);
                break;*/
        }
    }
}

class CanvasAtlasObject extends CanvasAtlas {
    constructor(CanvasDrawer, url, width = 0, height = 0, atlasSize = 32, name = 'default') {
        super(CanvasDrawer, url, width, height, atlasSize, name);
    }

    handleEvent(e) {
        switch (e.type) {
            case 'mouseup':
                let canvasPos = new Vector2D(e.x, e.y);

                this.CanvasDrawer.SetSelection(
                    new Tile(
                        canvasPos,
                        new Vector2D(0, 0),
                        new Vector2D(this.width, this.height),
                        false,
                        this.name,
                        0,
                        TileType.Prop,
                        TileTerrain.Ground
                    )
                );
                break;
        }
    }
}

export { CanvasAtlas, CanvasAtlasObject };