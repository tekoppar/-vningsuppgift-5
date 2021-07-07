import { CanvasDrawer, CanvasAtlasObject } from './customDrawer.js';
import { TileData, Tile, TileType, TileTerrain } from './tile.js';
import { Vector2D } from './vectors.js';

class TileMaker {
    static CustomTiles;

    static DrawOnCanvas(tempCanvas, drawingTile, x, y) {
        if (CanvasDrawer.GCD.canvasAtlases[drawingTile.atlas] !== undefined) {
            let canvas = CanvasDrawer.GCD.canvasAtlases[drawingTile.atlas].canvas;
            tempCanvas.getContext('2d').drawImage(
                canvas,
                drawingTile.GetPosX(),
                drawingTile.GetPosY(),
                drawingTile.size.x,
                drawingTile.size.y,
                x * 32,
                y * 32,
                drawingTile.size.x,
                drawingTile.size.y
            );
        }
    }

    static CombineTilesToImage(tiles, tileLayout, objectName = 'default') {
        let tempCanvas = document.createElement('canvas');
        let imageSize = new Vector2D(tileLayout[0].length * 32, tileLayout.length * 32);
        tempCanvas.setAttribute('height', imageSize.y);
        tempCanvas.setAttribute('width', imageSize.x);

        for (let y = 0; y < tileLayout.length; y++) {
            for (let x = 0; x < tileLayout[y].length; x++) {

                if (Array.isArray(tileLayout[y][x]) === true) {
                    for (let i = 0; i < tileLayout[y][x].length; i++) {
                        TileMaker.DrawOnCanvas(tempCanvas, tiles[tileLayout[y][x][i]], x, y);
                    }
                } else {
                    let drawingTile = tiles[tileLayout[y][x]];
                    TileMaker.DrawOnCanvas(tempCanvas, drawingTile, x, y);
                }
            }
        }

        let newCanvasAtlas = new CanvasAtlasObject(CanvasDrawer.GCD, tempCanvas.toDataURL('image/png'), imageSize.x + 1, imageSize.y + 1, 32, objectName);
        CanvasDrawer.GCD.AddAtlas(newCanvasAtlas, objectName);
    }

    static CanvasPortionToImage(tile) {
        if (CanvasDrawer.GCD.canvasAtlases[tile.atlas] !== undefined) {
            let canvas = CanvasDrawer.GCD.canvasAtlases[tile.atlas].canvas;
            let ctx = canvas.getContext('2d');
            let tempCanvas = document.createElement('canvas');
            tempCanvas.width = tile.size.x;
            tempCanvas.height = tile.size.y;

            tempCanvas.getContext('2d').drawImage(canvas, tile.GetPosX(), tile.GetPosY(), tile.size.x, tile.size.y, 0, 0, 32, 32);

            let newImage = new Image(tile.size.x, tile.size.y);
            newImage.src = tempCanvas.toDataURL('image/png');
            newImage.dataset.tileType = tile.tileType;
            newImage.dataset.tileTerrain = tile.tileTerrain;
            newImage.addEventListener('click', tile);

            return newImage;
        }
        return null;
    }

    static GenerateCustomTiles() {
        TileMaker.CustomTiles = {
            seedStand: {
                tiles: [
                    new Tile(new Vector2D(0, 0), new Vector2D(5, 8), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(5, 4), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(5, 9), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(14, 10), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(5, 5), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(6, 12), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(7, 12), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(5, 13), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(6, 13), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(5, 12), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(8, 13), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(8, 12), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(5, 14), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(6, 14), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(7, 10), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(28, 10), new Vector2D(32, 32), true, 'fruitsveggies', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(28, 12), new Vector2D(32, 32), true, 'fruitsveggies', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(5, 8), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(7, 13), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(9, 13), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                    new Tile(new Vector2D(0, 0), new Vector2D(8, 12), new Vector2D(32, 32), true, 'farmingfishing', 0, TileType.Prop, TileTerrain.Wood),
                ],
                tileLayout: [
                    [1, 1, 1],
                    [12, [20, 14], 13],
                    [[17, 16, 18, 6], [19, 3], [3, 5]],
                    [2, 2, 2],
                ],
            }
        };
    }
}

export { TileMaker };