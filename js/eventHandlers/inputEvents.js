/* import { Cobject } from '../classes/baseClasses/object.js';
import { Vector2D } from '../classes/vectors.js'; */

import { CanvasDrawer, Cobject, Vector2D } from '../internal.js';

const InputState = {
    OnPressed: 0,
    Pressed: 1,
    OnReleased: 2,
    Released: 3,
    Null: 4,
}

const InputType = {
    keyboard: 0,
    mouse: 1,
}

class Input {
    constructor(key, inputType = InputType.keyboard) {
        this.key = key;
        this.state = InputState.Null;
        this.position = new Vector2D(0, 0);
        this.inputType = inputType;
    }

    State(s, p) {
        this.state = s;
        this.position = p;
    }
}

class InputHandler extends Cobject {
    static GIH = new InputHandler();

    constructor() {
        super();
        this.gameCanvas = document.getElementById('game-canvas');
        this.keysPressed = {
            '0': new Input('0'),
            '1': new Input('1'),
            '2': new Input('2'),
            '3': new Input('3'),
            '4': new Input('4'),
            '5': new Input('5'),
            '6': new Input('6'),
            '7': new Input('7'),
            '8': new Input('8'),
            '9': new Input('9'),
            'a': new Input('a'),
            'd': new Input('d'),
            'w': new Input('w'),
            's': new Input('s'),
            'e': new Input('e'),
            'i': new Input('i'),
            'q': new Input('q'),
            'tab': new Input('tab'),
            'escape': new Input('escape'),
            'backspace': new Input('backspace'),
            'leftMouse': new Input('leftMouse', InputType.mouse),
            'middleMouse': new Input('middleMouse', InputType.mouse),
            'rightMouse': new Input('rightMouse', InputType.mouse),
            'leftShift': new Input('leftShift'),
            'rightShift': new Input('rightShift'),
            'leftCtrl': new Input('leftCtrl'),
            'arrowUp': new Input('arrowUp'),
            'arrowLeft': new Input('arrowLeft'),
            'arrowDown': new Input('arrowDown'),
            'arrowRight': new Input('arrowRight'),
        };
        this.registeredListeners = [];
        this.AttachInputListener();
    }

    AttachInputListener() {
        document.addEventListener('keydown', this);
        document.addEventListener('keyup', this);
        this.gameCanvas.addEventListener('mousedown', this);
        this.gameCanvas.addEventListener('mouseup', this);
    }

    AddListener(object) {
        this.registeredListeners.push(object);
    }

    RemoveListener(object) {
        for (let i = 0; i < this.registeredListeners.length; i++) {
            if (this.registeredListeners[i] === object)
                this.registeredListeners.splice(i, 1);
        }
    }

    AddInput(key, state, position = new Vector2D(0, 0)) {
        this.keysPressed[key].State(state, position);
    }

    handleEvent(e) {
        switch (e.type) {
            case 'keydown':
                switch (e.keyCode) {
                    case 8: this.AddInput('backspace', InputState.OnPressed); break;
                    case 9: this.AddInput('tab', InputState.OnPressed); break;
                    case 16: this.AddInput(e.location === 1 ? 'leftShift' : 'rightShift', InputState.OnPressed); break;
                    case 17: this.AddInput('leftCtrl', InputState.OnPressed); break;
                    case 27: this.AddInput('escape', InputState.OnPressed); break;
                    case 37: this.AddInput('arrowLeft', InputState.OnPressed); break;
                    case 38: this.AddInput('arrowUp', InputState.OnPressed); break;
                    case 39: this.AddInput('arrowRight', InputState.OnPressed); break;
                    case 40: this.AddInput('arrowDown', InputState.OnPressed); break;
                    case 48: this.AddInput('0', InputState.OnPressed); break;
                    case 49: this.AddInput('1', InputState.OnPressed); break;
                    case 50: this.AddInput('2', InputState.OnPressed); break;
                    case 51: this.AddInput('3', InputState.OnPressed); break;
                    case 52: this.AddInput('4', InputState.OnPressed); break;
                    case 53: this.AddInput('5', InputState.OnPressed); break;
                    case 54: this.AddInput('6', InputState.OnPressed); break;
                    case 55: this.AddInput('7', InputState.OnPressed); break;
                    case 56: this.AddInput('8', InputState.OnPressed); break;
                    case 57: this.AddInput('9', InputState.OnPressed); break;
                    case 65: this.AddInput('a', InputState.OnPressed); break;
                    case 68: this.AddInput('d', InputState.OnPressed); break;
                    case 69: this.AddInput('e', InputState.OnPressed); break;
                    case 73: this.AddInput('i', InputState.OnPressed); break;
                    case 81: this.AddInput('q', InputState.OnPressed); break;
                    case 83: this.AddInput('s', InputState.OnPressed); break;
                    case 87: this.AddInput('w', InputState.OnPressed); break;
                }
                break;
            case 'keyup':
                switch (e.keyCode) {
                    case 8: this.AddInput('backspace', InputState.OnReleased); break;
                    case 9: this.AddInput('tab', InputState.OnReleased); break;
                    case 16: this.keysPressed[e.location === 1 ? 'leftShift' : 'rightShift'].State(InputState.OnReleased); break;
                    case 17: this.AddInput('leftCtrl', InputState.OnReleased); break;
                    case 27: this.AddInput('escape', InputState.OnReleased); break;
                    case 37: this.AddInput('arrowLeft', InputState.OnReleased); break;
                    case 38: this.AddInput('arrowUp', InputState.OnReleased); break;
                    case 39: this.AddInput('arrowRight', InputState.OnReleased); break;
                    case 40: this.AddInput('arrowDown', InputState.OnReleased); break;
                    case 48: this.AddInput('0', InputState.OnReleased); break;
                    case 49: this.AddInput('1', InputState.OnReleased); break;
                    case 50: this.AddInput('2', InputState.OnReleased); break;
                    case 51: this.AddInput('3', InputState.OnReleased); break;
                    case 52: this.AddInput('4', InputState.OnReleased); break;
                    case 53: this.AddInput('5', InputState.OnReleased); break;
                    case 54: this.AddInput('6', InputState.OnReleased); break;
                    case 55: this.AddInput('7', InputState.OnReleased); break;
                    case 56: this.AddInput('8', InputState.OnReleased); break;
                    case 57: this.AddInput('9', InputState.OnReleased); break;
                    case 65: this.keysPressed['a'].State(InputState.OnReleased); break;
                    case 68: this.keysPressed['d'].State(InputState.OnReleased); break;
                    case 69: this.keysPressed['e'].State(InputState.OnReleased); break;
                    case 73: this.keysPressed['i'].State(InputState.OnReleased); break;
                    case 81: this.AddInput('q', InputState.OnReleased); break;
                    case 83: this.keysPressed['s'].State(InputState.OnReleased); break;
                    case 87: this.keysPressed['w'].State(InputState.OnReleased); break;
                }
                break;
            case 'mousedown':
                switch (e.button) {
                    case 0: this.AddInput('leftMouse', InputState.OnPressed, CanvasDrawer.GCD.tileCursorPreview.position.Clone()); break;
                    case 1: this.AddInput('middleMouse', InputState.OnPressed, CanvasDrawer.GCD.tileCursorPreview.position.Clone()); break;
                    case 2: this.AddInput('rightMouse', InputState.OnPressed, CanvasDrawer.GCD.tileCursorPreview.position.Clone()); break;
                }
                break;
            case 'mouseup':
                switch (e.button) {
                    case 0: this.AddInput('leftMouse', InputState.OnReleased, CanvasDrawer.GCD.tileCursorPreview.position.Clone()); break;
                    case 1: this.AddInput('middleMouse', InputState.OnReleased, CanvasDrawer.GCD.tileCursorPreview.position.Clone()); break;
                    case 2: this.AddInput('rightMouse', InputState.OnReleased, CanvasDrawer.GCD.tileCursorPreview.position.Clone()); break;
                }
                break;
        }
    }

    FixedUpdate() {
        let keys = Object.keys(this.keysPressed);

        for (let x = 0; x < keys.length; x++) {
            if (this.keysPressed[keys[x]].state !== InputState.Null) {
                for (let i = 0; i < this.registeredListeners.length; i++) {
                    switch (this.keysPressed[keys[x]].inputType) {
                        case InputType.keyboard:
                            this.registeredListeners[i].CEvent('input', keys[x], { eventType: this.keysPressed[keys[x]].state });
                            break;

                        case InputType.mouse:
                            this.registeredListeners[i].CEvent('input', keys[x], { eventType: this.keysPressed[keys[x]].state, position: this.keysPressed[keys[x]].position });
                            break;
                    }
                }
            }
        }

        for (let x = 0; x < keys.length; x++) {
            switch (this.keysPressed[keys[x]].state) {
                case InputState.OnPressed: this.keysPressed[keys[x]].State(InputState.Pressed); break;
                case InputState.OnReleased: this.keysPressed[keys[x]].State(InputState.Released); break;
                case InputState.Released: this.keysPressed[keys[x]].State(InputState.Null); break;
            }
        }

        keys = null;
    }
}

export { InputHandler, InputState };