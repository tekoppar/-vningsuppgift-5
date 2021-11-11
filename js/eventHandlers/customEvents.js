//import { Cobject } from '../classes/baseClasses/object.js';

import { Cobject } from '../internal.js';

class CustomEventData {
    constructor(eventName, otherObject) {
        this.eventName = eventName;
        this.otherObject = otherObject;
    }
}

class CustomEventHandler extends Cobject {
    static GCEH = new CustomEventHandler();

    constructor() {
        super();
        this.registeredListeners = [];
        this.customEvents = [];
    }

    FixedUpdate() {
        super.FixedUpdate();

        if (this.customEvents.length > 0) {
            for (let y = 0; y < this.customEvents.length; y++) {
                for (let i = 0; i < this.registeredListeners.length; i++) {
                    this.registeredListeners[i].CEvent(this.customEvents[y].eventName, this.customEvents[y].otherObject);
                }
            }

            this.customEvents = [];
        }
    }

    static AddListener(object) {
        CustomEventHandler.GCEH.registeredListeners.push(object);
    }

    static NewCustomEvent(eventName, caller) {
        CustomEventHandler.GCEH.customEvents.push(new CustomEventData(eventName, caller));
    }
}

export { CustomEventData, CustomEventHandler };