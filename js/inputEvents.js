import { Cobject } from './object.js';

const InputState = {
    IsPressed: 0,
    WasPressed: 1,
    Null: 2,
}

class Input {
    constructor(key) {
        this.key = key;
        this.state = InputState.Null;
    }

    State(s) {
        this.state = s;
    }
}

class InputHandler extends Cobject {
    static GIH = new InputHandler();

    constructor() {
        super();
        this.keysPressed = {
            'a': new Input('a'),
            'd': new Input('d'),
            'w': new Input('w'),
            's': new Input('s'),
            'e': new Input('e'),
            'leftShift': new Input('leftShift'),
            'rightShift': new Input('rightShift')
        };
        this.registeredListeners = [];
        this.AttachInputListener();
    }

    AttachInputListener() {
        document.addEventListener('keydown', this);
        document.addEventListener('keyup', this);
    }

    AddListener(object) {
        this.registeredListeners.push(object);
    }

    handleEvent(e) {
        switch (e.type) {
            case 'keydown':
                switch (e.keyCode) {
                    case 16: this.keysPressed[e.location === 1 ? 'leftShift' : 'rightShift'].State(InputState.IsPressed); break;
                    case 65: this.keysPressed['a'].State(InputState.IsPressed); break;
                    case 68: this.keysPressed['d'].State(InputState.IsPressed); break;
                    case 69: this.keysPressed['e'].State(InputState.IsPressed); break;
                    case 83: this.keysPressed['s'].State(InputState.IsPressed); break;
                    case 87: this.keysPressed['w'].State(InputState.IsPressed); break;
                }
                break;
            case 'keyup':
                switch (e.keyCode) {
                    case 16: this.keysPressed[e.location === 1 ? 'leftShift' : 'rightShift'].State(InputState.WasPressed); break;
                    case 65: this.keysPressed['a'].State(InputState.WasPressed); break;
                    case 68: this.keysPressed['d'].State(InputState.WasPressed); break;
                    case 69: this.keysPressed['e'].State(InputState.WasPressed); break;
                    case 83: this.keysPressed['s'].State(InputState.WasPressed); break;
                    case 87: this.keysPressed['w'].State(InputState.WasPressed); break;
                }
                break;
        }
    }

    FixedUpdate() {
        let keys = Object.keys(this.keysPressed);
        for (let i = 0; i < this.registeredListeners.length; i++) {
            for (let x = 0; x < keys.length; x++) {
                if (this.keysPressed[keys[x]].state !== InputState.Null)
                    this.registeredListeners[i].CEvent('input', keys[x], this.keysPressed[keys[x]].state);
            }
        }

        for (let x = 0; x < keys.length; x++) {
            if (this.keysPressed[keys[x]].state === InputState.WasPressed)
                this.keysPressed[keys[x]].State(InputState.Null);
        }
    }
}

export { InputHandler, InputState };