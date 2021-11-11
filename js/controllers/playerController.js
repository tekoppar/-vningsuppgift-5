/* import { Vector2D } from '../classes/vectors.js';
import { CustomEventHandler } from '../eventHandlers/customEvents.js';
import { Hoe, Shovel, Axe } from '../gameobjects/items/item.js';
import { Seed } from '../gameobjects/props/plants/plantitem.js';
import { Controller } from './controller.js';
import { Camera } from './camera.js';
import { CanvasDrawer } from '../drawers/canvas/customDrawer.js';
import { Minimap } from '../drawers/minimap.js'; */

import { Vector2D, CustomEventHandler, Hoe, Shovel, Axe, Seed, Controller, Camera, CanvasDrawer, Minimap } from '../internal.js';

class PlayerController extends Controller {
    constructor(player) {
        super();
        this.playerCharacter = player;
        this.playerCamera = new Camera(this, new Vector2D(CanvasDrawer.GCD.mainCanvas.width, CanvasDrawer.GCD.mainCanvas.height));
        this.minimap = new Minimap(player);
        this.mouseToAtlasRectMap = { };
        this.mousePosition = new Vector2D(0, 0);
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
        this.playerCharacter.inventory.AddItem(new Axe('axe', 0));
        this.playerCharacter.inventory.AddItem(new Seed('cornSeed', 1));
        this.playerCharacter.inventory.AddMoney(5000);

        window.addEventListener('mousemove', this);
    }

    MouseToScreen(event) {
        let rect;
        if (this.mouseToAtlasRectMap[event.target.id] === undefined) {
            rect = event.target.getBoundingClientRect();
            if (event.target.id !== undefined)
                this.mouseToAtlasRectMap[event.target.id] = { x: rect.x + window.scrollX, y: rect.y + window.scrollY };
        }
        else if (event.target.id !== undefined) {
            rect = { x: this.mouseToAtlasRectMap[event.target.id].x, y: this.mouseToAtlasRectMap[event.target.id].y };
            rect.x -= window.scrollX;
            rect.y -= window.scrollY;
        }
        return new Vector2D(event.x - rect.x, event.y - rect.y);
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
                        case 'leftShift': this.playerCharacter.SetMovement('running', -3); break;
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
                        case 'leftShift': this.playerCharacter.SetMovement('running', -3); break;
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

    handleEvent(e) {
        switch (e.type) {
            case 'mousemove':
                let objPos = this.MouseToScreen(e);
                this.mousePosition.x = objPos.x;
                this.mousePosition.y = objPos.y;

                let temp = this.playerCharacter.BoxCollision.GetCenterPosition();
                temp.SnapToGrid(32);
                CanvasDrawer.GCD.UpdateTilePreview(temp, this.mousePosition.Clone());
                break;
        }
    }
}

export { PlayerController };