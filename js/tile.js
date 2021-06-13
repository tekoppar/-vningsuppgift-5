import { Vector2D } from './vectors.js';

const TileType = {
    Water: 0,
    Ground: 1,
    Air: 2,
    Cliff: 3,
}

const TileTerrain = {
    Grass: 0,
    Rock: 1,
    Water: 2,
    Wood: 3,
    Soil: 4,
}

class Tile {
    constructor(pos = new Vector2D(0,0), tilePos = new Vector2D(0,0), size = new Vector2D(32, 32), transparent = undefined, atlas = 'terrain', drawIndex = 0, tileType = TileType.Ground, tileTerrain = TileTerrain.Grass) {
        this.position = pos;
        this.tilePosition = tilePos;
        this.size = size;
        this.tileType = tileType;
        this.tileTerrain = tileTerrain;
        this.atlas = atlas;
        this.transparent = transparent;
        this.needsToBeRedrawn = true;
        this.drawIndex = drawIndex;
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
            let pixels = document.getElementById(this.canvas).getContext('2d').getImageData(this.GetPosX(), this.GetPosY(), this.width, this.height).data;

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
            position: this.position,
            tilePosition: this.tilePosition,
            size: this.size,
            tileType: this.tileType,
            tileTerrain: this.tileTerrain,
            atlas: this.atlas,
            transparent: this.transparent
        }
    }
}

export { Tile };