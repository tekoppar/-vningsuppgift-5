import { Vector2D } from './vectors.js';

class Cobject {
    static AllCobjects = [];

    constructor() {
        this.position = new Vector2D(256, 256);
        this.size = new Vector2D(1, 1);
        this.name = '';
        
        Cobject.AllCobjects.push(this);
        //MasterObject.MO.AllCobjects.push(this);
    }

    FixedUpdate() {

    }

    CEvent(eventType, data) {

    }

    CheckInRange(checkPos, range = 100.0) {
        return this.position.Distance(checkPos) < range;
    }
}

export { Cobject };