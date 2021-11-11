/* import { Cobject } from "../classes/baseClasses/object.js";
import { Vector4D } from "../classes/vectors.js"; */

import { Cobject, Vector4D } from '../internal.js';

class Camera extends Cobject {
    constructor(parent, size) {
        super();
        this.cameraSize = size;
        this.parent = parent;
    }

    FixedUpdate() {
        super.FixedUpdate();
    }
    
    Delete() {
        super.Delete();
    }

    SetCameraPosition(position) {
        this.position.x = Math.max(position.x, this.cameraSize.x / 2);
        this.position.y = Math.max(position.y, this.cameraSize.y / 2);
    }

    GetRect() {
        return new Vector4D(this.position.x - (this.cameraSize.x / 2), this.position.y -  (this.cameraSize.y / 2), this.cameraSize.x, this.cameraSize.y);
    }
}

export { Camera };