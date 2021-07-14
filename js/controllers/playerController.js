import { Vector2D } from '../classes/vectors.js';
import { CustomEventHandler } from '../eventHandlers/customEvents.js';
import { Hoe, Shovel } from '../gameobjects/items/item.js';
import { Seed } from '../gameobjects/props/plants/plantitem.js';
import { Controller } from './controller.js';
import { Camera } from './camera.js';
import { CanvasDrawer } from '../drawers/canvas/customDrawer.js';

class PlayerController extends Controller {
    constructor(player) {
        super();
        this.playerCharacter = player;
        this.playerCamera = new Camera(this, new Vector2D(CanvasDrawer.GCD.mainCanvas.width, CanvasDrawer.GCD.mainCanvas.height));
    }

    FixedUpdate() {
        this.playerCamera.SetCameraPosition(this.playerCharacter.position);
        super.FixedUpdate();
    }
    
    Delete() {
        super.Delete();
    }

    GameBegin() {
        super.GameBegin();
        this.playerCharacter.inventory.SetupInventory();
        this.playerCharacter.inventory.AddItem(new Shovel('shovel', 0));
        this.playerCharacter.inventory.AddItem(new Hoe('hoe', 0));
        this.playerCharacter.inventory.AddItem(new Seed('cornSeed', 1));
        this.playerCharacter.inventory.AddMoney(5000);
    }

    CEvent(eventType, key, data) {
        switch (eventType) {
            case 'input':
                if (data.eventType == 0) {
                    switch (key) {
                        case 'a': this.playerCharacter.UpdateDirection('x', 1); break;
                        case 'w': this.playerCharacter.UpdateDirection('y', 1); break;
                        case 'd': this.playerCharacter.UpdateDirection('x', -1); break;
                        case 's': this.playerCharacter.UpdateDirection('y', -1); break;
                        case 'leftShift': this.playerCharacter.SetMovement('running', -15); break;
                        case 'leftMouse':
                            if (data.eventType === 0)
                                this.playerCharacter.UseItem(data);
                            break;
                    }
                }
                if (data.eventType == 1) {
                    switch (key) {
                        case 'a': this.playerCharacter.UpdateDirection('x', 1); break;
                        case 'w': this.playerCharacter.UpdateDirection('y', 1); break;
                        case 'd': this.playerCharacter.UpdateDirection('x', -1); break;
                        case 's': this.playerCharacter.UpdateDirection('y', -1); break;
                        case 'leftShift': this.playerCharacter.SetMovement('running', -15); break;
                    }
                } else if (data.eventType == 2 || data.eventType == 3) {
                    switch (key) {
                        case 'a':
                        case 'w':
                        case 'd':
                        case 's':
                            this.playerCharacter.StopMovement();
                            break;

                        case 'e':
                            if (data.eventType == 3) {
                                this.playerCharacter.Interact();
                            }
                            break;

                        case 'leftShift': this.playerCharacter.SetMovement('walking', -1); break;
                    }
                }
                break;
        }
    }
}

export { PlayerController };