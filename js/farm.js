import { MasterObject } from './masterObject.js';
import { PageFetcher } from './pageFetcher.js';

class SpriteObject {
    constructor(x, y, w, h, canvas, name) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.canvas = canvas;
        this.name = name;
    }
}

function posToGrid(pos, columns = link.columns) {
    let x = pos.x / link.width;
    let y = pos.y / link.height;
    return x + (columns * y);
}

function gridToPos(pid, columns = link.columns) {
    let x = pid % columns;
    let y = Math.floor(pid / columns);
    x = link.width * x;
    y = link.height * y;
    return { x: x, y: y };
}

let includeTemplates = function appendTemplates(content) {
    let container = document.createElement('div');
    container.innerHTML = content;
    document.head.appendChild(container);
}

PageFetcher.GPF.AddRequest(includeTemplates, '/html/inventory.html');
PageFetcher.GPF.AddRequest(includeTemplates, '/html/tileLUTEditor.html');

window.onload = function () {
    window.requestAnimationFrame(() => MasterObject.MO.GameLoop());
}