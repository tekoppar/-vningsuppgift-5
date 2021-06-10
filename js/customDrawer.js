import { Vector2D as Vector2D, Vector as Vector, Vector4D as Vector4D } from './vectors.js';

const brushTypes = {
    circle: 'circle',
    box: 'box',
}

let mouseToAtlasRectMap = {};
function mouseToAtlas(event, size) {
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
    return { x: Math.floor((event.x - rect.x) / size), y: Math.floor((event.y - rect.y) / size) };
}

class Brush {
    constructor(type = brushTypes.box, size = new Vector2D(1, 1), canvasSprite) {
        this.type = type;
        this.size = size;
        this.canvasSprite = canvasSprite;
    }

    SplitMultiSelection(sprite) {
        let newSprites = [];

        if (sprite.width > 32 || sprite.height > 32) {
            for (let x = 0; x < sprite.width / 32; x++) {
                for (let y = 0; y < sprite.height / 32; y++) {
                    let cloned = sprite.Clone();
                    cloned.x += x;
                    cloned.y += y;
                    cloned.width = 32;
                    cloned.height = 32;
                    newSprites.push(cloned);
                }
            }
        } else
            newSprites.push(sprite);

        return newSprites;
    }

    GenerateDrawingOperations(pos, drawingCanvas, targetCanvas) {
        let drawingOperations = [];

        if (this.canvasSprite === undefined)
            return [];

        switch (this.type) {
            case brushTypes.circle:

                break;

            case brushTypes.box:
                let orgSize = new Vector2D(this.canvasSprite.height, this.canvasSprite.width);
                let splitSprites = this.SplitMultiSelection(this.canvasSprite);
                let x = this.size.x === 1 ? 0 : Math.ceil(this.size.x / 2 * -1);

                for (; x < this.size.x; x++) {
                    let y = this.size.y === 1 ? 0 : Math.ceil(this.size.y / 2 * -1);

                    for (; y < this.size.y; y++) {
                        let tempPos = { x: pos.x, y: pos.y };
                        tempPos.x += x * orgSize.y;
                        tempPos.y += y * orgSize.x;
                        let index = 0;
                        for (let orgY = 0; orgY < (orgSize.y / 32); orgY++) {
                            for (let orgX = 0; orgX < (orgSize.x / 32); orgX++) {
                                drawingOperations.push(
                                    new DrawingOperation(
                                        splitSprites[index],
                                        drawingCanvas,
                                        new Vector2D(
                                            tempPos.x + (splitSprites[index].width * orgY),
                                            tempPos.y + (splitSprites[index].height * orgX)
                                        ),
                                        false,
                                        targetCanvas
                                    )
                                );
                                index++;
                            }
                        }
                    }
                }
                break;
        }

        return drawingOperations;
    }
}

class BrushSettings {
    constructor(brushSize, brushType) {
        this.brushSize = brushSize;
        this.brushType = brushType;
    }
}

class TextOperation {
    constructor(text, pos, clear, drawingCanvas, font = 'sans-serif', size = 18, color = 'rgb(243, 197, 47)') {
        this.text = text;
        this.pos = new Vector2D(pos.x, pos.y + (size / 2) - 5);
        this.clear = clear;
        this.drawingCanvas = drawingCanvas;
        this.font = font;
        this.size = size;
        this.color = color;
    }
}

class DrawingOperation {
    constructor(canvasSprite, drawingCanvas, pos = { x: 0, y: 0 }, clear = false, targetCanvas) {
        this.canvasSprite = canvasSprite;
        this.drawingCanvas = drawingCanvas;
        this.pos = pos;
        this.clear = clear;
        this.targetCanvas = targetCanvas;
    }

    toJSON() {
        return {
            canvasSprite: JSON.stringify(this.canvasSprite),
            drawingCanvas: this.drawingCanvas.id,
            pos: this.pos,
            clear: this.clear,
            targetCanvas: this.targetCanvas.id
        }
    }
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

        this.LoadImage()
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
                this.startDrag = mouseToAtlas(e, this.atlasSize);
                break;

            case 'mouseup':
                this.endDrag = mouseToAtlas(e, this.atlasSize);

                let calcCoords = new Vector2D(this.endDrag.x, this.endDrag.y);
                calcCoords.Sub(this.startDrag);
                calcCoords.Add({ x: 1, y: 1 });

                this.CanvasDrawer.selectedSprite = new CanvasSprite(
                    this.startDrag.x,
                    this.startDrag.y,
                    calcCoords.x * this.atlasSize,
                    calcCoords.y * this.atlasSize,
                    this.name
                );
                break;

            /*case 'click':
                let atlasCoords = mouseToAtlas(e, this.atlasSize);
 
                this.CanvasDrawer.selectedSprite = new CanvasSprite(atlasCoords.x, atlasCoords.y, this.atlasSize, this.atlasSize, this.name);
                break;*/
        }
    }
}

class UIElement {
    constructor(lifeTime = 30) {
        this.drawingOperations = [];
        this.lifeTime = lifeTime;
    }

    AddOperations(canvasDrawer) {
        for (let i = 0; i < this.drawingOperations.length; i++) {
            canvasDrawer.AddDrawOperation(this.drawingOperations[i]);
        }
        this.lifeTime--;
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
                this.uiElements[i].AddOperations(this.canvasDrawer)
            }

            let tempUIElements = this.uiElements;
            for (let i = 0; i < tempUIElements.length; i++) {
                if (tempUIElements[i].lifeTime <= 0) {
                    tempUIElements.splice(i, 1);
                    i--;
                }
            }

            this.uiElements = tempUIElements;
        }
    }

    DrawUIElement(sprite, text, position) {
        let newUiElement = new UIElement();

        newUiElement.drawingOperations.push(new DrawingOperation(
            new CanvasSprite(
                15.05,
                2.6,
                42,
                32,
                'uipieces'
            ),
            this.canvasDrawer.spriteObjectCanvas, position, false, this.canvasDrawer.canvasAtlases['uipieces'].canvas
        )
        );
        newUiElement.drawingOperations.push(new DrawingOperation(
            new CanvasSprite(
                17.05,
                2.6,
                42,
                32,
                'uipieces'
            ),
            this.canvasDrawer.spriteObjectCanvas, new Vector2D(position.x + 42, position.y), false, this.canvasDrawer.canvasAtlases['uipieces'].canvas)
        );

        newUiElement.drawingOperations.push(new DrawingOperation(sprite, this.canvasDrawer.spriteObjectCanvas, new Vector2D(position.x + 10, position.y), false, this.canvasDrawer.canvasAtlases[sprite.canvas].canvas));
        newUiElement.drawingOperations.push(new TextOperation(text, new Vector2D(position.x + 42, position.y + (32 / 2)), false, this.canvasDrawer.spriteObjectCanvas));
        this.uiElements.push(newUiElement);
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
    }

    createObjectStore(database) {
        //database.createObjectStore(key);
    }

    getDataFromDb(index, key) {
        let transaction = this.db.transaction([index], "readwrite");
        let get = transaction.objectStore(index).get(key);
    }

    putElephantInDb(blob, index, key = "saveData") {
        let transaction = this.db.transaction([index], "readwrite");
        let put = transaction.objectStore(index).put(blob, key);

        this.request.onerror = function (event) {
            console.log("Error creating/accessing IndexedDB database");
        };
    };

    UpdateOperation(operations) {
        for (let i = 0; i < operations.length; i++) {
            if (operations[i].drawingCanvas.id === 'game-canvas') {
                if (operations[i].canvasSprite.IsTransparent() === true) {
                    this.drawingOperations[operations[i].pos.y / 32][operations[i].pos.x / 32].push(operations[i]);
                } else if (this.drawingOperations[operations[i].pos.y / 32] !== undefined) {
                    this.drawingOperations[operations[i].pos.y / 32][operations[i].pos.x / 32] = [];
                    this.drawingOperations[operations[i].pos.y / 32][operations[i].pos.x / 32].push(
                        new DrawingOperation(
                            operations[i].canvasSprite,
                            operations[i].drawingCanvas,
                            operations[i].pos,
                            operations[i].clear,
                            operations[i].targetCanvas
                        )
                    );
                }

            }
        }
    }

    LoadOperations() {
        for (let y = 0; y < Math.ceil(this.CanvasDrawer.mainCanvas.height / 32); y++) {
            this.drawingOperations[y] = {};
            for (let x = 0; x < Math.ceil(this.CanvasDrawer.mainCanvas.width / 32); x++) {
                this.drawingOperations[y][x] = [];
            }
        }
        for (let y = 0; y < Math.ceil(this.CanvasDrawer.mainCanvas.height / 32); y++) {
            this.drawingOperations[y] = {};
            for (let x = 0; x < Math.ceil(this.CanvasDrawer.mainCanvas.width / 32); x++) {
                this.drawingOperations[y][x] = [];
                let transaction = this.db.transaction([y], "readwrite");
                let get = transaction.objectStore(y).get(x);
                this.loadOperationsDone[y + '-' + x] = false;
                get.addEventListener('success', this);
            }
        }
    }

    SaveOperations() {
        if (this.drawingOperations.length < 1)
            return;
        let tempSavedOperations = {};
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
                            new CanvasSprite(
                                newSprite.x,
                                newSprite.y,
                                newSprite.width,
                                newSprite.height,
                                newSprite.canvas,
                                (newSprite.isTransparent !== undefined ? newSprite.isTransparent : false)
                            ),
                            (jsonOperation[i].drawingCanvas === 'game-canvas' ? this.CanvasDrawer.mainCanvas : this.CanvasDrawer.canvasAtlases[jsonOperation[i].drawingCanvas].canvas),
                            jsonOperation[i].pos,
                            jsonOperation[i].clear,
                            this.CanvasDrawer.canvasAtlases[jsonOperation[i].targetCanvas].canvas
                        );

                        this.drawingOperations[drawingOperationTemp.pos.y / 32][drawingOperationTemp.pos.x / 32].push(drawingOperationTemp);
                    }

                    let operationsLoaded = true;
                    let keys = Object.keys(this.loadOperationsDone);
                    for (let i = 0; i < keys.length; i++) {
                        if (this.loadOperationsDone[keys[i]] === false)
                            operationsLoaded = false;
                    }

                    if (operationsLoaded === true) {
                        this.loadOperationsDone = true;
                        this.CanvasDrawer.drawingOperations = this.GetOperations();
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
    static GCD = new CanvasDrawer(document.getElementById('game-canvas'), document.getElementById('sprite-objects-canvas'), document.getElementById('sprite-preview-canvas'));

    constructor(mainCanvas, spriteObjectCanvas, spritePreviewCanvas) {
        this.canvasSave = new CanvasSave({}, this);

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

        this.canvasAtlases = {};
        this.drawingOperations = [];
        this.loadedImages = [];
        this.hasLoadedAllImages = {};
        this.isLoadingFinished = false;

        this.selectedSprite;
        this.isPainting = false;
        this.lastAtlasCoords = new Vector2D(0, 0);

        this.mainCanvas.addEventListener('mouseup', this);
        this.mainCanvas.addEventListener('mousedown', this);
        this.mainCanvas.addEventListener('mousemove', this);

        document.getElementById('save-canvas').addEventListener('click', this);
        document.getElementById('size-x').addEventListener('input', this);
        document.getElementById('size-y').addEventListener('input', this);

        this.brushSettings = new BrushSettings(new Vector2D(1, 1), brushTypes.box);
        this.UIDrawer = new UIDrawer('uipieces', this);

        this.LoadAllAtlases();
    }

    SetBrushSettings(element) {
        switch (element.dataset.type) {
            case "size":
                if (element.id == 'size-x')
                    this.brushSettings.brushSize.x = element.value;
                if (element.id == 'size-y')
                    this.brushSettings.brushSize.y = element.value;
                break;
        }
    }

    LoadAllAtlases() {
        this.LoadSpriteAtlas("/content/sprites/terrain_atlas.png", 1024, 1024, 32, "terrain");
        this.hasLoadedAllImages["terrain"] = false;
        this.LoadSpriteAtlas("/content/sprites/crops.png", 1024, 1024, 32, "crops");
        this.hasLoadedAllImages["crops"] = false;
        this.LoadSpriteAtlas("/content/sprites/fence.png", 1024, 1024, 32, "fence");
        this.hasLoadedAllImages["fence"] = false;
        this.LoadSpriteAtlas("/content/sprites/ui_big_pieces.png", 864, 568, 32, "uipieces");
        this.hasLoadedAllImages["uipieces"] = false;
        this.LoadSpriteAtlas("/content/sprites/fruits-veggies.png", 1024, 1536, 32, "fruitsveggies");
        this.hasLoadedAllImages["fruitsveggies"] = false;
    }

    AddAtlas(atlas, name) {
        if (this.canvasAtlases[name] === undefined)
            this.canvasAtlases[name] = atlas;
    }

    LoadNewSpriteAtlas(url, atlasSize, name) {
        if (this.canvasAtlases[name] === undefined) {
            this.LoadSpriteAtlas(url, 0, 0, atlasSize, name);
            this.hasLoadedAllImages[name] = false;
            this.isLoadingFinished = false;
        }
    }

    LoadSpriteAtlas(url, width, height, atlasSize, name) {
        if (this.canvasAtlases[name] === undefined)
            this.canvasAtlases[name] = new CanvasAtlas(this, url, width, height, atlasSize, name);
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

            if (this.isLoadingFinished === true) {
                this.canvasSave.LoadOperations();
                this.drawingOperations = this.canvasSave.GetOperations();
                this.isLoadingFinished = null;
            }
        }
    }

    DrawLoop() {

        //var brush = new Brush(brushTypes.box, 1, new CanvasSprite(0, 0, 32, 32, 'terrain'));
        //var operations = brush.GenerateDrawingOperations({ x: 3 * 32, y: 3 * 32 }, this.mainCanvas, this.canvasAtlases['terrain'].canvas);
        //this.drawingOperations = operations;

        this.CheckIfFinishedLoading();
        this.UIDrawer.AddUIElements();
        let tempDrawingOperations = this.drawingOperations;
        this.drawingOperations = [];

        tempDrawingOperations.sort(function (a, b) {
            if (a.pos.y > b.pos.y)
                return 1;
            else if (a.pos.y < b.pos.y)
                return -1;
            else return 0;
        });

        this.spriteObjectCanvasCtx.clearRect(0, 0, this.spriteObjectCanvas.width, this.spriteObjectCanvas.height);

        if (tempDrawingOperations.length > 0) {
            this.UpdateDrawingOperations(tempDrawingOperations);

            for (let i = 0; i < tempDrawingOperations.length; i++) {
                this.DrawOnCanvas(tempDrawingOperations[i]);
            }
        }
    }

    UpdateDrawingOperations(operations) {
        if (operations.length < 1)
            return;

        this.canvasSave.UpdateOperation(operations);
    }

    DrawOnCanvas(drawingOperation) {
        if (drawingOperation instanceof DrawingOperation) {
            if (drawingOperation.canvasSprite == undefined || this.canvasAtlases[drawingOperation.canvasSprite.canvas] === undefined)
                return;

            if (drawingOperation.targetCanvas === undefined || this.mainCanvasCtx === undefined)
                return;
        }

        let context = drawingOperation.drawingCanvas.getContext('2d');
        if (drawingOperation.clear) {
            context.clearRect(0, 0, drawingOperation.drawingCanvas.width, drawingOperation.drawingCanvas.height);
        }

        if (drawingOperation instanceof DrawingOperation) {
            context.drawImage(
                drawingOperation.targetCanvas,
                drawingOperation.canvasSprite.GetPosX(),
                drawingOperation.canvasSprite.GetPosY(),
                drawingOperation.canvasSprite.width,
                drawingOperation.canvasSprite.height,
                drawingOperation.pos.x,
                drawingOperation.pos.y,
                drawingOperation.canvasSprite.width,
                drawingOperation.canvasSprite.height
            );
        } else if (drawingOperation instanceof TextOperation) {
            context.font = drawingOperation.size + 'px ' + drawingOperation.font;
            context.fillStyle = drawingOperation.color;
            context.fillText(drawingOperation.text, drawingOperation.pos.x, drawingOperation.pos.y);
        }
    }

    CreatePaintOperation(event) {
        if (this.selectedSprite !== undefined) {
            let brush = new Brush(brushTypes.box, this.brushSettings.brushSize, this.selectedSprite),
                canvasPos = mouseToAtlas(event, 32);// this.selectedSprite.width);

            this.drawingOperations = this.drawingOperations.concat(
                brush.GenerateDrawingOperations(
                    { x: canvasPos.x * 32, y: canvasPos.y * 32 },
                    this.mainCanvas,
                    this.canvasAtlases[this.selectedSprite.canvas].canvas
                )
            );
        }
    }

    AddDrawOperation(operation) {
        this.drawingOperations.push(operation);
    }

    handleEvent(e) {
        switch (e.type) {
            case 'click':
                switch (e.target.id) {
                    case 'save-canvas':
                        this.canvasSave.SaveOperations();
                        break;
                }
                break;

            case 'input':
                switch (e.target.id) {
                    case 'size-x':
                    case 'size-y':
                        this.SetBrushSettings(e.target);
                        break;
                }
                break;

            case 'mousedown':
                this.isPainting = true;
                this.CreatePaintOperation(e);
                break;

            case 'mouseup':
                this.isPainting = false;
                break;

            case 'mousemove':
                if (this.selectedSprite !== undefined) {
                    let brush = new Brush(brushTypes.box, this.brushSettings.brushSize, this.selectedSprite),
                        canvasPos = mouseToAtlas(e, 32);// this.selectedSprite.width);

                    let atlasCoords = mouseToAtlas(e, this.canvasAtlases[this.selectedSprite.canvas].atlasSize);

                    if (this.lastAtlasCoords.Equal(atlasCoords) == false) {
                        this.spritePreviewCanvasCtx.clearRect(0, 0, this.spritePreviewCanvas.width, this.spritePreviewCanvas.height);
                    }
                    let posCoords = new Vector2D(atlasCoords.x, atlasCoords.y);
                    posCoords.Mult({ x: 32, y: 32 });

                    //let previewDrawingOperation = new DrawingOperation(this.selectedSprite, this.spritePreviewCanvas, posCoords, true, this.canvasAtlases[this.selectedSprite.canvas].canvas);
                    //this.drawingOperations.push(previewDrawingOperation);
                    this.drawingOperations = this.drawingOperations.concat(
                        brush.GenerateDrawingOperations(
                            posCoords,
                            this.spritePreviewCanvas,
                            this.canvasAtlases[this.selectedSprite.canvas].canvas
                        )
                    );

                    this.lastAtlasCoords = new Vector2D(atlasCoords.x, atlasCoords.y);
                }

                if (this.isPainting === true)
                    this.CreatePaintOperation(e);
                break;
        }
    }
}

export { CanvasDrawer, CanvasSave, CanvasAtlas, CanvasSprite, DrawingOperation, BrushSettings, Brush, UIDrawer }