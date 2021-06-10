class Item {
    constructor(name, amount) {
        this.name = name;
        this.amount = amount;
    }

    AddAmount(value) {
        this.amount += value;
    }
}

class Inventory {
    constructor(owner) {
        this.inventory = {};
        this.characterOwner = owner;
    }

    AddItem(item) {
        if (this.inventory[item.name] !== undefined) {
            this.inventory[item.name].AddAmount(item.amount);
        } else {
            this.inventory[item.name] = item;
        }

        if (item.name === 'corn') {
            document.getElementById('total-corn').value = this.inventory['corn'].amount;
        }
    }
}

export { Inventory, Item };