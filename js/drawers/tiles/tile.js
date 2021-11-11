/* import { Matrix, Vector2D } from '../../classes/vectors.js';
import { CanvasDrawer } from '../canvas/customDrawer.js';
import { TileLUT } from '../tiles/TileLUT.js';
import { GetAtlasTileMatrix } from './atlasTileMatrix.js';
import { CollisionEditor } from '../../editors/collisionEditor.js';
import { PropEditor } from '../../editors/propEditor.js'; */

import { Matrix, Vector2D, CanvasDrawer, TileLUT, GetAtlasTileMatrix, CollisionEditor, PropEditor } from '../../internal.js';

const TileType = {
    Water: 0,
    Ground: 1,
    Air: 2,
    Cliff: 3,
    Prop: 4,
}

const TileTerrain = {
    Grass: 0,
    Rock: 1,
    Water: 2,
    Wood: 3,
    Soil: 4,
    Plant: 5,
    Tree: 6,
    Fence: 7,
    Leaves: 8,
}

class TileULDR {
    //UL UR DL DR U L D R
    static TileULDR = {
        0x00001100: 'UpLeft',
        0x00001000: 'Up',
        0x00001001: 'UpRight',
        0x00000100: 'Left',
        0x00001111: 'Middle',
        0x00000001: 'Right',
        0x00000110: 'DownLeft',
        0x00000010: 'Down',
        0x00000011: 'DownRight',
        0x00010000: 'CornerUpLeft',
        0x00100000: 'CornerUpRight',
        0x01000000: 'CornerDownLeft',
        0x10000000: 'CornerDownRight',
        0x01100000: 'CornerDoubleDLUR',
        0x10010000: 'CornerDoubleULDR'
    };

    static TileULDRLUT = {
        UpLeft: 0x00001100,
        Up: 0x00001000,
        UpRight: 0x00001001,
        Left: 0x00000100,
        Middle: 0x00001111,
        Right: 0x00000001,
        DownLeft: 0x00000110,
        Down: 0x00000010,
        DownRight: 0x00000011,
        CornerUpLeft: 0x01000000,
        CornerUpRight: 0x10000000,
        CornerDownLeft: 0x00010000,
        CornerDownRight: 0x00100000,
        CornerDoubleDLUR: 0x01100000,
        CornerDoubleULDR: 0x10010000,
    };

    static Get(value) {
        return TileULDR.TileULDRLUT[value] !== undefined ? value : TileULDR.TileULDR[value];
    }
}

class TileLUTData {
    constructor(atlas = 'terrain', tileType = TileType.Ground, tileTerrain = TileTerrain.Grass, transparent = false, tileULDR = TileULDR.TileULDRLUT.Middle, tileSet = 'default') {
        this.atlas = atlas;
        this.tileType = tileType;
        this.tileTerrain = tileTerrain;
        this.transparent = transparent;
        this.tileULDR = tileULDR;
        this.tileSet = tileSet;
        this.tilePosition = new Vector2D(0, 0);
    }
}

class TileData {
    static TileLUT = TileLUT;
    static TileLUTSets = {};
    static TilesSets = {};
    static tileData = new TileData();
    static tileGUI = {};
    static Selection;

    constructor() {

    }

    static AddTileLUT(tile) {
        if (TileData.TileLUT[tile.atlas] === undefined)
            TileData.TileLUT[tile.atlas] = {};

        if (TileData.TileLUT[tile.atlas][tile.tilePosition.y] === undefined)
            TileData.TileLUT[tile.atlas][tile.tilePosition.y] = {};

        if (TileData.TileLUT[tile.atlas][tile.tilePosition.y][tile.tilePosition.x] === undefined)
            TileData.TileLUT[tile.atlas][tile.tilePosition.y][tile.tilePosition.x] = {};

        TileData.TileLUT[tile.atlas][tile.tilePosition.y][tile.tilePosition.x] = new TileLUTData(
            tile.atlas,
            TileType[TileData.tileGUI.tiletype.value],
            TileTerrain[TileData.tileGUI.tileterrain.value],
            tile.IsTransparent(),
            TileULDR.Get(TileData.tileGUI.tileuldr.value),
            TileData.tileGUI.tileset.value
        );
    }

    static CanvasPortionToImage(tile) {
        if (CanvasDrawer.GCD.canvasAtlases[tile.atlas] !== undefined) {
            let canvas = CanvasDrawer.GCD.canvasAtlases[tile.atlas].canvas;
            let ctx = canvas.getContext('2d');
            let tempCanvas = document.createElement('canvas');
            tempCanvas.setAttribute('height', tile.size.y);
            tempCanvas.setAttribute('width', tile.size.x);

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

    CreateTileLUTList() {
        let typeKeys = Object.keys(TileData.TileLUT);
        for (let iT = 0; iT < typeKeys.length; iT++) {
            let yKeys = Object.keys(TileData.TileLUT[typeKeys[iT]]);
            for (let y = 0; y < yKeys.length; y++) {
                let xKeys = Object.keys(TileData.TileLUT[typeKeys[iT]][yKeys[y]]);
                for (let x = 0; x < xKeys.length; x++) {
                    let tileLUT = TileData.TileLUT[typeKeys[iT]][yKeys[y]][xKeys[x]];

                    if (tileLUT.tileSet === undefined)
                        tileLUT.tileSet = 'default';

                    let newTile = new Tile(
                        new Vector2D(0, 0),
                        new Vector2D(xKeys[x], yKeys[y]),
                        new Vector2D(32, 32),
                        tileLUT.transparent,
                        typeKeys[iT],
                        0,
                        tileLUT.tileType,
                        tileLUT.tileTerrain
                    );
                    let newImage = TileData.CanvasPortionToImage(newTile);

                    if (newImage !== null) {
                        if (tileLUT.tileSet !== 'default') {
                            if (document.getElementById('tile-lut-editor-tiles').querySelector('div[data-tileset="' + tileLUT.tileSet + '"]') === null) {
                                let setContainer = document.createElement('div');
                                setContainer.dataset.tileset = tileLUT.tileSet;
                                setContainer.className = 'tile-lut-editor-tiles-setcontainer';

                                if (TileData.TileLUTSets[tileLUT.tileSet] === undefined) {
                                    TileData.TileLUTSets[tileLUT.tileSet] = {};
                                    TileData.TilesSets[tileLUT.tileSet] = {};
                                }

                                tileLUT.tilePosition = new Vector2D(xKeys[x], yKeys[y]);
                                tileLUT.size = new Vector2D(32, 32);
                                TileData.TileLUTSets[tileLUT.tileSet][tileLUT.tileULDR] = tileLUT;
                                TileData.TilesSets[tileLUT.tileSet][tileLUT.tileULDR] = newTile;

                                setContainer.appendChild(newImage);
                                document.getElementById('tile-lut-editor-tiles').appendChild(setContainer);
                            } else {
                                tileLUT.tilePosition = new Vector2D(xKeys[x], yKeys[y]);
                                tileLUT.size = new Vector2D(32, 32);
                                TileData.TileLUTSets[tileLUT.tileSet][tileLUT.tileULDR] = tileLUT;
                                TileData.TilesSets[tileLUT.tileSet][tileLUT.tileULDR] = newTile;
                                document.getElementById('tile-lut-editor-tiles').querySelector('div[data-tileset="' + tileLUT.tileSet + '"]').appendChild(newImage);
                            }
                        } else {
                            tileLUT.tilePosition = new Vector2D(xKeys[x], yKeys[y]);
                            tileLUT.size = new Vector2D(32, 32);
                            document.getElementById('tile-lut-editor-tiles').appendChild(newImage);
                        }
                    }
                }
            }
        }
    }

    CreateTileLUTEditor() {
        if (document.getElementById('template-tile-lut-editor') == null) {
            window.requestAnimationFrame(() => this.CreateTileLUTEditor());
            return;
        }

        let template = document.getElementById('template-tile-lut-editor');

        if (template == null) {
            window.requestAnimationFrame(() => this.CreateTileLUTEditor());
            return;
        }

        let clone = template.content.cloneNode(true);
        TileData.tileGUI.name = clone.getElementById('tile-lut-editor-name');
        TileData.tileGUI.selection = clone.getElementById('tile-lut-editor-selection');
        TileData.tileGUI.atlas = clone.getElementById('tile-lut-editor-atlas');

        TileData.tileGUI.tileuldr = clone.getElementById('tile-lut-editor-tileuldr');
        TileData.tileGUI.tileterrain = clone.getElementById('tile-lut-editor-tileterrain');
        TileData.tileGUI.tiletype = clone.getElementById('tile-lut-editor-tiletype');
        TileData.tileGUI.tileset = clone.getElementById('tile-lut-editor-tileset');

        TileData.tileGUI.transparent = clone.getElementById('tile-lut-editor-transparent');
        TileData.tileGUI.button = clone.getElementById('tile-lut-editor-add');
        TileData.tileGUI.export = clone.getElementById('tile-lut-editor-export');

        TileData.tileGUI.tileeditortiles = clone.getElementById('tile-lut-editor-tiles');

        TileData.tileGUI.filtertileterrain = clone.getElementById('tile-lut-editor-filter-bool-tileterrain');
        TileData.tileGUI.filtertiletype = clone.getElementById('tile-lut-editor-filter-bool-tiletype');

        TileData.tileGUI.collisionEditor = clone.getElementById('tile-lut-editor-collision-editor');

        TileData.tileGUI.propEditor = clone.getElementById('tile-lut-editor-prop-editor');

        document.body.appendChild(clone);

        TileData.tileGUI.tileterrain.addEventListener('change', this);
        TileData.tileGUI.tiletype.addEventListener('change', this);
        TileData.tileGUI.button.addEventListener('click', this);
        TileData.tileGUI.export.addEventListener('click', this);
        TileData.tileGUI.collisionEditor.addEventListener('click', this);
        TileData.tileGUI.propEditor.addEventListener('click', this);

        TileData.tileGUI.filtertileterrain.addEventListener('input', this);
        TileData.tileGUI.filtertileterrain.children[0].addEventListener('click', this);
        TileData.tileGUI.filtertiletype.addEventListener('input', this);
        TileData.tileGUI.filtertiletype.children[0].addEventListener('click', this);

        let uldrKeys = Object.keys(TileULDR.TileULDRLUT);
        for (let i = 0; i < uldrKeys.length; i++) {
            let option = document.createElement('option');
            option.innerText = option.value = uldrKeys[i];

            TileData.tileGUI.tileuldr.appendChild(option.cloneNode(true));
        }

        let terrainKeys = Object.keys(TileTerrain);
        for (let i = 0; i < terrainKeys.length; i++) {
            let option = document.createElement('option');
            option.innerText = option.value = terrainKeys[i];

            let label = document.createElement('label'),
                checkbox = document.createElement('input');

            checkbox.type = 'checkbox';
            checkbox.checked = true;
            checkbox.dataset.value = terrainKeys[i];
            label.innerText = terrainKeys[i];
            label.appendChild(checkbox);

            TileData.tileGUI.tileterrain.appendChild(option.cloneNode(true));
            TileData.tileGUI.filtertileterrain.appendChild(label);
        }

        let tileTypeKeys = Object.keys(TileType);
        for (let i = 0; i < tileTypeKeys.length; i++) {
            let option = document.createElement('option');
            option.innerText = option.value = tileTypeKeys[i];

            let label = document.createElement('label'),
                checkbox = document.createElement('input');

            checkbox.type = 'checkbox';
            checkbox.checked = true;
            checkbox.dataset.value = tileTypeKeys[i];
            label.innerText = tileTypeKeys[i];
            label.appendChild(checkbox);

            TileData.tileGUI.tiletype.appendChild(option.cloneNode(true));
            TileData.tileGUI.filtertiletype.appendChild(label);
        }

        this.CreateTileLUTList();

        TileData.tileData.SelectionLoop();
    }

    SelectionLoop() {
        let tile;
        if (CanvasDrawer.GCD.selectedSprite !== undefined &&
            ((Array.isArray(CanvasDrawer.GCD.selectedSprite) === true && TileData.Selection !== CanvasDrawer.GCD.selectedSprite[0]) ||
                (Array.isArray(CanvasDrawer.GCD.selectedSprite) === false && TileData.Selection !== CanvasDrawer.GCD.selectedSprite))) {

            if (Array.isArray(CanvasDrawer.GCD.selectedSprite) === true)
                tile = CanvasDrawer.GCD.selectedSprite[0];
            else
                tile = CanvasDrawer.GCD.selectedSprite;

            TileData.tileGUI.selection.innerText = 'x: ' + tile.position.x + ' y: ' + tile.position.y +
                ' tX: ' + tile.tilePosition.x + ' tY: ' + tile.tilePosition.y +
                ' w: ' + tile.size.x + ' h: ' + tile.size.y;
            TileData.tileGUI.atlas.innerText = tile.atlas;

            tile.transparent = undefined;
            TileData.tileGUI.transparent.innerText = tile.IsTransparent();

            TileData.tileGUI.tileterrain.value = TileData.tileGUI.tileterrain.options[tile.tileTerrain].value;
            TileData.tileGUI.tiletype.value = TileData.tileGUI.tiletype.options[tile.tileType].value;
            TileData.tileGUI.tileuldr.value = TileULDR.Get(tile.tileULDR);
            TileData.tileGUI.tileset.value = tile.tileSet;

            TileData.Selection = tile;
        }
    }

    FilterTiles() {
        let matchingTiles = TileData.tileGUI.tileeditortiles.querySelectorAll('img');

        for (let i = 0; i < matchingTiles.length; i++) {
            if (TileData.tileGUI.filtertiletype.children[Number(matchingTiles[i].dataset.tileType) + 1].children[0].checked === true &&
                TileData.tileGUI.filtertileterrain.children[Number(matchingTiles[i].dataset.tileTerrain) + 1].children[0].checked === true)
                matchingTiles[i].style.display = 'block';
            else
                matchingTiles[i].style.display = 'none';
        }
    }

    handleEvent(e) {
        switch (e.type) {
            case 'click':
                switch (e.target.id) {
                    case 'tile-lut-editor-add':
                        if (Array.isArray(CanvasDrawer.GCD.selectedSprite) === false)
                            TileData.AddTileLUT(CanvasDrawer.GCD.selectedSprite);
                        else {
                            for (let i = 0; i < CanvasDrawer.GCD.selectedSprite.length; i++) {
                                TileData.AddTileLUT(CanvasDrawer.GCD.selectedSprite[i]);
                            }
                        }
                        break;

                    case 'tile-lut-editor-export':
                        navigator.clipboard.writeText(JSON.stringify(TileData.TileLUT));
                        break;

                    case 'tile-lut-editor-filter-bool-tiletype-legend':
                        for (let i = 1; i < TileData.tileGUI.filtertiletype.children.length; i++) {
                            TileData.tileGUI.filtertiletype.children[i].children[0].checked = true;
                        }
                        this.FilterTiles();
                        break;
                    case 'tile-lut-editor-filter-bool-tileterrain-legend':
                        for (let i = 1; i < TileData.tileGUI.filtertileterrain.children.length; i++) {
                            TileData.tileGUI.filtertileterrain.children[i].children[0].checked = true;
                        }
                        this.FilterTiles();
                        break;

                    case 'tile-lut-editor-collision-editor':
                        if (CanvasDrawer.GCD.selectedSprite !== undefined)
                            CollisionEditor.GCEditor.Open(CanvasDrawer.GCD.selectedSprite);
                        break;

                    case 'tile-lut-editor-prop-editor':
                        PropEditor.GPEditor.ShowProps();
                        break;
                }
                break;

            case 'change':
                switch (e.target.id) {
                    case 'tile-lut-editor-tileterrain':
                        if (Array.isArray(CanvasDrawer.GCD.selectedSprite) === false) {
                            CanvasDrawer.GCD.selectedSprite.tileTerrain = TileData.tileGUI.tileterrain.selectedIndex;
                            TileData.AddTileLUT(CanvasDrawer.GCD.selectedSprite);
                        } else {
                            for (let i = 0; i < CanvasDrawer.GCD.selectedSprite.length; i++) {
                                CanvasDrawer.GCD.selectedSprite[i].tileTerrain = TileData.tileGUI.tileterrain.selectedIndex;
                                TileData.AddTileLUT(CanvasDrawer.GCD.selectedSprite[i]);
                            }
                        }
                        break;

                    case 'tile-lut-editor-tiletype':
                        if (Array.isArray(CanvasDrawer.GCD.selectedSprite) === false) {
                            CanvasDrawer.GCD.selectedSprite.tileType = TileData.tileGUI.tiletype.selectedIndex;
                            TileData.AddTileLUT(CanvasDrawer.GCD.selectedSprite);
                        } else {
                            for (let i = 0; i < CanvasDrawer.GCD.selectedSprite.length; i++) {
                                CanvasDrawer.GCD.selectedSprite[i].tileType = TileData.tileGUI.tiletype.selectedIndex;
                                TileData.AddTileLUT(CanvasDrawer.GCD.selectedSprite[i]);
                            }
                        }
                        break;
                }
                break;

            case 'input':
                switch (e.currentTarget.id) {
                    case 'tile-lut-editor-filter-bool-tiletype':
                    case 'tile-lut-editor-filter-bool-tileterrain':
                        this.FilterTiles();
                        break;
                }
                break;
        }
    }
}

class TileF {
    static PaintTile(tile, position) {
        let operations = CanvasDrawer.GCD.GetTileAtPosition(position, false);

        for (let i = 0; i < operations.length; i++) {
            //let tilePaintULDRMatrix = TileF.ConstructPaintULDRMatrix(operations[i].tile);
            let centerTileOffset = TileF.GetTileOffsets(operations[i].tile);
            let centerTile = TileF.GetCenterTile(tile);
            tile.tilePosition.Add(centerTile);
            //let paintTiles = TileF.ConstructTilePaintMatrix(tile, tilePaintULDRMatrix.ToArray());
            //let allTiles = TileF.GetSurroundingTiles(operations[i].tile.position, TileF.GetULDRMatrix(operations[i].tile));

            operations[i].tile.ChangeSprite(tile);
            //for (let i2 = 0; i2 < allTiles.length; i2++)
            //allTiles[i2].tile.ChangeSprite(paintTiles[i2]);
        }

        let newTiles = [];
        for (let i = 0; i < operations.length; i++) {
            let trueMatrix = TileF.ConstructAtlasTileMatrix(operations[i].tile);
            trueMatrix.y2 = 0;
            let uldr = trueMatrix.ToBinary();
            //console.log(trueMatrix.To3DArray(), GetAtlasTileMatrix(uldr.replace('0x', '')));
            //uldr = GetAtlasTileMatrix(uldr.replace('0x', ''));
            //let aroundTiles = TileF.GetSurroundingTiles(operations[i].tile.position, trueMatrix);
            //console.log(aroundTiles);

            let offsetTileMatrix = new Matrix(
                new Vector2D(-1, -1), new Vector2D(0, -1), new Vector2D(1, -1),
                new Vector2D(-1, 0), new Vector2D(0, 0), new Vector2D(1, 0),
                new Vector2D(-1, 1), new Vector2D(0, 1), new Vector2D(1, 1)
            );
            offsetTileMatrix = offsetTileMatrix.ToArray();

            let allTiles = TileF.GetSurroundingTiles(operations[i].tile.position, TileF.GetULDRMatrix(operations[i].tile));
            for (let i2 = 0; i2 < allTiles.length; i2++) {
                let newTilePaintMatrix = TileF.ConstructAtlasTileMatrix(allTiles[i2].tile);
                let temp = trueMatrix.Clone();
                temp = temp.OffsetMatrix(offsetTileMatrix[i2]);

                if (temp.length < 1)
                    break;

                newTilePaintMatrix.IsOne(temp);
                //console.log(newTilePaintMatrix.To3DArray(), newTilePaintMatrix.ToBinary());
                let uldr = newTilePaintMatrix.ToBinary();
                //console.log(GetAtlasTileMatrix(uldr.replace('0x', '')), newTilePaintMatrix.y2);
                uldr = TileULDR.Get(Number(GetAtlasTileMatrix(uldr.replace('0x', ''), newTilePaintMatrix.y2)));
                //console.log(uldr);

                let newTileData;
                if (uldr !== undefined) {
                    if (uldr.includes('CornerDouble')) {
                        if (TileData.TileLUTSets['soilTiledDoubleCorner'][uldr] !== undefined)
                            newTileData = TileData.TileLUTSets['soilTiledDoubleCorner'][uldr];
                    } else if (uldr.includes('Corner')) {
                        if (TileData.TileLUTSets['soilTiledCorner'][uldr] !== undefined)
                            newTileData = TileData.TileLUTSets['soilTiledCorner'][uldr];
                    } else {
                        if (TileData.TileLUTSets['soilTiled'][uldr] !== undefined)
                            newTileData = TileData.TileLUTSets['soilTiled'][uldr];
                    }
                }

                if (newTileData !== undefined)
                    newTiles.push(newTileData);
                //console.log(TileF.ConstructTilePaintMatrix(allTiles[i2].tile, TileF.ConstructPaintULDRMatrix(allTiles[i2].tile).ToArray()), TileF.ConstructPaintULDRMatrix(allTiles[i2].tile));
            }

            for (let i2 = 0; i2 < allTiles.length; i2++) {
                if (newTiles[i2] !== undefined && newTiles[i2] !== null) {
                    allTiles[i2].tile.ChangeSprite(newTiles[i2]);
                    CanvasDrawer.UpdateTerrainOperation(allTiles[i2]);
                }
            }
        }
    }

    static ConstructAtlasTileMatrix(tile) {
        let surroundingTiles = TileF.GetSurroundingTiles(tile.position);
        surroundingTiles = Matrix.FromArray(surroundingTiles);

        let a = surroundingTiles.Filter(['tile', 'tileULDR'], 'Middle');
        a.ConvertToBinary();
        a.InvertMatrix();

        surroundingTiles = surroundingTiles.Filter(['tile', 'tileSet'], 'soilTiled');
        surroundingTiles.ConvertToBinary();
        surroundingTiles.InvertMatrix();
        surroundingTiles.IsOne(a);
        return surroundingTiles;
    }

    static ConstructPaintULDRMatrixTiles(tile) {
        let surroundingTiles = TileF.GetSurroundingTiles(tile.position);
        surroundingTiles = Matrix.FromArray(surroundingTiles);

        surroundingTiles = surroundingTiles.Filter(['tile', 'tileSet'], 'soilTiled');
        surroundingTiles.ConvertToBinary();
        let tempM = surroundingTiles.Clone();
        tempM = tempM.ToBinary();
        let testM = GetAtlasTileMatrix(tempM.replace('0x', ''));
        //console.log(surroundingTiles.To3DArray(), tempM, testM);
        //surroundingTiles.InvertMatrix();
        let uldr = surroundingTiles.ToBinary();
        //console.log(uldr, TileULDR.Get(Number(uldr)), TileULDR.Get(GetAtlasTileMatrix(uldr.replace('0x', ''))));
        let uldrText = TileULDR.Get(GetAtlasTileMatrix(uldr.replace('0x', '')));// TileULDR.Get(Number(uldr));

        if (uldrText !== undefined) {
            if (uldrText.includes('CornerDouble')) {
                if (TileData.TileLUTSets['soilTiledDoubleCorner'][uldrText] !== undefined)
                    return TileData.TileLUTSets['soilTiledDoubleCorner'][uldrText];
            }
            else if (uldrText.includes('Corner')) {
                if (TileData.TileLUTSets['soilTiledCorner'][uldrText] !== undefined)
                    return TileData.TileLUTSets['soilTiledCorner'][uldrText];
            } else {
                if (TileData.TileLUTSets['soilTiled'][uldrText] !== undefined)
                    return TileData.TileLUTSets['soilTiled'][uldrText];
            }
        }

        return null;
    }

    static GetSurroundingTiles(position, tilePaintULDRMatrix = null) {
        let pos = position.Clone();
        pos.Div(new Vector2D(32, 32));
        pos.Ceil();

        let offsetTileMatrix = new Matrix(
            new Vector2D(-1, -1), new Vector2D(0, -1), new Vector2D(1, -1),
            new Vector2D(-1, 0), new Vector2D(0, 0), new Vector2D(1, 0),
            new Vector2D(-1, 1), new Vector2D(0, 1), new Vector2D(1, 1)
        );

        if (tilePaintULDRMatrix !== null)
            offsetTileMatrix.Null(tilePaintULDRMatrix);

        offsetTileMatrix = offsetTileMatrix.ToArray();
        pos = new Matrix(pos.Clone(), pos.Clone(), pos.Clone(), pos.Clone(), pos.Clone(), pos.Clone(), pos.Clone(), pos.Clone(), pos.Clone());

        if (tilePaintULDRMatrix !== null)
            pos.Null(tilePaintULDRMatrix);

        pos = pos.ToArray();

        let operations = [];
        for (let i = 0; i < pos.length; i++) {
            if (pos[i] !== null && offsetTileMatrix[i] !== null) {
                pos[i].Add(offsetTileMatrix[i]);
                operations = operations.concat(CanvasDrawer.GCD.GetTileAtPosition(pos[i], false));
            }
        }

        return operations;
    }

    static ConstructTilePaintMatrix(tile, tilePaintULDRMatrix) {
        let offsetTileMatrix = new Matrix(
            new Vector2D(-1, -1), new Vector2D(0, -1), new Vector2D(1, -1),
            new Vector2D(-1, 0), new Vector2D(0, 0), new Vector2D(1, 0),
            new Vector2D(-1, 1), new Vector2D(0, 1), new Vector2D(1, 1)
        );
        offsetTileMatrix = offsetTileMatrix.ToArray();

        let paintTiles = [];
        for (let i = 0; i < offsetTileMatrix.length; i++) {
            if (tilePaintULDRMatrix[i] !== null) {
                let clone = tile.Clone();
                clone.tilePosition.Add(offsetTileMatrix[i]);
                paintTiles.push(clone);
            }
        }

        return paintTiles;
    }

    static GetCenterTile(tile) {
        switch (TileULDR.TileULDRLUT[tile.tileULDR]) {
            case TileULDR.TileULDRLUT.UpLeft: return new Vector2D(-1, -1);
            case TileULDR.TileULDRLUT.Up: return new Vector2D(0, -1);
            case TileULDR.TileULDRLUT.UpRight: return new Vector2D(1, -1);
            case TileULDR.TileULDRLUT.Left: return new Vector2D(-1, 0);
            case TileULDR.TileULDRLUT.Middle: return new Vector2D(0, 0);
            case TileULDR.TileULDRLUT.Right: return new Vector2D(1, 0);
            case TileULDR.TileULDRLUT.DownLeft: return new Vector2D(-1, 1);
            case TileULDR.TileULDRLUT.Down: return new Vector2D(0, 1);
            case TileULDR.TileULDRLUT.DownRight: return new Vector2D(1, 1);
        }
    }

    static GetTileOffsets(tile) {
        let tilesToPaintMatrix;

        tilesToPaintMatrix = TileF.GetULDRMatrix(tile);

        let offsetTileMatrix = new Matrix(
            new Vector2D(-1, -1), new Vector2D(0, -1), new Vector2D(1, -1),
            new Vector2D(-1, 0), new Vector2D(0, 0), new Vector2D(1, 0),
            new Vector2D(-1, 1), new Vector2D(0, 1), new Vector2D(1, 1)
        );
        offsetTileMatrix.Null(tilesToPaintMatrix);
        return offsetTileMatrix;
    }

    static GetULDRMatrix(tile) {
        let tilesToPaintMatrix;

        switch (TileULDR.TileULDRLUT[tile.tileULDR]) {
            case TileULDR.TileULDRLUT.UpLeft: tilesToPaintMatrix = new Matrix(
                1, 1, 1,
                1, 1, 0,
                1, 0, 0
            ); break;

            case TileULDR.TileULDRLUT.Up: tilesToPaintMatrix = new Matrix(
                1, 1, 1,
                1, 1, 1,
                0, 0, 0
            ); break;

            case TileULDR.TileULDRLUT.UpRight: tilesToPaintMatrix = new Matrix(
                1, 1, 1,
                0, 1, 1,
                0, 0, 1
            ); break;

            case TileULDR.TileULDRLUT.Left: tilesToPaintMatrix = new Matrix(
                1, 1, 0,
                1, 1, 0,
                1, 1, 0
            ); break;

            case TileULDR.TileULDRLUT.Middle: tilesToPaintMatrix = new Matrix(
                1, 1, 1,
                1, 1, 1,
                1, 1, 1
            ); break;

            case TileULDR.TileULDRLUT.Right: tilesToPaintMatrix = new Matrix(
                0, 1, 1,
                0, 1, 1,
                0, 1, 1
            ); break;

            case TileULDR.TileULDRLUT.DownLeft: tilesToPaintMatrix = new Matrix(
                1, 0, 0,
                1, 1, 0,
                1, 1, 1
            ); break;

            case TileULDR.TileULDRLUT.Down: tilesToPaintMatrix = new Matrix(
                0, 0, 0,
                1, 1, 1,
                1, 1, 1
            ); break;

            case TileULDR.TileULDRLUT.DownRight: tilesToPaintMatrix = new Matrix(
                0, 0, 1,
                0, 1, 1,
                1, 1, 1
            ); break;

            case TileULDR.TileULDRLUT.CornerUpLeft: tilesToPaintMatrix = new Matrix(
                0, 0, 1,
                0, 1, 1,
                1, 1, 1
            ); break;

            case TileULDR.TileULDRLUT.CornerUpRight: tilesToPaintMatrix = new Matrix(
                1, 0, 0,
                1, 1, 0,
                1, 1, 1
            ); break;

            case TileULDR.TileULDRLUT.CornerDownLeft: tilesToPaintMatrix = new Matrix(
                1, 1, 1,
                0, 1, 1,
                0, 0, 1
            ); break;

            case TileULDR.TileULDRLUT.CornerDownRight: tilesToPaintMatrix = new Matrix(
                1, 1, 1,
                1, 1, 0,
                1, 0, 0
            ); break;
        }

        return tilesToPaintMatrix;
    }

    static ConstructPaintULDRMatrix(tile) {
        let tilesToPaintMatrix;

        let tilesPaintMatrix = new Matrix(
            TileULDR.TileULDR[TileULDR.TileULDRLUT.UpLeft], TileULDR.TileULDR[TileULDR.TileULDRLUT.Up], TileULDR.TileULDR[TileULDR.TileULDRLUT.UpRight],
            TileULDR.TileULDR[TileULDR.TileULDRLUT.Left], TileULDR.TileULDR[TileULDR.TileULDRLUT.Middle], TileULDR.TileULDR[TileULDR.TileULDRLUT.Right],
            TileULDR.TileULDR[TileULDR.TileULDRLUT.DownLeft], TileULDR.TileULDR[TileULDR.TileULDRLUT.Down], TileULDR.TileULDR[TileULDR.TileULDRLUT.DownRight]
        )

        tilesToPaintMatrix = TileF.GetULDRMatrix(tile);

        if (tilesToPaintMatrix !== undefined) {
            tilesPaintMatrix.Null(tilesToPaintMatrix);
            return tilesPaintMatrix;
        } else
            return null;
    }
}

class Tile {
    constructor(pos = new Vector2D(0, 0), tilePos = new Vector2D(0, 0), size = new Vector2D(32, 32),
        transparent = undefined, atlas = 'terrain', drawIndex = 0, tileType = TileType.Ground, tileTerrain = TileTerrain.Grass) {
        this.position = pos;
        this.tilePosition = tilePos;
        this.size = size;
        this.tileType = tileType;
        this.tileTerrain = tileTerrain;
        this.atlas = atlas;
        this.transparent = transparent;
        this.needsToBeRedrawn = true;
        this.drawIndex = drawIndex;
        this.tileULDR = TileULDR.TileULDRLUT.Middle;
        this.tileSet = 'default';

        this.UpdateTileData();
    }

    UpdateTileData() {
        if (TileLUT[this.atlas] !== undefined) {
            if (TileLUT[this.atlas][this.tilePosition.y] !== undefined) {
                if (TileLUT[this.atlas][this.tilePosition.y][this.tilePosition.x] !== undefined) {
                    this.tileType = TileLUT[this.atlas][this.tilePosition.y][this.tilePosition.x].tileType;
                    this.tileTerrain = TileLUT[this.atlas][this.tilePosition.y][this.tilePosition.x].tileTerrain;
                    this.transparent = TileLUT[this.atlas][this.tilePosition.y][this.tilePosition.x].transparent;
                    this.tileULDR = TileLUT[this.atlas][this.tilePosition.y][this.tilePosition.x].tileULDR;

                    if (this.tileULDR === undefined)
                        this.tileULDR = TileULDR.TileULDRLUT.Middle;

                    this.tileSet = TileLUT[this.atlas][this.tilePosition.y][this.tilePosition.x].tileSet;
                    if (this.tileSet === undefined)
                        this.tileSet = 'default';
                }
            }
        }
    }

    ChangeSprite(tile) {
        this.tilePosition = tile.tilePosition;
        this.size = tile.size;
        this.atlas = tile.atlas;
        this.transparent = tile.transparent;
        this.needsToBeRedrawn = true;
        this.UpdateTileData();
    }

    GetDrawIndex() {
        return this.drawIndex;
    }

    GetPosX() {
        return this.tilePosition.x * this.size.x;
    }

    GetPosY() {
        return this.tilePosition.y * this.size.y;
    }

    GetDrawPosX() {
        return Math.ceil(this.position.x / 32);
    }

    GetDrawPosY() {
        return Math.ceil(this.position.y / 32);
    }

    IsTransparent() {
        if (this.transparent == undefined) {
            let pixels = document.getElementById(this.atlas).getContext('2d').getImageData(this.GetPosX(), this.GetPosY(), this.size.x, this.size.y).data;

            for (let i = 0; i < pixels.length; i += 4) {
                if (pixels[i + 3] < 255) {
                    this.transparent = true;
                    return this.transparent;
                }
            }
        } else {
            return this.transparent;
        }

        this.transparent = false;
        return this.transparent;
    }

    Clone() {
        return new Tile(new Vector2D(this.position.x, this.position.y), new Vector2D(this.tilePosition.x, this.tilePosition.y), new Vector2D(this.size.x, this.size.y), this.transparent, this.atlas, this.tileType, this.tileTerrain);
    }

    toJSON() {
        return {
            p: this.position,
            lut: [this.atlas, this.tilePosition.y, this.tilePosition.x],
        }
    }

    handleEvent(e) {
        switch (e.type) {
            case 'click':
                if (document.body.querySelector('img.tile-lut-editor-tiles-selected') !== null)
                    document.body.querySelector('img.tile-lut-editor-tiles-selected').classList.remove('tile-lut-editor-tiles-selected');

                e.target.classList.add('tile-lut-editor-tiles-selected');
                CanvasDrawer.GCD.SetSelection(this);
                break;
        }
    }
}

export { Tile, TileData, TileType, TileTerrain, TileF };