class CanvasSprite {
    constructor(x, y, width, height, canvas, isTransparent = undefined) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.canvas = canvas;
        this.isTransparent = isTransparent;
    }

    GetPosX() {
        return this.x * this.width;
    }

    GetPosY() {
        return this.y * this.height;
    }

    IsTransparent() {
        if (this.isTransparent == undefined) {
            let pixels = document.getElementById(this.canvas).getContext('2d').getImageData(this.GetPosX(), this.GetPosY(), this.width, this.height).data;

            for (let i = 0; i < pixels.length; i += 4) {
                if (pixels[i + 3] < 255) {
                    this.isTransparent = true;
                    return this.isTransparent;
                }
            }
        } else {
            return this.isTransparent;
        }

        this.isTransparent = false;
        return this.isTransparent;
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            canvas: this.canvas,
            isTransparent: this.isTransparent
        }
    }

    Clone() {
        return new CanvasSprite(this.x, this.y, this.width, this.height, this.canvas, this.isTransparent);
    }
}

export { CanvasSprite };