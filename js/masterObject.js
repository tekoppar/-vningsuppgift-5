import { CustomEventHandler } from './customEvents.js';
import { Plant, PlantData } from './plants.js';
import { Character } from './character.js';
import { InputHandler } from './inputEvents.js';
import { Vector2D } from './vectors.js';
import { plantAnimations } from './AllAnimations.js';
import { CanvasSprite, CanvasDrawer, CanvasAtlas } from './customDrawer.js';
import { Cobject } from './object.js';

var GlobalFrameCounter = 0;

class MasterObject {
    static MO = new MasterObject();

    constructor() {
        this.gameHasBegun = false;
        this.classInitialization = {
            CanvasDrawer: false,
            Vector2D: false,
            CanvasSprite: false,
            DrawingOperation: false,
            Animation: false,
            InputHandler: false,
            CustomEventHandler: false,
        }
        this.classesHasBeenInitialized = false;
        this.objectsHasBeenInitialized = false;
    }

    CheckIfClassesInitialized() {
        let keys = Object.keys(this.classInitialization);

        if (keys.length === 0) {
            this.classesHasBeenInitialized = true;
            return;
        }

        if (typeof CanvasDrawer !== undefined)
            delete this.classInitialization.CanvasDrawer;

        if (typeof Vector2D !== undefined)
            delete this.classInitialization.Vector2D;

        if (typeof CanvasSprite !== undefined)
            delete this.classInitialization.CanvasSprite;

        if (typeof DrawingOperation !== undefined)
            delete this.classInitialization.DrawingOperation;

        if (typeof Animation !== undefined)
            delete this.classInitialization.Animation;

        if (typeof InputHandler !== undefined)
            delete this.classInitialization.InputHandler;

        if (typeof CustomEventHandler !== undefined)
            delete this.classInitialization.CustomEventHandler;
    }

    GameBegin() {
        if (this.gameHasBegun === false) {
            for (let i = 0; i < AllPlants.length; i++) {
                CustomEventHandler.AddListener(AllPlants[i]);
            }

            this.gameHasBegun = true;
        }
    }

    GameLoopActions() {
        for (let i = 0; i < Cobject.AllCobjects.length; i++) {
            Cobject.AllCobjects[i].FixedUpdate();
        }

        CanvasDrawer.GCD.DrawLoop();
    }

    GameLoop() {
        this.CheckIfClassesInitialized();

        if (this.classesHasBeenInitialized === true && this.objectsHasBeenInitialized === false) {
            //this.canvasDrawer = new CanvasDrawer();

            this.objectsHasBeenInitialized = true;
        }

        if (this.objectsHasBeenInitialized === true) {
            this.GameBegin();
            this.GameLoopActions();
        }

        GlobalFrameCounter++;
        window.requestAnimationFrame(() => this.GameLoop());
    }
}

var character = new Character("/content/sprites/lpcfemalelight_updated.png");
InputHandler.GIH.registeredListeners.push(character);
character.AddAttachment('/content/sprites/red.png', 'redHair');
character.AddAttachment('/content/sprites/lpcfemaleunderdress.png', 'underDress');

var AllPlants = [
    new Plant("/content/sprites/crops.png", 'corn', new Vector2D(576, 128), plantAnimations.corn, new PlantData(300, 25, {low:1, high:4}, new CanvasSprite(29, 10, 32, 32, 'fruitsveggies', true))),
    new Plant("/content/sprites/crops.png", 'potato', new Vector2D(576 + (32 * 1), 128), plantAnimations.potato, new PlantData(300, 25, {low:1, high:4}, new CanvasSprite(0, 0, 32, 32, 'fruitsveggies', true))),
    new Plant("/content/sprites/crops.png", 'watermelon', new Vector2D(576 + (32 * 2), 128), plantAnimations.watermelon, new PlantData(300, 25, {low:1, high:4}, new CanvasSprite(22, 0, 32, 32, 'fruitsveggies', true))),
    new Plant("/content/sprites/crops.png", 'pumpkin', new Vector2D(576 + (32 * 3), 128), plantAnimations.pumpkin, new PlantData(300, 25, {low:1, high:4}, new CanvasSprite(28, 0, 32, 32, 'fruitsveggies', true))),
];

for (let i = 0; i < AllPlants.length; i++) {
    CustomEventHandler.AddListener(AllPlants[i]);
}

export { MasterObject, character, AllPlants, GlobalFrameCounter };