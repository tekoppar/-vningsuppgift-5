/* import { CanvasDrawer } from './canvas/customDrawer.js';
import { Cobject } from '../classes/baseClasses/object.js'; */

import { CanvasDrawer, Cobject } from '../internal.js';

class Minimap extends Cobject {
    constructor(parent) {
        super();
        this.parentObject = parent;
        this.minimapCanvas = document.createElement('canvas');
        this.minimapCanvas.setAttribute('width', 256);
        this.minimapCanvas.setAttribute('height', 256);
        this.minimapCanvasCtx = this.minimapCanvas.getContext('2d');
        this.minimapCanvasCtx.webkitImageSmoothingEnabled = false;
        this.minimapCanvasCtx.msImageSmoothingEnabled = false;
        this.minimapCanvasCtx.imageSmoothingEnabled = false;

        this.minimapCanvas.style.position = 'absolute';
        this.minimapCanvas.style.top = this.minimapCanvas.style.right = '0';

        document.getElementById('game-gui').appendChild(this.minimapCanvas);
    }

    FixedUpdate() {
        this.minimapCanvasCtx.drawImage(CanvasDrawer.GCD.frameBufferTerrain, 0, 0, CanvasDrawer.GCD.frameBufferTerrain.width, CanvasDrawer.GCD.frameBufferTerrain.height, 0, 0, this.minimapCanvas.width, this.minimapCanvas.height);
        this.minimapCanvasCtx.fillStyle = 'red';
        this.minimapCanvasCtx.fillRect(
            this.parentObject.position.x / (CanvasDrawer.GCD.frameBufferTerrain.width / this.minimapCanvas.width),
            this.parentObject.position.y / (CanvasDrawer.GCD.frameBufferTerrain.height / this.minimapCanvas.height),
            2, 2
        );
        super.FixedUpdate();
    }

    CEvent(eventType, data) {

    }

    GameBegin() {
        super.GameBegin();
    }
}

export { Minimap };