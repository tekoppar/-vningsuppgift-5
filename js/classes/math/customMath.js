//import { Vector2D } from '../vectors.js';

import { Vector2D } from '../../internal.js';

Number.prototype.mapRange = function (in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

class CMath {
    static RandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    static LineSlope(a, b) {
        let x = Math.abs(a.y - b.y);
        let y =  Math.abs(a.x - b.x)
        return x === 0 && y === 0 ? 0 : x / y;
    }

    static LineIntercept(a, b) {
        let slope = CMath.LineSlope(a, b);
        return a.y - slope * a.x;
    }

    static PointAlongLineAtDistance(a, b, distance) {
        let slope = CMath.LineSlope(a, b);
        let vA = a.x > b.x ? b : a;
        let vB = a.x > b.x ? a : b;
        let point = {x: Math.abs(vA.x - vB.x), y: Math.abs(vA.y - vB.y)};
        let y = slope * (distance - point.x) + point.y;
        return new Vector2D(distance + vA.x, y + vA.y);
    }
}

export { CMath };