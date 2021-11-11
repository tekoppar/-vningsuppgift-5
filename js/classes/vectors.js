class Vector2D {
    constructor(x, y) {
        this.x = Number(x);
        this.y = Number(y);
    }

    Add(a) {
        if (a.x !== undefined) {
            this.x += a.x;
            this.y += a.y;
        } else {
            this.x += a;
            this.y += a;
        }
    }

    static Add(a, b) {
        return new Vector2D(a.x + b.x, a.y + b.y);
    }

    Sub(a) {
        if (a.x !== undefined) {
            this.x -= a.x;
            this.y -= a.y;
        } else {
            this.x -= a;
            this.y -= a;
        }
    }

    static Sub(a, b) {
        return new Vector2D(a.x - b.x, a.y - b.y);
    }

    Mult(a) {
        if (a.x !== undefined) {
            this.x = this.x * a.x;
            this.y = this.y * a.y;
        } else {
            this.x *= a;
            this.y *= a;
        }
    }

    static Mult(a, b) {
        return new Vector2D(a.x * b.x, a.y * b.y);
    }

    Div(a) {
        if (a.x !== undefined) {
            this.x /= a.x;
            this.y /= a.y;
        } else {
            this.x /= a;
            this.y /= a;
        }
    }

    static Div(a, b) {
        return new Vector2D(a.x / b.x, a.y / b.y);
    }

    static DivX(a, b) {
        return new Vector2D(a.x / b, a.y / b);
    }

    static Min(vec, a) {
        return new Vector2D(vec.x < a ? a : vec.x, vec.y < a ? a : vec.y);
    }

    static Max(vec, a) {
        return new Vector2D(vec.x > a ? a : vec.x, vec.y > a ? a : vec.y);
    }

    Ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
    }

    SnapToGrid(x = 32, y = 32) {
        this.x = Math.floor(this.x / x) * x;
        this.y = Math.floor(this.y / y) * y;
    }

    SnapToGrid(x = 32) {
        this.x = Math.floor(this.x / x) * x;
        this.y = Math.floor(this.y / x) * x;
    }

    ToGrid(x = 32) {
        this.x = Math.floor(this.x / x);
        this.y = Math.floor(this.y / x);
    }

    Floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
    }

    Abs() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
    }

    Equal(a) {
        return this.x == a.x && this.y == a.y;
    }

    Sqrt() {
        return new Vector2D(Math.sqrt(this.x), Math.sqrt(this.y));
    }

    Distance(a) {
        return Math.sqrt(Math.pow(this.x - a.x, 2)) + Math.sqrt(Math.pow(this.y - a.y, 2));
    }

    Lerp(a, t) {
        return new Vector2D(this.x + (a.x - this.x) * t, this.y + (a.y - this.y) * t);
    }

    LerpValue(a, v) {
        let distance = this.Distance(a);
        let t = v / distance;
        return this.Lerp(a, t);
    }

    CheckInRange(checkPos, range = 100.0) {
        return this.Distance(checkPos) < range;
    }

    Set(a) {
        this.x = a.x;
        this.y = a.y;
    }

    Clone() {
        return new Vector2D(this.x, this.y);
    }

    ToString() {
        return this.x + ', ' + this.y;
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y
        };
    }
}

class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    Add(a) {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
    }

    Sub(a) {
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
    }

    Mult(a) {
        this.x = this.x * a.x;
        this.y = this.y * a.y;
        this.z = this.z * a.z;
    }

    Div(a) {
        this.x /= a.x;
        this.y /= a.y;
        this.z /= a.z;
    }

    Equal(a) {
        return this.x == a.x && this.y == a.y && this.z == a.z;
    }
}

class Vector4D {
    constructor(x, y, z, a) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.a = a;
    }

    Add(a) {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
        this.a += a.a;
    }

    AddF(a) {
        this.x += a;
        this.y += a;
        this.z += a;
        this.a += a;
    }

    Sub(a) {
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
        this.a -= a.a;
    }

    SubF(a) {
        this.x -= a;
        this.y -= a;
        this.z -= a;
        this.a -= a;
    }

    Mult(a) {
        this.x = this.x * a.x;
        this.y = this.y * a.y;
        this.z = this.z * a.z;
        this.a = this.a * a.a;
    }

    Div(a) {
        this.x /= a.x;
        this.y /= a.y;
        this.z /= a.z;
        this.a /= a.a;
    }

    Inside(position) {
        return position.x > this.x && position.x < this.x + this.z && position.y > this.y && position.y < this.y + this.a;
    }

    Equal(a) {
        return this.x == a.x && this.y == a.y && this.z == a.z && this.a == a.a;
    }

    Clone() {
        return new Vector4D(this.x, this.y, this.z, this.a);
    }
}

class Matrix {
    constructor(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
        this.x1 = x1;
        this.y1 = y1;
        this.z1 = z1;
        this.x2 = x2;
        this.y2 = y2;
        this.z2 = z2;
        this.x3 = x3;
        this.y3 = y3;
        this.z3 = z3;
    }

    Null(b) {
        if (b === undefined)
            return;
        if (b.x1 === 0)
            this.x1 = null;
        if (b.y1 === 0)
            this.y1 = null;
        if (b.z1 === 0)
            this.z1 = null;
        if (b.x2 === 0)
            this.x2 = null;
        if (b.y2 === 0)
            this.y2 = null;
        if (b.z2 === 0)
            this.z2 = null;
        if (b.x3 === 0)
            this.x3 = null;
        if (b.y3 === 0)
            this.y3 = null;
        if (b.z3 === 0)
            this.z3 = null;
    }

    Filter(keys, filter) {
        let arr = this.ToArray();

        for (let i = 0; i < arr.length; i++) {
            let temp = arr[i];
            for (let k = 0; k < keys.length; k++) {
                if (temp !== undefined && temp[keys[k]] !== undefined)
                    temp = temp[keys[k]];
                else
                    arr[i] = null;
            }

            if (temp !== undefined && temp !== filter)
                arr[i] = null;
        }

        return Matrix.FromArray(arr);
    }

    FilterNot(keys, filter) {
        let arr = this.ToArray();

        for (let i = 0; i < arr.length; i++) {
            let temp = arr[i];
            for (let k = 0; k < keys.length; k++) {
                if (temp !== undefined && temp[keys[k]] !== undefined)
                    temp = temp[keys[k]];
            }

            if (temp === undefined || temp === filter)
                arr[i] = null;
        }

        return Matrix.FromArray(arr);
    }

    ToArray() {
        return [this.x1, this.y1, this.z1, this.x2, this.y2, this.z2, this.x3, this.y3, this.z3];
    }

    To3DArray() {
        return [
            [
                this.x1 instanceof Matrix ? this.x1.To3DArray() : this.x1,
                this.y1 instanceof Matrix ? this.y1.To3DArray() : this.y1,
                this.z1 instanceof Matrix ? this.z1.To3DArray() : this.z1
            ],
            [
                this.x2 instanceof Matrix ? this.x2.To3DArray() : this.x2,
                this.y2 instanceof Matrix ? this.y2.To3DArray() : this.y2,
                this.z2 instanceof Matrix ? this.z2.To3DArray() : this.z2
            ],
            [
                this.x3 instanceof Matrix ? this.x3.To3DArray() : this.x3,
                this.y3 instanceof Matrix ? this.y3.To3DArray() : this.y3,
                this.z3 instanceof Matrix ? this.z3.To3DArray() : this.z3
            ]
        ];
    }

    ToBinary() {
        return '0x' + this.y1 + '' + this.y3 + '' + this.x2 + '' + this.z2 + '' + this.z3 + '' + this.x1 + '' + this.z1 + '' + this.x3;
    }

    InvertMatrix() {
        this.x1 = this.x1 == 0 ? 1 : 0;
        this.y1 = this.y1 == 0 ? 1 : 0;
        this.z1 = this.z1 == 0 ? 1 : 0;
        this.x2 = this.x2 == 0 ? 1 : 0;
        this.y2 = this.y2 == 0 ? 1 : 0;
        this.z2 = this.z2 == 0 ? 1 : 0;
        this.x3 = this.x3 == 0 ? 1 : 0;
        this.y3 = this.y3 == 0 ? 1 : 0;
        this.z3 = this.z3 == 0 ? 1 : 0;
    }

    ConvertToBinary() {
        this.x1 = this.x1 !== null ? 1 : 0;
        this.y1 = this.y1 !== null ? 1 : 0;
        this.z1 = this.z1 !== null ? 1 : 0;
        this.x2 = this.x2 !== null ? 1 : 0;
        this.y2 = this.y2 !== null ? 1 : 0;
        this.z2 = this.z2 !== null ? 1 : 0;
        this.x3 = this.x3 !== null ? 1 : 0;
        this.y3 = this.y3 !== null ? 1 : 0;
        this.z3 = this.z3 !== null ? 1 : 0;
    }

    OffsetMatrix(vector2D) {
        if (vector2D === undefined)
            return [];

        let arr3D = this.To3DArray();

        for (let i = 0; i < arr3D.length; i++) {
            if (vector2D.x === -1) {
                arr3D[i].shift();
                arr3D[i].push(0);
            }
            if (vector2D.x === 1) {
                arr3D[i].pop();
                arr3D[i] = [0].concat(arr3D[i]);
            }
        }

        if (vector2D.y === -1) {
            arr3D.shift();
            arr3D.push([0, 0, 0]);
        }
        if (vector2D.y === 1) {
            arr3D.pop();
            arr3D = [[0, 0, 0]].concat(arr3D);
        }

        return arr3D;
    }

    IsOne(b) {
        if (b === undefined)
            return;
        if (b.x1 === 1)
            this.x1 = 1;
        if (b.y1 === 1)
            this.y1 = 1;
        if (b.z1 === 1)
            this.z1 = 1;
        if (b.x2 === 1)
            this.x2 = 1;
        if (b.y2 === 1)
            this.y2 = 1;
        if (b.z2 === 1)
            this.z2 = 1;
        if (b.x3 === 1)
            this.x3 = 1;
        if (b.y3 === 1)
            this.y3 = 1;
        if (b.z3 === 1)
            this.z3 = 1;
    }

    Clone() {
        return new Matrix(this.x1, this.y1, this.z1, this.x2, this.y2, this.z2, this.x3, this.y3, this.z3);
    }

    /*
    526
    1?0
    734
    */

    static FromBinary(binary) {
        return new Matrix(binary[5], binary[2], binary[6], binary[1], 1, binary[0], binary[7], binary[3], binary[4]);
    }

    static FromArray(array) {
        return new Matrix(array[0], array[1], array[2], array[3], array[4], array[5], array[6], array[7], array[8]);
    }
}

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    Inside(position) {
        return position.x > this.x && position.x < this.x + this.w && position.y > this.y && position.y < this.y + this.h;
    }

    Clone() {
        return new Rectangle(this.x, this.y, this.w, this.h);
    }
}

export { Vector2D, Vector, Vector4D, Matrix, Rectangle };