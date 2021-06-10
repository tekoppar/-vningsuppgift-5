class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    Add(a) {
        this.x += a.x;
        this.y += a.y;
    }

    Sub(a) {
        this.x -= a.x;
        this.y -= a.y;
    }

    Mult(a) {
        this.x = this.x * a.x;
        this.y = this.y * a.y;
    }

    static Mult(a, b) {
        return new Vector2D(a.x * b.x, a.y * b.y);
    }

    Div(a) {
        this.x /= a.x;
        this.y /= a.y;
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

    Sub(a) {
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
        this.a -= a.a;
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

    Equal(a) {
        return this.x == a.x && this.y == a.y && this.z == a.z && this.a == a.a;
    }
}

export {Vector2D, Vector, Vector4D};