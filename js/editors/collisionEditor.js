/* import { CanvasDrawer } from '../drawers/canvas/customDrawer.js';
import { Vector2D } from '../classes/vectors.js'; */

import { CanvasDrawer, Vector2D } from '../internal.js';

class CollisionEditor {
    static GCEditor;

    constructor() {
        this.container;
        this.canvas;
        this.collisionCanvas;
        this.gridHTML;
        this.sprite;
        this.SetupHTML();
        this.gridSize = 32;
        this.isDrawing = false;
        this.collisionPositions = [];
        this.positionMap = {};
        this.copyCollision;
    }

    SetupHTML() {
        if (document.getElementById('collision-editor-grid') === undefined || document.getElementById('collision-editor-grid') === null) {
            window.requestAnimationFrame(() => this.SetupHTML());
            return;
        }

        this.container = document.getElementById('collision-editor');
        this.canvas = document.getElementById('collision-editor-canvas');
        let ctx = this.canvas.getContext('2d');
        this.gridHTML = document.getElementById('collision-editor-grid');
        this.copyCollision = document.getElementById('collision-editor-copy')

        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        this.collisionCanvas = document.getElementById('collision-editor-canvas-collision');
        let ctxC = this.collisionCanvas.getContext('2d');
        ctxC.webkitImageSmoothingEnabled = false;
        ctxC.msImageSmoothingEnabled = false;
        ctxC.imageSmoothingEnabled = false;
        ctxC.globalAlpha = 0.3;

        this.SetGridSize(new Vector2D(32, 32));

        this.gridHTML.addEventListener('mousemove', this);
        this.gridHTML.addEventListener('mousedown', this);
        this.gridHTML.addEventListener('mouseup', this);
        this.container.addEventListener('click', this);
    }

    SetGridSize(spriteSize) {
        this.canvas.setAttribute('width', spriteSize.x * 4);
        this.canvas.setAttribute('height', spriteSize.y * 4);
        this.canvas.nextElementSibling.setAttribute('width', this.canvas.width);
        this.canvas.nextElementSibling.setAttribute('height', this.canvas.height);
        this.container.setAttribute('width', spriteSize.x * 4);
        this.container.setAttribute('height', spriteSize.y * 4);
        this.gridHTML.style.backgroundSize = this.canvas.width / spriteSize.x + 'px ' + this.canvas.height / spriteSize.y + 'px';
        this.gridSize = new Vector2D(this.canvas.width / spriteSize.x, this.canvas.height / spriteSize.y);
        this.collisionPositions = new Array(spriteSize.x * spriteSize.y);
        this.collisionPositions.fill(null, 0, spriteSize.x * spriteSize.y);
    }

    DrawSprite() {
        if (this.sprite !== undefined) {
            let ctx = this.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.drawImage(CanvasDrawer.GCD.canvasAtlases[this.sprite.atlas].canvas, this.sprite.GetPosX(), this.sprite.GetPosY(), this.sprite.size.x, this.sprite.size.y, 0, 0, this.canvas.width, this.canvas.height);
        }
    }

    DrawPreview(position) {
        this.DrawSprite();
        let ctx = this.canvas.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(position.x, position.y, this.gridSize.x, this.gridSize.y);
    }

    DrawCollisionPixel() {
        let ctx = this.collisionCanvas.getContext('2d');
        ctx.clearRect(0, 0, this.collisionCanvas.width, this.collisionCanvas.height);
        ctx.fillStyle = 'cyan';
        ctx.strokeStyle = 'white';
        ctx.globalAlpha = 0.3;

        ctx.beginPath();
        let first = false;
        for (let position of this.collisionPositions) {
            if (position !== null && position !== undefined) {
                if (first === false) {
                    ctx.moveTo(position.x, position.y);
                    first = true;
                }
                ctx.lineTo(position.x, position.y);

                ctx.fillRect(position.x, position.y, this.gridSize.x, this.gridSize.y);
            }
        }
        ctx.globalAlpha = 1;
        ctx.closePath();
        ctx.lineS
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    AddCollisionPixels(position) {
        let mousePosition = position.Clone();
        mousePosition.SnapToGrid(this.gridSize.x, this.gridSize.y);

        if (this.positionMap[mousePosition.x + '-' + mousePosition.y] === undefined) {
            this.positionMap[mousePosition.x + '-' + mousePosition.y] = this.collisionPositions.length;
            this.collisionPositions.push(mousePosition);
        }
    }

    Open(sprite) {
        if (sprite !== undefined) {
            this.container.style.visibility = 'visible';
            this.sprite = sprite;
            this.SetGridSize(this.sprite.size);
            this.DrawSprite();
        }
    }

    LogPoints() {
        let string = '[';
        for (let position of this.collisionPositions) {
            if (position !== null && position !== undefined) {
                string += 'new Vector2D(' + position.x / this.gridSize.x + ', ' + position.y / this.gridSize.y + '), ';
            }
        }
        string += ']';

        navigator.clipboard.writeText(string);
    }

    handleEvent(e) {
        switch (e.type) {
            case 'mousemove':
                let mousePosition = new Vector2D(e.layerX, e.layerY);
                mousePosition.SnapToGrid(this.gridSize.x, this.gridSize.y);
                this.DrawPreview(mousePosition);
                if (this.isDrawing === true) {
                    this.AddCollisionPixels(new Vector2D(e.layerX, e.layerY));
                    this.DrawCollisionPixel();
                }
                break;

            case 'mousedown':
                this.isDrawing = true;
                this.AddCollisionPixels(new Vector2D(e.layerX, e.layerY));
                this.DrawCollisionPixel();
                break;

            case 'mouseup':
                this.isDrawing = false;
                this.DrawCollisionPixel();
                break;

            case 'click':
                if (e.target.id === 'collision-editor-copy')
                    this.LogPoints();
                else if (e.target.id === 'collision-editor-close')
                    this.container.style.visibility = 'collapse';
                break;

        }
    }
}

export { CollisionEditor };