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

Object.defineProperty(String.prototype, 'chopLeft', {
    value() {
        return this.slice(1, this.length);
    }
});

Object.defineProperty(String.prototype, 'chopRight', {
    value() {
        return this.slice(0, this.length - 1);
    }
});

Object.defineProperty(Node.prototype, 'appendChildren', {
    value(nodes) {
        for (var i = 0; i < nodes.length; i++) {
            this.appendChild(nodes[i]);
        }
    }
});

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

function HTMLStringToNode(string) {
    let div = document.createElement('div');
    div.innerHTML = string;
    return div;
}

let includeTemplates = function appendTemplates(content) {
    let container = document.createElement('div');
    container.innerHTML = content;
    document.head.appendChild(container);
}

let includeGUI = function appendGUI(content) {
    document.getElementById('game-gui').appendChild(HTMLStringToNode(content));
}

PageFetcher.GPF.AddRequest(includeTemplates, '/html/inventory.html');
PageFetcher.GPF.AddRequest(includeTemplates, '/html/tileLUTEditor.html');
PageFetcher.GPF.AddRequest(includeGUI, '/html/collisionEditor.html');

window.onload = function () {
    window.requestAnimationFrame(() => MasterObject.MO.GameStart());
}