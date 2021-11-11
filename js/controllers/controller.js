//import { Cobject } from '../classes/baseClasses/object.js';

import { Cobject } from '../internal.js';

class Controller extends Cobject {
    constructor() {
        super();
    }

    FixedUpdate() {
        super.FixedUpdate();
    }
    
    Delete() {
        super.Delete();
    }

    GameBegin() {
        super.GameBegin();
    }
}

export { Controller };