import { Vector2D, Vector4D } from "./vectors.js";

class CollisionHandler {
    static GCH = new CollisionHandler();

    constructor() {
        this.Collisions = [];
        this.EnabledCollisions = [];
    }

    AddCollision(collision) {
        this.Collisions.push(collision);

        if (collision.enableCollision === true)
            this.EnabledCollisions.push(collision);
    }

    CheckCollisions(collision) {
        for (let i = 0; i < this.EnabledCollisions.length; i++) {
            if (collision.collisionOwner !== this.EnabledCollisions[i].collisionOwner) {
                if (collision.DoIntersect(this.EnabledCollisions[i]) === true || collision.GetIntersections(this.EnabledCollisions[i].GetPoints()) > 0) {
                    return false;
                }
            }
        }

        return true;
    }

    GetOverlap(collision) {
        for (let i = 0; i < this.Collisions.length; i++) {
            if (collision.collisionOwner !== this.Collisions[i].collisionOwner && this.Collisions[i].overlapEvents === true) {
                if (collision.DoIntersect(this.Collisions[i], true) === true) {
                    return this.Collisions[i];
                }
            }
        }

        return false;
    }

    GetOverlaps(collision) {
        let overlaps = [];
        for (let i = 0; i < this.Collisions.length; i++) {
            if (collision.collisionOwner !== this.Collisions[i].collisionOwner && this.Collisions[i].overlapEvents === true) {
                if (collision.DoIntersect(this.Collisions[i], true) === true) {
                    overlaps.push(this.Collisions[i]);
                }
            }
        }

        return overlaps;
    }

    GetPoints() {

    }
}

class Collision {
    constructor(position, size, enableCollision, owner = undefined) {
        this.position = new Vector2D(position.x, position.y);
        this.size = new Vector2D(size.x, size.y);
        this.overlapEvents = true;
        this.enableCollision = enableCollision;
        this.collisionOwner = owner;

        CollisionHandler.GCH.AddCollision(this);
    }

    CheckInRange(collision, range = 25) {
        let tempPos = new Vector2D(this.position.x + (this.size.x / 2), this.position.y + this.size.y);
        let checkPos = new Vector2D(collision.position.x + (collision.size.x / 2), collision.position.y + (collision.size.y / 2));

        return tempPos.CheckInRange(checkPos, range);
    }

    CheckOverlap() {
        let overlapEvent = collisionHandler.CheckCollisions(this);
    }

    GetPoints() {
        return [
            this.position,
            new Vector2D(this.position.x + this.size.x, this.position.y),
            new Vector2D(this.position.x + this.size.x, this.position.y + this.size.y),
            new Vector2D(this.position.x, this.position.y + this.size.y)
        ]
    }

    DoIntersect(b, overlap = false) {
        //wthis.CheckIntersection(new Vector4D(b.position.x, b.position.y, b.size.x, b.size.y));
        if (this.enableCollision === true || overlap === true)
            return (Math.abs(this.position.x - b.position.x) * 1 < (this.size.x + b.size.x)) && (Math.abs(this.position.y - b.position.y) * 1 < (this.size.y + b.size.y));
        else
            return false;
    }

    GetIntersections(points) {
        let intersections = 0;

        for (let i = 0; i < points.length; i++) {
            let pt1 = points[i];
            let pt2 = points[(i + 1) % points.length];

            if (this.intersects(this.position.x, this.position.y, this.position.x + this.size.x, this.position.y, pt1.x, pt1.y, pt2.x, pt2.y) ||
                this.intersects(this.position.x + this.size.x, this.position.y, this.position.x + this.size.x, this.position.y + this.size.y, pt1.x, pt1.y, pt2.x, pt2.y) ||
                this.intersects(this.position.x + this.size.x, this.position.y + this.size.y, this.position.x, this.position.y + this.size.y, pt1.x, pt1.y, pt2.x, pt2.y) ||
                this.intersects(this.position.x, this.position.y + this.size.y, this.position.x, this.position.y, pt1.x, pt1.y, pt2.x, pt2.y)
            ) {
                intersections++;
            }
        }
        return intersections;
    }

    intersects(a, b, c, d, p, q, r, s) {
        var det, gamma, lambda;
        det = (c - a) * (s - q) - (r - p) * (d - b);
        if (det === 0) {
            return false;
        } else {
            lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
            gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
            return (0 <= lambda && lambda <= 1) && (0 <= gamma && gamma <= 1);
        }
    }

    Intersects(position, size) {
        let positionEnd = new Vector2D(this.position.x + this.size.x, this.position.y + this.size.y);
        let positionEndB = new Vector2D(position.x + size.x, position.y + size.y);
        let det, gamma, lambda;
        det = (positionEnd.x - this.position.x) * (positionEndB.y - position.y) - (positionEndB.x - position.x) * (positionEnd.y - this.position.y);
        if (det === 0) {
            return false;
        } else {
            lambda = ((positionEndB.y - position.y) * (positionEndB.x - this.position.x) + (position.x - positionEndB.x) * (positionEndB.y - this.position.y)) / det;
            gamma = ((this.position.y - positionEnd.y) * (positionEndB.x - this.position.x) + (positionEnd.x - this.position.x) * (positionEndB.y - this.position.y)) / det;
            return (0 <= lambda && lambda <= 1) && (0 <= gamma && gamma <= 1);
        }
    }

    CheckIntersection(v4) {
        let slope = this.LineSlope(v4);
        let intersect = this.LineIntersect(slope, v4);
        let equation = this.LineEquation(this.x, slope, intersect);
        let doesIntersect = this.intersects(this.position.x, this.position.y, this.position.x + this.size.x, this.position.y + this.size.y, v4.x, v4.y, v4.x + v4.z, v4.y + v4.a);
    }

    Distance(position) {
        return Math.sqrt(Math.pow(position.x - this.position.x, 2) + Math.pow(position.y - this.position.y, 2));
    }

    LineSlope(position) {
        return (this.position.y - position.y) / (this.position.x - position.x);
    }

    LineIntersect(slope, b) {
        return b.y - (slope * b.x);
    }

    LineEquation(x, slope, intersect) {
        return slope * x + intersect;
    }

    Cross(a, b, o) {
        return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    }
}

class BoxCollision extends Collision {
    constructor(position, size, enableCollision, owner = undefined) {
        super(position, size, enableCollision, owner);
    }
}

class PolygonCollision extends Collision {
    constructor(position, size, points = [], enableCollision, owner = undefined) {
        super(position, size, enableCollision, owner);
        this.points = points;
    }

    GetPoints() {
        return this.points;
    }
}

//let newCollision = new BoxCollision(new Vector2D(256, 320), new Vector2D(64, 64), true);
//collisionHandler.AddCollision(newCollision);
let polygonCollision = new PolygonCollision(new Vector2D(256, 320), new Vector2D(0, 0), [
    new Vector2D(100, 100),
    new Vector2D(200, 100),
    new Vector2D(200, 200),
    new Vector2D(150, 300),
    new Vector2D(100, 200),
    new Vector2D(100, 100)
], true);
//CollisionHandler.GCH.AddCollision(polygonCollision);

export { CollisionHandler, Collision, BoxCollision };