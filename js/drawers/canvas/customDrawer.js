import { Vector2D as Vector2D, Vector as Vector, Vector4D as Vector4D } from '../../classes/vectors.js';
import { Tile, TileType, TileTerrain } from '../tiles/tile.js';
import { InputHandler } from '../../eventHandlers/inputEvents.js';
import { CollisionHandler, BoxCollision, PolygonCollision, Collision } from '../../gameobjects/collision/collision.js';
import { TileMaker } from '../tiles/tilemaker.js';
import { worldTiles } from '../tiles/worldTiles.js';
import { Brush, brushTypes } from './brush.js';
import { RectOperation, TextOperation, DrawingOperation, OperationType } from './operation.js';

let mouseToAtlasRectMap = {};
function correctMouse(event) {
    let rect;
    if (mouseToAtlasRectMap[event.target.id] === undefined) {
        rect = event.target.getBoundingClientRect();
        if (event.target.id !== undefined)
            mouseToAtlasRectMap[event.target.id] = { x: rect.x + window.scrollX, y: rect.y + window.scrollY };
    }
    else if (event.target.id !== undefined) {
        rect = { x: mouseToAtlasRectMap[event.target.id].x, y: mouseToAtlasRectMap[event.target.id].y };
        rect.x -= window.scrollX;
        rect.y -= window.scrollY;
    }
    return new Vector2D(Math.floor(event.x - rect.x), Math.floor(event.y - rect.y));
}

function MouseToScreen(event) {
    let rect;
    if (mouseToAtlasRectMap[event.target.id] === undefined) {
        rect = event.target.getBoundingClientRect();
        if (event.target.id !== undefined)
            mouseToAtlasRectMap[event.target.id] = { x: rect.x + window.scrollX, y: rect.y + window.scrollY };
    }
    else if (event.target.id !== undefined) {
        rect = { x: mouseToAtlasRectMap[event.target.id].x, y: mouseToAtlasRectMap[event.target.id].y };
        rect.x -= window.scrollX;
        rect.y -= window.scrollY;
    }
    return new Vector2D(event.x - rect.x, event.y - rect.y);
}

class CanvasSprite {
    constructor(x, y, width, height, canvas, isTransparent = undefined) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.canvas = canvas;
        this.isTransparent = isTransparent;
    }

    GetPosX() {
        return this.x * this.width;
    }

    GetPosY() {
        return this.y * this.height;
    }

    IsTransparent() {
        if (this.isTransparent == undefined) {
            let pixels = document.getElementById(this.canvas).getContext('2d').getImageData(this.GetPosX(), this.GetPosY(), this.width, this.height).data;

            for (let i = 0; i < pixels.length; i += 4) {
                if (pixels[i + 3] < 255) {
                    this.isTransparent = true;
                    return this.isTransparent;
                }
            }
        } else {
            return this.isTransparent;
        }

        this.isTransparent = false;
        return this.isTransparent;
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            canvas: this.canvas,
            isTransparent: this.isTransparent
        }
    }

    Clone() {
        return new CanvasSprite(this.x, this.y, this.width, this.height, this.canvas, this.isTransparent);
    }
}

class CanvasAtlas {
    constructor(CanvasDrawer, url, width = 0, height = 0, atlasSize = 32, name = 'default') {
        this.sprites = {};
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

class UIElement {
    constructor(lifeTime = 1) {
        this.drawingOperations = [];
        this.lifeTime = lifeTime * 60;
    }

    AddOperations() {
        for (let i = 0; i < this.drawingOperations.length; i++) {
            this.drawingOperations[i].Update();
        }
        this.lifeTime--;
    }

    RemoveUI() {
        for (let i = 0; i < this.drawingOperations.length; i++) {
            this.drawingOperations[i].Delete();
        }
    }
}

class UIDrawer {
    constructor(spriteSheet, canvasDrawer) {
        this.spriteSheet = spriteSheet;
        this.canvasDrawer = canvasDrawer;
        this.uiElements = [];
    }

    AddUIElements() {
        if (this.uiElements.length > 0) {
            for (let i = 0; i < this.uiElements.length; i++) {
                this.uiElements[i].AddOperations();
            }

            let tempUIElements = this.uiElements;
            for (let i = 0; i < tempUIElements.length; i++) {
                if (tempUIElements[i].lifeTime <= 0) {
                    tempUIElements[i].RemoveUI();
                    tempUIElements.splice(i, 1);
                    i--;
                }
            }

            this.uiElements = tempUIElements;
        }
    }

    DrawUIElement(sprite, text, position) {
        let newUiElement = new UIElement();

        newUiElement.drawingOperations.push(
            new DrawingOperation(
                new Tile(
                    new Vector2D(position.x, position.y),
                    new Vector2D(15.05, 2.6),
                    new Vector2D(42, 32),
                    false,
                    'uipieces'
                ),
                this.canvasDrawer.gameGuiCanvas,
                this.canvasDrawer.canvasAtlases['uipieces'].canvas
            )
        );
        newUiElement.drawingOperations.push(
            new DrawingOperation(
                new Tile(
                    new Vector2D(position.x + 42, position.y),
                    new Vector2D(17.05, 2.6),
                    new Vector2D(42, 32),
                    false,
                    'uipieces'
                ),
                this.canvasDrawer.gameGuiCanvas,
                this.canvasDrawer.canvasAtlases['uipieces'].canvas
            )
        );

        newUiElement.drawingOperations.push(
            new DrawingOperation(
                new Tile(
                    new Vector2D(position.x + 10, position.y),
                    new Vector2D(sprite.x, sprite.y),
                    new Vector2D(sprite.width, sprite.height),
                    false,
                    sprite.canvas
                ),
                this.canvasDrawer.gameGuiCanvas,
                this.canvasDrawer.canvasAtlases[sprite.canvas].canvas
            )
        );
        newUiElement.drawingOperations.push(
            new TextOperation(
                text,
                new Vector2D(position.x + 42, position.y + (32 / 2)),
                false,
                this.canvasDrawer.gameGuiCanvas
            )
        );
        this.uiElements.push(newUiElement);

        this.canvasDrawer.AddDrawOperations(newUiElement.drawingOperations, OperationType.gui);
    }
}

class CanvasSave {
    constructor(operations = {}, canvasDrawer) {
        this.drawingOperations = operations;
        this.CanvasDrawer = canvasDrawer;
        this.loadOperationsDone = {};

        if (window.indexedDB === undefined)
            window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
                IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction;

        this.dbVersion = 1;
        this.request = indexedDB.open("farming", this.dbVersion);
        this.db;
        this.request.addEventListener('success', this);
        this.request.addEventListener('upgradeneeded', this);
        this.jsonOperations;
    }

    createObjectStore(database) {
        //database.createObjectStore(key);
    }

    getDataFromDb(index, key) {
        let transaction = this.db.transaction([index], "readwrite");
        let get = transaction.objectStore(index).get(key);
    }

    putElephantInDb(blob, index, key = "saveData") {
        if (index !== undefined) {
            let transaction = this.db.transaction([index], "readwrite");
            let put = transaction.objectStore(index).put(blob, key);

            this.request.onerror = function (event) {
                console.log("Error creating/accessing IndexedDB database");
            };
        }
    };

    UpdateOperation(operations) {
        for (let i = 0; i < operations.length; i++) {
            if (operations[i].drawingCanvas.id === 'game-canvas') {
                if (operations[i].tile.IsTransparent() === true) {
                    this.drawingOperations[operations[i].tile.position.y / 32][operations[i].tile.position.x / 32].push(operations[i]);
                } else if (this.drawingOperations[operations[i].tile.position.y / 32] !== undefined) {
                    this.drawingOperations[operations[i].tile.position.y / 32][operations[i].tile.position.x / 32] = [];
                    this.drawingOperations[operations[i].tile.position.y / 32][operations[i].tile.position.x / 32].push(
                        new DrawingOperation(
                            operations[i].tile,
                            operations[i].drawingCanvas,
                            this.CanvasDrawer.canvasAtlases[operations[i].tile.atlas].canvas
                        )
                    );
                }

            }
        }
    }

    LoadOperations() {
        /*for (let y = 0; y < Math.ceil(this.CanvasDrawer.mainCanvas.height / 32); y++) {
            this.drawingOperations[y] = {};
            for (let x = 0; x < Math.ceil(this.CanvasDrawer.mainCanvas.width / 32); x++) {
                this.drawingOperations[y][x] = [];
            }
        }*/

        for (let y = 0; y < Math.ceil(this.CanvasDrawer.mainCanvas.height / 32); y++) {
            this.drawingOperations[y] = {};
            for (let x = 0; x < Math.ceil(this.CanvasDrawer.mainCanvas.width / 32); x++) {
                this.drawingOperations[y][x] = [];
                let transaction = this.db.transaction([y], "readwrite");
                let get = transaction.objectStore(y).get(x);

                if (this.loadOperationsDone.constructor === Object)
                    this.loadOperationsDone[y + '-' + x] = false;

                get.addEventListener('success', this);
            }
        }
    }

    SaveOperations() {
        if (this.drawingOperations.length < 1)
            return;
        let tempSavedOperations = {};
        this.drawingOperations = CanvasDrawer.GCD.drawingOperations;
        let keysY = Object.keys(this.drawingOperations);
        for (let y = 0; y < keysY.length; y++) {

            let keysX = Object.keys(this.drawingOperations[keysY[y]]);
            for (let x = 0; x < keysX.length; x++) {
                if (tempSavedOperations[keysY[y]] === undefined)
                    tempSavedOperations[keysY[y]] = {};

                this.putElephantInDb(JSON.stringify(this.drawingOperations[keysY[y]][keysX[x]]), y, x);
            }
        }
    }

    GetOperations() {
        let operations = [];

        let keysY = Object.keys(this.drawingOperations);
        for (let y = 0; y < keysY.length; y++) {
            let keysX = Object.keys(this.drawingOperations[keysY[y]]);
            for (let x = 0; x < keysX.length; x++) {
                for (let i = 0; i < this.drawingOperations[keysY[y]][keysX[x]].length; i++) {
                    operations.push(this.drawingOperations[keysY[y]][keysX[x]][i]);
                }
            }
        }

        return operations;
    }

    handleEvent(e) {
        switch (e.type) {
            case 'success':
                if (e.target.result instanceof IDBDatabase) {
                    this.db = this.request.result;

                    this.db.onerror = function (event) {
                        console.log("Error creating/accessing IndexedDB database");
                    };

                    if (this.db.setVersion) {
                        if (this.db.version != this.dbVersion) {
                            var setVersion = this.db.setVersion(this.dbVersion);
                            setVersion.onsuccess = function () {
                                this.createObjectStore(this.db);
                                this.putElephantInDb();
                            };
                        }
                        else {
                            this.putElephantInDb();
                        }
                    }
                    else {
                        this.putElephantInDb();
                    }
                } else if (this.loadOperationsDone !== true) {
                    let jsonOperation = JSON.parse(e.target.result);
                    this.loadOperationsDone[(jsonOperation[0].pos.y / 32) + '-' + (jsonOperation[0].pos.x / 32)] = true;

                    for (let i = 0; i < jsonOperation.length; i++) {
                        let newSprite = JSON.parse(jsonOperation[i].canvasSprite);
                        let drawingOperationTemp = new DrawingOperation(
                            new Tile(
                                new Vector2D(jsonOperation[i].pos.x, jsonOperation[i].pos.y),
                                new Vector2D(newSprite.x, newSprite.y),
                                new Vector2D(newSprite.width, newSprite.height),
                                (newSprite.isTransparent !== undefined ? newSprite.isTransparent : false),
                                newSprite.canvas
                            ),
                            (jsonOperation[i].drawingCanvas === 'game-canvas' ? this.CanvasDrawer.mainCanvas : this.CanvasDrawer.canvasAtlases[jsonOperation[i].drawingCanvas].canvas),
                            this.CanvasDrawer.canvasAtlases[jsonOperation[i].targetCanvas].canvas
                        );
                        this.drawingOperations[drawingOperationTemp.tile.position.y / 32][drawingOperationTemp.tile.position.x / 32].push(drawingOperationTemp);
                    }

                    let operationsLoaded = true;
                    let keys = Object.keys(this.loadOperationsDone);
                    for (let i = 0; i < keys.length; i++) {
                        if (this.loadOperationsDone[keys[i]] === false)
                            operationsLoaded = false;
                    }

                    if (operationsLoaded === true) {
                        this.loadOperationsDone = true;
                        this.CanvasDrawer.drawingOperations = this.drawingOperations;// this.GetOperations();
                    }
                }
                break;

            case 'upgradeneeded':
                if (e.target.result instanceof IDBDatabase) {
                    this.createObjectStore(e.target.result);
                }
                break;
        }
    }
}

class CanvasDrawer {
    static GCD = new CanvasDrawer(document.getElementById('game-canvas'), document.getElementById('sprite-objects-canvas'), document.getElementById('sprite-preview-canvas'),
        document.getElementById('game-gui-canvas'));

    constructor(mainCanvas, spriteObjectCanvas, spritePreviewCanvas, gameGuiCanvas) {
        this.DebugDraw = false;
        this.canvasOffset = new Vector2D(0, 0);
        this.Brush = new Brush();

        this.frameBuffer = document.createElement('canvas');
        this.frameBuffer.setAttribute('width', 4096);
        this.frameBuffer.setAttribute('height', 4096);
        this.frameBufferCtx = this.frameBuffer.getContext('2d');
        this.frameBufferCtx.webkitImageSmoothingEnabled = false;
        this.frameBufferCtx.msImageSmoothingEnabled = false;
        this.frameBufferCtx.imageSmoothingEnabled = false;

        this.frameBufferTerrain = document.createElement('canvas');
        this.frameBufferTerrain.setAttribute('width', 4096);
        this.frameBufferTerrain.setAttribute('height', 4096);
        this.frameBufferTerrainCtx = this.frameBufferTerrain.getContext('2d');
        this.frameBufferTerrainCtx.webkitImageSmoothingEnabled = false;
        this.frameBufferTerrainCtx.msImageSmoothingEnabled = false;
        this.frameBufferTerrainCtx.imageSmoothingEnabled = false;

        this.mainCanvas = mainCanvas;
        this.mainCanvasCtx = this.mainCanvas.getContext('2d');
        this.mainCanvasCtx.webkitImageSmoothingEnabled = false;
        this.mainCanvasCtx.msImageSmoothingEnabled = false;
        this.mainCanvasCtx.imageSmoothingEnabled = false;

        this.spriteObjectCanvas = spriteObjectCanvas;
        this.spriteObjectCanvasCtx = this.spriteObjectCanvas.getContext('2d');
        this.spriteObjectCanvasCtx.webkitImageSmoothingEnabled = false;
        this.spriteObjectCanvasCtx.msImageSmoothingEnabled = false;
        this.spriteObjectCanvasCtx.imageSmoothingEnabled = false;

        this.spritePreviewCanvas = spritePreviewCanvas;
        this.spritePreviewCanvasCtx = this.spritePreviewCanvas.getContext('2d');
        this.spritePreviewCanvasCtx.webkitImageSmoothingEnabled = false;
        this.spritePreviewCanvasCtx.msImageSmoothingEnabled = false;
        this.spritePreviewCanvasCtx.imageSmoothingEnabled = false;

        this.gameGuiCanvas = gameGuiCanvas;
        this.gameGuiCanvasCtx = this.gameGuiCanvas.getContext('2d');
        this.gameGuiCanvasCtx.webkitImageSmoothingEnabled = false;
        this.gameGuiCanvasCtx.msImageSmoothingEnabled = false;
        this.gameGuiCanvasCtx.imageSmoothingEnabled = false;

        this.gameDebugCanvas = document.getElementById('game-debug-canvas');
        this.gameDebugCanvasCtx = this.gameDebugCanvas.getContext('2d');
        this.gameDebugCanvasCtx.webkitImageSmoothingEnabled = false;
        this.gameDebugCanvasCtx.msImageSmoothingEnabled = false;
        this.gameDebugCanvasCtx.imageSmoothingEnabled = false;
        this.gameDebugCanvasCtx.globalAlpha = 0.3;

        this.drawingOperations = {};
        this.terrainPreviewOperations = [];

        for (let y = 0; y < Math.ceil(this.mainCanvas.height / 32); y++) {
            this.drawingOperations[y] = {};
            for (let x = 0; x < Math.ceil(this.mainCanvas.width / 32); x++) {
                this.drawingOperations[y][x] = [];
            }
        }

        this.gameObjectDrawingOperations = [];
        this.guiDrawingOperations = [];

        this.canvasAtlases = {};
        this.loadedImages = [];
        this.hasLoadedAllImages = {};
        this.isLoadingFinished = false;

        this.selectedSprite;
        this.isPainting = false;
        this.paintingEnabled = false;
        this.lastAtlasCoords = new Vector2D(0, 0);

        this.mainCanvas.addEventListener('mouseup', this);
        this.mainCanvas.addEventListener('mousedown', this);
        this.mainCanvas.addEventListener('mousemove', this);
        this.mainCanvas.addEventListener('mouseleave', this);

        document.getElementById('save-canvas').addEventListener('click', this);
        document.getElementById('enable-painting').addEventListener('click', this);

        this.UIDrawer = new UIDrawer('uipieces', this);

        this.LoadAllAtlases();

        this.ClearBoxCollision = new BoxCollision(new Vector2D(0, 0), new Vector2D(32, 32), false, this, false);

        this.tileCursorPreview;
        this.mousePosition = new Vector2D(0, 0);
        this.BeginAtlasesLoaded();
        this.DrawTilePreview();
    }

    LoadWorldTiles() {
        let keysY = Object.keys(worldTiles);
        for (let y = 0; y < keysY.length; y++) {
            let keysX = Object.keys(worldTiles[keysY[y]]);
            for (let x = 0; x < keysX.length; x++) {
                let tilesArr = worldTiles[keysY[y]][keysX[x]];
                for (let i = 0; i < tilesArr.length; i++) {
                    let newTile = tilesArr[i].tile;

                    if (tilesArr[i].drawingCanvas !== 'sprite-preview-canvas') {

                        let drawingOperationTemp = new DrawingOperation(
                            new Tile(
                                new Vector2D(newTile.position.x, newTile.position.y),
                                new Vector2D(newTile.tilePosition.x, newTile.tilePosition.y),
                                new Vector2D(newTile.size.x, newTile.size.y),
                                (newTile.isTransparent !== undefined ? newTile.isTransparent : false),
                                newTile.canvas,
                                newTile.drawIndex,
                                newTile.tileType,
                                newTile.tileTerrain
                            ),
                            (tilesArr[i].drawingCanvas === undefined || tilesArr[i].drawingCanvas === 'game-canvas' || tilesArr[i].drawingCanvas === '' ? this.frameBufferTerrain : this.canvasAtlases[tilesArr[i].drawingCanvas].canvas),
                            this.canvasAtlases[tilesArr[i].targetCanvas].canvas
                        );

                        if (this.drawingOperations[drawingOperationTemp.tile.position.y / 32] === undefined)
                            this.drawingOperations[drawingOperationTemp.tile.position.y / 32] = {};

                        if (this.drawingOperations[drawingOperationTemp.tile.position.y / 32][drawingOperationTemp.tile.position.x / 32] === undefined)
                            this.drawingOperations[drawingOperationTemp.tile.position.y / 32][drawingOperationTemp.tile.position.x / 32] = [];

                        this.drawingOperations[drawingOperationTemp.tile.position.y / 32][drawingOperationTemp.tile.position.x / 32].push(drawingOperationTemp);
                    }
                }
            }
        }
    }

    BeginAtlasesLoaded() {
        if (this.isLoadingFinished === true) {
            this.LoadWorldTiles();
            this.isLoadingFinished = null;
        } else {
            window.requestAnimationFrame(() => this.BeginAtlasesLoaded());
        }
    }

    SetSelection(tile) {
        if (InputHandler.GIH.keysPressed['leftCtrl'].state === 0 || InputHandler.GIH.keysPressed['leftCtrl'].state === 1) {
            if (Array.isArray(this.selectedSprite) === false)
                this.selectedSprite = [];

            this.selectedSprite.push(tile);
        } else {
            this.selectedSprite = tile;
        }
    }

    LoadAllAtlases() {
        this.LoadSpriteAtlas("/content/sprites/terrain_atlas.png", 1024, 1056, 32, "terrain");
        this.hasLoadedAllImages["terrain"] = false;
        this.LoadSpriteAtlas("/content/sprites/crops.png", 1024, 1024, 32, "crops");
        this.hasLoadedAllImages["crops"] = false;
        this.LoadSpriteAtlas("/content/sprites/fence.png", 1024, 1024, 32, "fence");
        this.hasLoadedAllImages["fence"] = false;
        this.LoadSpriteAtlas("/content/sprites/ui_big_pieces.png", 864, 568, 32, "uipieces");
        this.hasLoadedAllImages["uipieces"] = false;
        this.LoadSpriteAtlas("/content/sprites/fruits-veggies.png", 1024, 1536, 32, "fruitsveggies");
        this.hasLoadedAllImages["fruitsveggies"] = false;
        this.LoadSpriteAtlas("/content/sprites/farming_fishing.png", 640, 640, 32, "farmingfishing");
        this.hasLoadedAllImages["farmingfishing"] = false;
    }

    AddAtlas(atlas, name) {
        if (this.canvasAtlases[name] === undefined) {
            this.canvasAtlases[name] = atlas;
            this.hasLoadedAllImages[name] = false;
            this.isLoadingFinished = false;
        }
    }

    LoadNewSpriteAtlas(url, atlasSize, name) {
        if (this.canvasAtlases[name] === undefined) {
            this.LoadSpriteAtlas(url, 0, 0, atlasSize, name);
            this.hasLoadedAllImages[name] = false;
            this.isLoadingFinished = false;
        }
    }

    LoadSpriteAtlas(url, width, height, atlasSize, name) {
        if (this.canvasAtlases[name] === undefined) {
            this.canvasAtlases[name] = new CanvasAtlas(this, url, width, height, atlasSize, name);
        }
    }

    CheckIfFinishedLoading() {
        if (this.isLoadingFinished === false) {
            let isFinished = true;
            let keys = Object.keys(this.hasLoadedAllImages);

            for (let i = 0; i < keys.length; i++) {
                if (this.hasLoadedAllImages[keys[i]] == false)
                    isFinished = false;
            }

            this.isLoadingFinished = isFinished;
        }
    }

    DrawTilePreview() {
        if (this.tileCursorPreview === undefined) {
            this.tileCursorPreview = new RectOperation(
                new Vector2D(0, 0),
                new Vector2D(32, 32),
                this.gameDebugCanvas,
                'red',
                true
            );
            this.AddDrawOperation(this.tileCursorPreview, OperationType.gameObjects);
        } else {
            this.tileCursorPreview.Update(this.mousePosition);
            this.tileCursorPreview.position.SnapToGrid(32);
        }
    }

    UpdateTilePreview(position) {
        let temp = this.mousePosition.Clone();

        let tempOffsets = this.canvasOffset.Clone();
        tempOffsets.x = Math.abs((tempOffsets.x % 32));
        tempOffsets.y = Math.abs((tempOffsets.y % 32));

        temp.Add(this.canvasOffset);
        temp.SnapToGrid(32);

        if (position.CheckInRange(temp, 96.0) === true) {
            this.tileCursorPreview.position = this.mousePosition;
            this.tileCursorPreview.position.Add(tempOffsets);
            this.tileCursorPreview.position.ToGrid(32);
            this.tileCursorPreview.position.Mult(32);
            this.tileCursorPreview.position.Sub(tempOffsets);
        }
    }

    DrawLoop(delta) {
        this.UIDrawer.AddUIElements();
        let tempDrawingOperations = this.GetOperations();

        if (tempDrawingOperations.length > 0) {
            //this.UpdateDrawingOperations(tempDrawingOperations);

            for (let i = 0; i < tempDrawingOperations.length; i++) {
                if (tempDrawingOperations[i].tile.needsToBeRedrawn === true)
                    this.DrawOnCanvas(tempDrawingOperations[i]);
            }
        }

        this.spritePreviewCanvasCtx.clearRect(0, 0, this.spritePreviewCanvasCtx.width, this.spritePreviewCanvas.height);
        for (let i = 0; i < this.terrainPreviewOperations.length; i++) {
            this.DrawOnCanvas(this.terrainPreviewOperations[i]);
        }
        this.terrainPreviewOperations = [];

        if (this.DebugDraw === true) {
            this.gameDebugCanvasCtx.clearRect(0, 0, this.gameDebugCanvas.width, this.gameDebugCanvas.height);
            let collisions = CollisionHandler.GCH.Collisions;
            collisions.sort(function (a, b) {
                if (a.enableCollision === true && b.enableCollision == false) return 1;
                if (a.enableCollision === false && b.enableCollision == true) return -1;
                return 0;
            });
            for (let collision of collisions) {
                this.DrawDebugCanvas(collision);
            }
        }

        this.gameObjectDrawingOperations.sort(function (a, b) {
            if (a.GetDrawPosition().y > b.GetDrawPosition().y) return 1;
            if (a.GetDrawPosition().y < b.GetDrawPosition().y) return -1;
            if (a.GetDrawIndex() > b.GetDrawIndex()) return 1;
            if (a.GetDrawIndex() < b.GetDrawIndex()) return -1;
            return 0;
        });

        for (let gameOperation of this.gameObjectDrawingOperations) {
            if (gameOperation instanceof DrawingOperation && gameOperation.tile !== undefined && gameOperation.DrawState() === true && gameOperation.oldPosition !== undefined || gameOperation.shouldDelete === true)
                this.ClearCanvas(gameOperation);
            else if (gameOperation instanceof RectOperation && gameOperation.DrawState() === true && gameOperation.oldPosition !== undefined || gameOperation.shouldDelete === true)
                this.ClearCanvas(gameOperation);
        }

        for (let operation of this.guiDrawingOperations)
            this.ClearCanvas(operation);

        for (let i = 0; i < this.gameObjectDrawingOperations.length; i++) {
            if (this.gameObjectDrawingOperations[i].shouldDelete === true) {
                this.gameObjectDrawingOperations.splice(i, 1);
                i--;
            } else {
                if (this.gameObjectDrawingOperations[i].tile !== undefined) {
                    if (this.gameObjectDrawingOperations[i].DrawState() === true) {
                        this.DrawOnCanvas(this.gameObjectDrawingOperations[i]);
                    }
                } else if (this.gameObjectDrawingOperations[i] instanceof TextOperation) {
                    this.DrawOnCanvas(this.gameObjectDrawingOperations[i]);
                } else if (this.gameObjectDrawingOperations[i] instanceof RectOperation) {
                    this.DrawOnCanvas(this.gameObjectDrawingOperations[i], delta);
                }
            }
        }

        for (let i = 0; i < this.guiDrawingOperations.length; i++) {
            if (this.guiDrawingOperations[i].shouldDelete === true) {
                this.guiDrawingOperations.splice(i, 1);
                i--;
            } else if (this.guiDrawingOperations[i].DrawState() === true) {
                this.DrawOnCanvas(this.guiDrawingOperations[i]);
            }
        }

        this.tileCursorPreview.Update(this.tileCursorPreview.position);
    }

    static DrawToMain(camera) {
        let canvas = CanvasDrawer.GCD;
        let cameraRect = camera.GetRect();

        canvas.canvasOffset = new Vector2D(cameraRect.x, cameraRect.y);
        canvas.mainCanvasCtx.clearRect(0, 0, canvas.mainCanvas.width, canvas.mainCanvas.height)
        canvas.mainCanvasCtx.drawImage(canvas.frameBufferTerrain, cameraRect.x, cameraRect.y, cameraRect.z, cameraRect.a, 0, 0, canvas.mainCanvas.width, canvas.mainCanvas.height);
        canvas.mainCanvasCtx.drawImage(canvas.frameBuffer, cameraRect.x, cameraRect.y, cameraRect.z, cameraRect.a, 0, 0, canvas.mainCanvas.width, canvas.mainCanvas.height);
    }

    GetOperations() {
        let operations = [];

        let keysY = Object.keys(this.drawingOperations);
        for (let y = 0; y < keysY.length; y++) {
            let keysX = Object.keys(this.drawingOperations[keysY[y]]);
            for (let x = 0; x < keysX.length; x++) {
                for (let i = 0; i < this.drawingOperations[keysY[y]][keysX[x]].length; i++) {
                    operations.push(this.drawingOperations[keysY[y]][keysX[x]][i]);
                }
            }
        }

        return operations;
    }

    UpdateDrawingOperations(operations) {
        if (operations.length < 1)
            return;

        //this.canvasSave.UpdateOperation(operations);
    }

    ClearCanvas(drawingOperation) {
        if (drawingOperation instanceof DrawingOperation) {
            if (drawingOperation.tile === undefined || (drawingOperation.tile !== undefined && this.canvasAtlases[drawingOperation.tile.atlas] === undefined)) {
                return;
            }
        }

        drawingOperation.isVisible = false;
        let context = drawingOperation.drawingCanvas.getContext('2d'),
            oldPosition = drawingOperation.GetPreviousPosition();

        if (drawingOperation instanceof DrawingOperation) {
            context.clearRect(oldPosition.x - 0.5, oldPosition.y - 0.5, drawingOperation.tile.size.x + 1, drawingOperation.tile.size.y + 1);
            this.CheckClearOverlapping(drawingOperation.tile.position, drawingOperation.tile.size);
        } else if (drawingOperation instanceof TextOperation) {
            let size = drawingOperation.GetSize();
            context.clearRect(oldPosition.x, oldPosition.y, size.x, size.y);
            //this.CheckClearOverlapping(drawingOperation.pos, size);
        } else if (drawingOperation instanceof RectOperation) {
            let size = drawingOperation.GetSize();
            context.clearRect(oldPosition.x, oldPosition.y, size.x, size.y);
        }
    }

    CheckClearOverlapping(position, size) {
        this.ClearBoxCollision.position = position;
        this.ClearBoxCollision.size = size;

        let overlaps = CollisionHandler.GCH.GetOverlaps(this.ClearBoxCollision);//new BoxCollision(position, this.BoxCollision.size, this.enableCollision, this));

        for (let overlap of overlaps) {
            if (overlap.collisionOwner !== undefined && overlap.collisionOwner.drawingOperation !== undefined && overlap.collisionOwner.drawingOperation.DrawState() === false) {
                overlap.collisionOwner.FlagDrawingUpdate(overlap.collisionOwner.position);
                //overlaps[i].collisionOwner.NeedsRedraw(overlaps[i].collisionOwner.position);
            }
        }
    }

    DrawDebugCanvas(collision) {
        if (collision.enableCollision === true) {
            this.gameDebugCanvasCtx.fillStyle = 'red';
        } else {
            this.gameDebugCanvasCtx.fillStyle = 'cyan';
        }

        if (collision instanceof BoxCollision) {
            this.gameDebugCanvasCtx.clearRect(collision.position.x, collision.position.y, collision.size.x, collision.size.y);
            this.gameDebugCanvasCtx.fillRect(collision.position.x, collision.position.y, collision.size.x, collision.size.y);
        } else if (collision instanceof PolygonCollision) {
            this.gameDebugCanvasCtx.beginPath();
            this.gameDebugCanvasCtx.moveTo(collision.points[0].x, collision.points[0].y);

            for (let point of collision.points) {
                this.gameDebugCanvasCtx.lineTo(point.x, point.y);
            }

            this.gameDebugCanvasCtx.closePath();
            this.gameDebugCanvasCtx.fill();
        } else if (collision instanceof Collision) {
            this.gameDebugCanvasCtx.fillRect(collision.position.x, collision.position.y, collision.size.x, collision.size.y);
        }
    }

    DrawOnCanvas(drawingOperation, delta = 0) {
        if (drawingOperation instanceof DrawingOperation) {
            if (drawingOperation.tile == undefined || this.canvasAtlases[drawingOperation.tile.atlas] === undefined)
                return;

            if (drawingOperation.targetCanvas === undefined || this.mainCanvasCtx === undefined)
                return;
        }

        let context = drawingOperation.drawingCanvas.getContext('2d');
        if (drawingOperation instanceof TextOperation && drawingOperation.clear === true || drawingOperation instanceof DrawingOperation && drawingOperation.tile.clear === true) {
            //context.clearRect(0, 0, drawingOperation.drawingCanvas.width, drawingOperation.drawingCanvas.height);
        }

        drawingOperation.isVisible = true;
        if (drawingOperation instanceof DrawingOperation) {
            drawingOperation.tile.needsToBeRedrawn = false;
            context.drawImage(
                drawingOperation.targetCanvas,
                drawingOperation.tile.GetPosX(),
                drawingOperation.tile.GetPosY(),
                drawingOperation.tile.size.x,
                drawingOperation.tile.size.y,
                drawingOperation.tile.position.x,
                drawingOperation.tile.position.y,
                drawingOperation.tile.size.x,
                drawingOperation.tile.size.y
            );
        } else if (drawingOperation instanceof TextOperation) {
            drawingOperation.needsToBeRedrawn = false;
            context.font = drawingOperation.size + 'px ' + drawingOperation.font;
            context.fillStyle = drawingOperation.color;
            context.fillText(drawingOperation.text, drawingOperation.pos.x, drawingOperation.pos.y);
        } else if (drawingOperation instanceof RectOperation) {
            this.gameDebugCanvasCtx.globalAlpha = drawingOperation.alpha;

            drawingOperation.needsToBeRedrawn = false;
            context.fillStyle = drawingOperation.color;
            context.fillRect(drawingOperation.position.x, drawingOperation.position.y, drawingOperation.size.x, drawingOperation.size.y);

            if (drawingOperation.lifeTime !== -1) {
                drawingOperation.Tick(delta);
            }

            this.gameDebugCanvasCtx.globalAlpha = 0.3;
        }
    }

    CreatePaintOperation(event) {
        if (this.selectedSprite !== undefined) {
            this.Brush.SetBrush(brushTypes.box, this.selectedSprite);
            let canvasPos = correctMouse(event);

            canvasPos.Add(this.canvasOffset);
            canvasPos.ToGrid(32);
            canvasPos.Mult(32);

            this.AddDrawOperations(
                this.Brush.GenerateDrawingOperations(
                    { x: canvasPos.x, y: canvasPos.y },
                    this.frameBufferTerrain,
                    this.canvasAtlases[this.selectedSprite.atlas].canvas
                ),
                OperationType.terrain
            );
        }
    }

    GetTileAtPosition(position, convert = true) {
        let canvasPos;
        if (convert === true) {
            canvasPos = correctMouse({ target: this.mainCanvas, x: position.x, y: position.y });
            canvasPos.ToGrid(32);
        }
        else
            canvasPos = position;

        if (this.drawingOperations[canvasPos.y] !== undefined && this.drawingOperations[canvasPos.y][canvasPos.x] !== undefined) {
            return this.drawingOperations[canvasPos.y][canvasPos.x];
        }
    }

    AddDebugOperation(position, lifetime = 5, color = 'purple') {
        this.gameObjectDrawingOperations.push(new RectOperation(position, new Vector2D(5, 5), this.gameDebugCanvas, color, false, 0, lifetime, 1.0))
    }

    AddDrawOperation(operation, operationType = OperationType.terrain) {
        if (operation === undefined)
            return;

        switch (operationType) {
            case OperationType.previewTerrain:
                this.terrainPreviewOperations.push(operation);
                break;

            case OperationType.terrain:
                if (operation.tile.IsTransparent() === false) {
                    let newOperations = [operation];

                    if (this.drawingOperations[operation.tile.GetDrawPosY()] === undefined)
                        this.drawingOperations[operation.tile.GetDrawPosY()] = {};

                    if (this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()] === undefined)
                        this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()] = [];

                    for (let i = 0; i < this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()].length; i++) {
                        if (this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()][i].tile.IsTransparent() === true)
                            newOperations.push(this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()][i]);
                    }

                    newOperations.sort(function (a, b) {
                        if (a.GetPosition().y > b.GetPosition().y)
                            return 1;
                        else if (a.GetPosition().y < b.GetPosition().y)
                            return -1;
                        else return 0;
                    });

                    this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()] = newOperations;
                } else {
                    if (this.drawingOperations[operation.tile.GetDrawPosY()] === undefined)
                        this.drawingOperations[operation.tile.GetDrawPosY()] = {};

                    if (this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()] === undefined)
                        this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()] = [];

                    this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()].push(operation);

                    this.drawingOperations[operation.tile.GetDrawPosY()][operation.tile.GetDrawPosX()].sort(function (a, b) {
                        if (a.GetPosition().y > b.GetPosition().y)
                            return 1;
                        else if (a.GetPosition().y < b.GetPosition().y)
                            return -1;
                        else return 0;
                    });
                }
                break;

            case OperationType.gameObjects:
                this.gameObjectDrawingOperations.push(operation);
                break;

            case OperationType.gui:
                this.guiDrawingOperations.push(operation);
                break;
        }
    }

    AddDrawOperations(operations, operationType = OperationType.terrain) {
        for (let i = 0; i < operations.length; i++)
            this.AddDrawOperation(operations[i], operationType);
    }

    handleEvent(e) {
        switch (e.type) {
            case 'click':
                switch (e.target.id) {
                    case 'save-canvas':
                        navigator.clipboard.writeText(JSON.stringify(this.drawingOperations));
                        break;

                    case 'enable-painting':
                        this.paintingEnabled = !this.paintingEnabled;
                        break;
                }
                break;

            case 'mousedown':
                if (this.paintingEnabled === true) {
                    this.isPainting = true;
                    this.CreatePaintOperation(e);
                }
                break;

            case 'mouseleave':
            case 'mouseup':
                this.isPainting = false;
                break;

            case 'mousemove':
                let objPos = MouseToScreen(e);
                this.mousePosition = new Vector2D(objPos.x, objPos.y);

                if (this.selectedSprite !== undefined && Array.isArray(this.selectedSprite) === false) {
                    this.Brush.SetBrush(brushTypes.box, this.selectedSprite);
                    let atlasCoords = correctMouse(e);

                    let tempOffsets = this.canvasOffset.Clone();
                    tempOffsets.x = Math.abs((tempOffsets.x % 32));
                    tempOffsets.y = Math.abs((tempOffsets.y % 32));

                    atlasCoords.Add(tempOffsets);
                    atlasCoords.ToGrid(this.canvasAtlases[this.selectedSprite.atlas].atlasSize);

                    if (this.lastAtlasCoords.Equal(atlasCoords) == false) {
                        this.spritePreviewCanvasCtx.clearRect(0, 0, this.spritePreviewCanvas.width, this.spritePreviewCanvas.height);
                    }
                    let posCoords = new Vector2D(atlasCoords.x, atlasCoords.y);

                    posCoords.Mult({ x: 32, y: 32 });
                    posCoords.Sub(tempOffsets);

                    this.AddDrawOperations(
                        this.Brush.GenerateDrawingOperations(
                            posCoords,
                            this.spritePreviewCanvas,
                            this.canvasAtlases[this.selectedSprite.atlas].canvas
                        ),
                        OperationType.previewTerrain
                    );
                    this.lastAtlasCoords = new Vector2D(atlasCoords.x, atlasCoords.y);
                }

                if (this.isPainting === true)
                    this.CreatePaintOperation(e);
                break;
        }
    }
}

export { CanvasDrawer, CanvasSave, CanvasAtlas, CanvasAtlasObject, CanvasSprite, DrawingOperation, UIDrawer, OperationType }