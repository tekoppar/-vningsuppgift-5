/* import { Vector2D } from '../../../classes/vectors.js';
import { Tile } from '../../tiles/tile.js';
import { TextOperation, DrawingOperation, OperationType } from '../operation.js';
import { UIElement } from '../uielements/uiElement.js'; */

import { Vector2D, Tile, TextOperation, DrawingOperation, OperationType, UIElement } from '../../../internal.js';

class UIDrawer {
    constructor(spriteSheet, canvasDrawer) {
        this.spriteSheet = spriteSheet;
        this.canvasDrawer = canvasDrawer;
        this.uiElements = [];
    }

    AddUIElements() {
        if (this.uiElements.length > 0) {
            for (let i = 0; i < this.uiElements.length; i++) {
                this.uiElements[i].AddOperations();
            }

            let tempUIElements = this.uiElements;
            for (let i = 0; i < tempUIElements.length; i++) {
                if (tempUIElements[i].lifeTime <= 0) {
                    tempUIElements[i].RemoveUI();
                    tempUIElements.splice(i, 1);
                    i--;
                }
            }

            this.uiElements = tempUIElements;
        }
    }

    DrawUIElement(sprite, text, position) {
        let newUiElement = new UIElement();

        newUiElement.drawingOperations.push(
            new DrawingOperation(
                new Tile(
                    new Vector2D(position.x, position.y),
                    new Vector2D(15.05, 2.6),
                    new Vector2D(42, 32),
                    false,
                    'uipieces'
                ),
                this.canvasDrawer.gameGuiCanvas,
                this.canvasDrawer.canvasAtlases['uipieces'].canvas
            )
        );
        newUiElement.drawingOperations.push(
            new DrawingOperation(
                new Tile(
                    new Vector2D(position.x + 42, position.y),
                    new Vector2D(17.05, 2.6),
                    new Vector2D(42, 32),
                    false,
                    'uipieces'
                ),
                this.canvasDrawer.gameGuiCanvas,
                this.canvasDrawer.canvasAtlases['uipieces'].canvas
            )
        );

        newUiElement.drawingOperations.push(
            new DrawingOperation(
                new Tile(
                    new Vector2D(position.x + 10, position.y),
                    new Vector2D(sprite.x, sprite.y),
                    new Vector2D(sprite.width, sprite.height),
                    false,
                    sprite.canvas
                ),
                this.canvasDrawer.gameGuiCanvas,
                this.canvasDrawer.canvasAtlases[sprite.canvas].canvas
            )
        );
        newUiElement.drawingOperations.push(
            new TextOperation(
                text,
                new Vector2D(position.x + 42, position.y + (32 / 2)),
                false,
                this.canvasDrawer.gameGuiCanvas
            )
        );
        this.uiElements.push(newUiElement);

        this.canvasDrawer.AddDrawOperations(newUiElement.drawingOperations, OperationType.gui);
    }
}

export { UIDrawer };