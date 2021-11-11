/* import { CustomEventHandler } from '../eventHandlers/customEvents.js';
import { Plant, AllPlantData } from '../gameobjects/props/plants/plants.js';
import { MainCharacter } from '../gameobjects/characters/character.js';
import { InputHandler } from '../eventHandlers/inputEvents.js';
import { Vector2D } from '../classes/vectors.js';
import { plantAnimations } from '../animations/AllAnimations.js';
import { CanvasDrawer } from '../drawers/canvas/customDrawer.js';
import { CanvasSprite } from '../drawers/canvas/canvasSprite.js';
import { Cobject } from '../classes/baseClasses/object.js';
import { TileData } from '../drawers/tiles/tile.js';
import { Seed } from '../gameobjects/props/plants/plantitem.js';
import { Shop } from '../gameobjects/props/shop.js';
import { TileMaker } from '../drawers/tiles/tilemaker.js';
import { CollisionEditor } from '../editors/collisionEditor.js';
import { PlayerController } from '../controllers/playerController.js'; */

import { ObjectsHasBeenInitialized, ToggleObjectsHasBeenInitialized, CustomEventHandler, Plant, AllPlantData, MainCharacter, InputHandler, Vector2D, plantAnimations, CanvasDrawer, CanvasSprite, Cobject, TileData, Seed, Shop, TileMaker, CollisionEditor, PlayerController } from '../internal.js';

var GlobalFrameCounter = 0;

class Mastertime {
    constructor() {
        this.DeltaTime = Date.now();
        this.PreviousTime = 0;
        this.GlobalFrameCounter = 0;
    }

    Next() {
        this.DeltaTime = Date.now() - this.PreviousTime;
        this.PreviousTime = Date.now();
        this.GlobalFrameCounter++;
    }

    Delta() {
        return this.DeltaTime / 1000;
    }

    FC() {
        return this.GlobalFrameCounter;
    }
}

class MasterObject {
    static MO = new MasterObject();

    constructor() {
        this.gameHasBegun = false;
        this.Mastertime = new Mastertime();
        this.Mastertime.Next();
        this.classInitialization = {
            CanvasDrawer: false,
            Vector2D: false,
            CanvasSprite: false,
            DrawingOperation: false,
            CAnimation: false,
            InputHandler: false,
            CustomEventHandler: false,
        }
        this.classesHasBeenInitialized = false;
        this.playerController;
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

        if (typeof CAnimation !== undefined)
            delete this.classInitialization.CAnimation;

        if (typeof InputHandler !== undefined)
            delete this.classInitialization.InputHandler;

        if (typeof CustomEventHandler !== undefined)
            delete this.classInitialization.CustomEventHandler;
    }

    GameStart() {
        this.CheckIfClassesInitialized();

        if (this.classesHasBeenInitialized === true && ObjectsHasBeenInitialized === false) {
            this.playerController = new PlayerController(new MainCharacter("/content/sprites/lpcfemalelight_updated.png", 'femaleLight', 'mainP', 0, new Vector2D(256, 326)));
            this.playerController.playerCharacter.AddAttachment('/content/sprites/red.png', 'redHair');
            this.playerController.playerCharacter.AddAttachment('/content/sprites/lpcfemaleunderdress.png', 'underDress');
            InputHandler.GIH.AddListener(this.playerController);

            TileData.tileData.CreateTileLUTEditor();
            CollisionEditor.GCEditor = new CollisionEditor();
            TileMaker.GenerateCustomTiles();

            ToggleObjectsHasBeenInitialized(true);
        }

        if (ObjectsHasBeenInitialized === true && (CanvasDrawer.GCD.isLoadingFinished == null || CanvasDrawer.GCD.isLoadingFinished === true)) {
            window.requestAnimationFrame(() => this.GameBegin());
        } else {
            GlobalFrameCounter++;
            window.requestAnimationFrame(() => this.GameStart());
        }

        CanvasDrawer.GCD.CheckIfFinishedLoading();
    }

    GameBegin() {
        if (this.gameHasBegun === false) {
            CanvasDrawer.GCD.GameBegin();
            for (let i = 0; i < AllPlants.length; i++) {
                CustomEventHandler.AddListener(AllPlants[i]);
            }

            this.gameHasBegun = true;

            let keys = Object.keys(Cobject.AllCobjects);
            for (let i = 0; i < keys.length; i++) {
                if (Cobject.AllCobjects[keys[i]] !== undefined)
                    Cobject.AllCobjects[keys[i]].GameBegin();
            }
        }

        window.requestAnimationFrame(() => this.GameLoop());
    }

    GameLoopActions(delta) {
        let keys = Object.keys(Cobject.AllCobjects);
        for (let i = 0; i < keys.length; i++) {
            if (Cobject.AllCobjects[keys[i]] !== undefined)
                Cobject.AllCobjects[keys[i]].FixedUpdate(delta);
        }

        keys = null;

        CanvasDrawer.GCD.DrawLoop(delta);
    }

    GameLoop() {
        this.Mastertime.Next();
        this.GameLoopActions(this.Mastertime.Delta());
        CanvasDrawer.DrawToMain(this.playerController.playerCamera);

        GlobalFrameCounter++;
        window.requestAnimationFrame(() => this.GameLoop());
    }
}

var shopTest = new Shop('seedShop', new Vector2D(368, 256), undefined, 'pepoSeedShop');
shopTest.AddItem(new Seed('cornSeed', 420));
shopTest.AddItems([
    new Seed('potatoSeed', 999), new Seed('watermelonSeed', 999),
    new Seed('pumpkinSeed', 999), new Seed('bellpepperGreenSeed', 999),
    new Seed('bellpepperRedSeed', 999), new Seed('bellpepperOrangeSeed', 999),
    new Seed('bellpepperYellowSeed', 999), new Seed('carrotSeed', 999),
    new Seed('parsnipSeed', 999), new Seed('radishSeed', 999),
    new Seed('beetrootSeed', 999), new Seed('garlicSeed', 999),
    new Seed('onionYellowSeed', 999), new Seed('onionRedSeed', 999),
    new Seed('onionWhiteSeed', 999), new Seed('onionGreenSeed', 999),
    new Seed('hotPepperSeed', 999), new Seed('chiliPepperSeed', 999),
    new Seed('lettuceIcebergSeed', 999), new Seed('cauliflowerSeed', 999),
    new Seed('broccoliSeed', 999)
]);
CustomEventHandler.AddListener(shopTest);

var AllPlants = [
    new Plant('crops', 'corn', new Vector2D(576, 128), plantAnimations.corn, AllPlantData.corn),
    new Plant('crops', 'potato', new Vector2D(576 + (32 * 1), 128), plantAnimations.potato, AllPlantData.potato),
    new Plant('crops', 'watermelon', new Vector2D(576 + (32 * 2), 128), plantAnimations.watermelon, AllPlantData.watermelon),
    new Plant('crops', 'pumpkin', new Vector2D(576 + (32 * 3), 128), plantAnimations.pumpkin, AllPlantData.pumpkin),
    new Plant('crops', 'bellpepperGreen', new Vector2D(576 + (32 * 4), 128), plantAnimations.bellpepperGreen, AllPlantData.bellpepperGreen),
    new Plant('crops', 'bellpepperRed', new Vector2D(576 + (32 * 5), 128), plantAnimations.bellpepperRed, AllPlantData.bellpepperRed),
    new Plant('crops', 'bellpepperOrange', new Vector2D(576 + (32 * 6), 128), plantAnimations.bellpepperOrange, AllPlantData.bellpepperOrange),
    new Plant('crops', 'bellpepperYellow', new Vector2D(576 + (32 * 7), 128), plantAnimations.bellpepperYellow, AllPlantData.bellpepperYellow),
    new Plant('crops', 'carrot', new Vector2D(576 + (32 * 8), 128), plantAnimations.carrot, AllPlantData.carrot),
    new Plant('crops', 'parsnip', new Vector2D(576 + (32 * 9), 128), plantAnimations.parsnip, AllPlantData.parsnip),
    new Plant('crops', 'radish', new Vector2D(576 + (32 * 10), 128), plantAnimations.radish, AllPlantData.radish),
    new Plant('crops', 'beetroot', new Vector2D(576 + (32 * 11), 128), plantAnimations.beetroot, AllPlantData.beetroot),
    new Plant('crops', 'garlic', new Vector2D(576 + (32 * 12), 128), plantAnimations.garlic, AllPlantData.garlic),
    new Plant('crops', 'onionYellow', new Vector2D(576 + (32 * 13), 128), plantAnimations.onionYellow, AllPlantData.onionYellow),
    new Plant('crops', 'onionRed', new Vector2D(576 + (32 * 14), 128), plantAnimations.onionRed, AllPlantData.onionRed),
    new Plant('crops', 'onionWhite', new Vector2D(576 + (32 * 15), 128), plantAnimations.onionWhite, AllPlantData.onionWhite),
    new Plant('crops', 'onionGreen', new Vector2D(576 + (32 * 16), 128), plantAnimations.onionGreen, AllPlantData.onionGreen),
    new Plant('crops', 'hotPepper', new Vector2D(576 + (32 * 17), 128), plantAnimations.hotPepper, AllPlantData.hotPepper),
    new Plant('crops', 'chiliPepper', new Vector2D(576 + (32 * 18), 128), plantAnimations.chiliPepper, AllPlantData.chiliPepper),
    new Plant('crops', 'lettuceIceberg', new Vector2D(576 + (32 * 19), 128), plantAnimations.lettuceIceberg, AllPlantData.lettuceIceberg),
    new Plant('crops', 'cauliflower', new Vector2D(576 + (32 * 20), 128), plantAnimations.cauliflower, AllPlantData.cauliflower),
    new Plant('crops', 'broccoli', new Vector2D(576 + (32 * 21), 128), plantAnimations.broccoli, AllPlantData.broccoli),
];

for (let i = 0; i < AllPlants.length; i++) {
    CustomEventHandler.AddListener(AllPlants[i]);
}

export { MasterObject, AllPlants, GlobalFrameCounter };