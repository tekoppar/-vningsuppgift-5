class UIElement {
    constructor(lifeTime = 1) {
        this.drawingOperations = [];
        this.lifeTime = lifeTime * 60;
    }

    AddOperations() {
        for (let i = 0; i < this.drawingOperations.length; i++) {
            this.drawingOperations[i].Update();
        }
        this.lifeTime--;
    }

    RemoveUI() {
        for (let i = 0; i < this.drawingOperations.length; i++) {
            this.drawingOperations[i].Delete();
        }
    }
}

export { UIElement };