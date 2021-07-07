import { CustomEventHandler } from './customEvents.js';
import { Plant, PlantData, AllPlantData } from './plants.js';
import { Character, MainCharacter } from './character.js';
import { InputHandler } from './inputEvents.js';
import { Vector2D } from './vectors.js';
import { plantAnimations } from './AllAnimations.js';
import { CanvasSprite, CanvasDrawer, CanvasAtlas } from './customDrawer.js';
import { Cobject } from './object.js';
import { TileData } from './tile.js';
import { Seed } from './plantitem.js';
import { Shovel, Hoe, Item } from './item.js';
import { Shop } from './shop.js';
import { TileMaker } from './tilemaker.js';
import { CollisionEditor } from './collisionEditor.js';
import { PolygonCollision } from './collision.js';

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

    GameStart() {
        this.CheckIfClassesInitialized();

        if (this.classesHasBeenInitialized === true && this.objectsHasBeenInitialized === false) {
            //this.canvasDrawer = new CanvasDrawer();

            this.objectsHasBeenInitialized = true;
        }

        if (this.objectsHasBeenInitialized === true) {
            this.GameBegin();
            this.GameLoop();
        } else {
            GlobalFrameCounter++;
            window.requestAnimationFrame(() => this.GameStart());
        }
    }

    GameBegin() {
        if (this.gameHasBegun === false) {
            for (let i = 0; i < AllPlants.length; i++) {
                CustomEventHandler.AddListener(AllPlants[i]);
            }

            character.inventory.SetupInventory();
            character.inventory.AddItem(new Shovel('shovel', 0));
            character.inventory.AddItem(new Hoe('hoe', 0));
            character.inventory.AddItem(new Seed('cornSeed', 1));
            character.inventory.AddMoney(5000);

            TileData.tileData.CreateTileLUTEditor();
            CollisionEditor.GCEditor = new CollisionEditor();
            TileMaker.GenerateCustomTiles();
            shopTest.SetupMarket();

            shopTest.NewCollision(new PolygonCollision(
                shopTest.position.Clone(),
                shopTest.size.Clone(),
                [new Vector2D(0, 0), new Vector2D(95, 0), new Vector2D(95, 105), new Vector2D(0, 105)],
                false,
                shopTest,
                true
            ));

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
        this.GameLoopActions();

        GlobalFrameCounter++;
        window.requestAnimationFrame(() => this.GameLoop());
    }
}

var character = new MainCharacter("/content/sprites/lpcfemalelight_updated.png", 'femaleLight', 'mainP');
var shopTest = new Shop('/content/sprites/farming_fishing.png', 'seedShop', new Vector2D(368, 256), undefined, 'pepoSeedShop');
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
InputHandler.GIH.AddListener(character);
character.AddAttachment('/content/sprites/red.png', 'redHair');
character.AddAttachment('/content/sprites/lpcfemaleunderdress.png', 'underDress');

var AllPlants = [
    new Plant("/content/sprites/crops.png", 'crops', 'corn', new Vector2D(576, 128), plantAnimations.corn, AllPlantData.corn),
    new Plant("/content/sprites/crops.png", 'crops', 'potato', new Vector2D(576 + (32 * 1), 128), plantAnimations.potato, AllPlantData.potato),
    new Plant("/content/sprites/crops.png", 'crops', 'watermelon', new Vector2D(576 + (32 * 2), 128), plantAnimations.watermelon, AllPlantData.watermelon),
    new Plant("/content/sprites/crops.png", 'crops', 'pumpkin', new Vector2D(576 + (32 * 3), 128), plantAnimations.pumpkin, AllPlantData.pumpkin),
    new Plant("/content/sprites/crops.png", 'crops', 'bellpepperGreen', new Vector2D(576 + (32 * 4), 128), plantAnimations.bellpepperGreen, AllPlantData.bellpepperGreen),
    new Plant("/content/sprites/crops.png", 'crops', 'bellpepperRed', new Vector2D(576 + (32 * 5), 128), plantAnimations.bellpepperRed, AllPlantData.bellpepperRed),
    new Plant("/content/sprites/crops.png", 'crops', 'bellpepperOrange', new Vector2D(576 + (32 * 6), 128), plantAnimations.bellpepperOrange, AllPlantData.bellpepperOrange),
    new Plant("/content/sprites/crops.png", 'crops', 'bellpepperYellow', new Vector2D(576 + (32 * 7), 128), plantAnimations.bellpepperYellow, AllPlantData.bellpepperYellow),
    new Plant("/content/sprites/crops.png", 'crops', 'carrot', new Vector2D(576 + (32 * 8), 128), plantAnimations.carrot, AllPlantData.carrot),
    new Plant("/content/sprites/crops.png", 'crops', 'parsnip', new Vector2D(576 + (32 * 9), 128), plantAnimations.parsnip, AllPlantData.parsnip),
    new Plant("/content/sprites/crops.png", 'crops', 'radish', new Vector2D(576 + (32 * 10), 128), plantAnimations.radish, AllPlantData.radish),
    new Plant("/content/sprites/crops.png", 'crops', 'beetroot', new Vector2D(576 + (32 * 11), 128), plantAnimations.beetroot, AllPlantData.beetroot),
    new Plant("/content/sprites/crops.png", 'crops', 'garlic', new Vector2D(576 + (32 * 12), 128), plantAnimations.garlic, AllPlantData.garlic),
    new Plant("/content/sprites/crops.png", 'crops', 'onionYellow', new Vector2D(576 + (32 * 13), 128), plantAnimations.onionYellow, AllPlantData.onionYellow),
    new Plant("/content/sprites/crops.png", 'crops', 'onionRed', new Vector2D(576 + (32 * 14), 128), plantAnimations.onionRed, AllPlantData.onionRed),
    new Plant("/content/sprites/crops.png", 'crops', 'onionWhite', new Vector2D(576 + (32 * 15), 128), plantAnimations.onionWhite, AllPlantData.onionWhite),
    new Plant("/content/sprites/crops.png", 'crops', 'onionGreen', new Vector2D(576 + (32 * 16), 128), plantAnimations.onionGreen, AllPlantData.onionGreen),
    new Plant("/content/sprites/crops.png", 'crops', 'hotPepper', new Vector2D(576 + (32 * 17), 128), plantAnimations.hotPepper, AllPlantData.hotPepper),
    new Plant("/content/sprites/crops.png", 'crops', 'chiliPepper', new Vector2D(576 + (32 * 18), 128), plantAnimations.chiliPepper, AllPlantData.chiliPepper),
    new Plant("/content/sprites/crops.png", 'crops', 'lettuceIceberg', new Vector2D(576 + (32 * 19), 128), plantAnimations.lettuceIceberg, AllPlantData.lettuceIceberg),
    new Plant("/content/sprites/crops.png", 'crops', 'cauliflower', new Vector2D(576 + (32 * 20), 128), plantAnimations.cauliflower, AllPlantData.cauliflower),
    new Plant("/content/sprites/crops.png", 'crops', 'broccoli', new Vector2D(576 + (32 * 21), 128), plantAnimations.broccoli, AllPlantData.broccoli),
];

for (let i = 0; i < AllPlants.length; i++) {
    CustomEventHandler.AddListener(AllPlants[i]);
}

export { MasterObject, character, AllPlants, GlobalFrameCounter };