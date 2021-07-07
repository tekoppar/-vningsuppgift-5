import { Vector2D } from './vectors.js';

class Cobject {
    static AllCobjects = [];
    static AllUIDs = {};

    constructor() {
        this.position = new Vector2D(256, 256);
        this.size = new Vector2D(1, 1);
        this.name = '';
        this.UID
        
        Cobject.AddObject(this);
        //MasterObject.MO.AllCobjects.push(this);
    }

    static GetObjectFromUID(uid) {
        return Cobject.AllCobjects[Cobject.AllUIDs[uid]];
    }

    static DeleteObject(object) {
        if (Cobject.AllUIDs[object.UID] === undefined)
            return;

        Cobject.AllCobjects.splice(Cobject.AllUIDs[object.UID], 1);
        delete Cobject.AllUIDs[object.UID];


        /*for (let i = 0; i < Cobject.AllCobjects.length; i++) {
            if (object === Cobject.AllCobjects[i])
                Cobject.AllCobjects.splice(i, 1);    
        }*/
    }

    static GenerateUID() {
        let array = new Uint32Array(4);
        window.crypto.getRandomValues(array);
        let uid = '';

        for (let i = 0; i < array.length; i++) {
            uid += array[i];
        }

        if (Cobject.AllUIDs[uid] !== undefined) {
            uid = Cobject.GenerateUID();
        }

        return uid;
    }

    static AddObject(object) {
        let uid = Cobject.GenerateUID();
        object.UID = uid;
        Cobject.AllUIDs[uid] = Cobject.AllCobjects.length;
        Cobject.AllCobjects.push(object);
    }

    FixedUpdate() {

    }

    Delete() {
        Cobject.DeleteObject(this);
    }

    CEvent(eventType, data) {

    }

    CheckInRange(checkPos, range = 100.0) {
        return this.position.Distance(checkPos) < range;
    }
}

export { Cobject };