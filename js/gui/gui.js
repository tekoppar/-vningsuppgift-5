
class GUI {
    static CreateButton(text) {
        let temp = document.getElementById('button-ui');
        let clone = temp.content.cloneNode(true);
        clone.children[0].innerText = text;

        return clone.children[0];
    }

    static CreateLabel(text) {
        let temp = document.getElementById('label-ui');
        let clone = temp.content.cloneNode(true);
        clone.children[0].innerText = text;

        return clone.children[0];
    }

    static CreateParagraph(text) {
        let temp = document.getElementById('paragraph-ui');
        let clone = temp.content.cloneNode(true);
        clone.children[0].innerText = text;

        return clone.children[0];
    }

    static CreateSprite(item) {
        let div = document.createElement('div');
        div.style.width = '42px';
        div.style.height = '42px';
        div.style.margin = '2px';
        div.style.backgroundPosition = '-' + (item.sprite.x * item.sprite.z) * 1.35 + 'px -' + (item.sprite.y * item.sprite.a) * 1.5 + 'px';
        div.style.backgroundSize = item.atlas.x * 1.35 + 'px ' + item.atlas.y * 1.5 + 'px';
        div.style.backgroundImage = 'url(' + item.url + ')';

        return div;
    }

    static CreateInput(type = 'number') {
        let temp = document.getElementById('input-ui');
        let clone = temp.content.cloneNode(true);
        clone.children[0].children[0].setAttribute('type', type);

        return clone.children[0];
    }

    static CreateContainer(verticalHorizontal = true) {
        let temp = document.getElementById('container-ui');
        let clone = temp.content.cloneNode(true);

        if (verticalHorizontal === false)
            clone.children[0].className = 'container-ui-horizontal';

        return clone.children[0];
    }
}

export { GUI };