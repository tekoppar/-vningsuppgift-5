var ctx = document.getElementById('game-canvas').getContext('2d');
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

function posToGrid(pos, columns = link.columns) {
    var x = pos.x / link.width;
    var y = pos.y / link.height;
    return x + (columns*y);
}

function gridToPos(pid, columns = link.columns) {
    var x = pid % columns;
    var y = Math.floor(pid / columns);
    x = link.width * x;
    y = link.height * y;
    return {x:x, y:y};
}

function drawOnCanvas(canvas, pos = {x: 0, y:0}, clear = true, cCtx = ctx) {
    cCtx.drawImage(canvas, sheetPos.x, sheetPos.y, link.width, link.height, pos.x, pos.y, link.width, link.height);
}