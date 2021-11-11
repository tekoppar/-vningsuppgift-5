//import { Vector2D, Vector4D } from "../../classes/vectors.js";

import { CanvasDrawer, Vector2D, Vector4D } from '../../internal.js';

class QuadTree {
    static MAX_OBJECTS = 25;

    constructor() {
        this.level = level;
        this.objects = [];
        this.bounds = bounds;
        this.nodes = [];
    }

    Clear() {
        this.objects = null;
        this.level = null;
        this.bounds = null;
        
        for (let node in this.nodes) {
            node.Clear();
        }
        this.nodes = null;
    }

    Split() {

    }
}

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

    RemoveCollision(collision) {
        for (let i = 0; i < this.Collisions.length; i++) {
            if (collision === this.Collisions[i]) {
                this.Collisions.splice(i, 1);
            }
        }

        for (let i = 0; i < this.EnabledCollisions.length; i++) {
            if (collision === this.EnabledCollisions[i]) {
                this.EnabledCollisions.splice(i, 1);
            }
        }
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

    GetInRangeType(collision, range, type) {
        let inRange = this.GetInRange(collision, range),
            newInRange = [];

        for (let i = 0; i < inRange.length; i++) {
            if (inRange[i] instanceof type)
                newInRange.push(inRange[i]);
        }

        return newInRange;
    }

    GetInRange(collision, range) {
        let inRange = [];
        for (let i = 0; i < this.Collisions.length; i++) {
            if (this.Collisions[i].collisionOwner !== undefined && collision.collisionOwner !== this.Collisions[i].collisionOwner && collision.CheckInCenterRangeB(this.Collisions[i], range) === true) {
                inRange.push(this.Collisions[i].collisionOwner);
            }
        }

        return inRange;
    }

    GetOverlap(collision) {
        for (let i = 0; i < this.Collisions.length; i++) {
            if (collision.collisionOwner !== this.Collisions[i].collisionOwner && this.Collisions[i].overlapEvents === true) {
                if (collision.DoIntersect(this.Collisions[i], true) === true && this.Collisions[i].collisionOwner !== false) {
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
    constructor(position, size, enableCollision, owner = undefined, register = true) {
        this.position = new Vector2D(position.x, position.y);
        this.size = new Vector2D(size.x, size.y);
        this.overlapEvents = true;
        this.enableCollision = enableCollision;
        this.collisionOwner = owner;

        if (register === true)
            CollisionHandler.GCH.AddCollision(this);
    }

    Delete() {
        CollisionHandler.GCH.RemoveCollision(this);
        this.collisionOwner = this.size = this.position = null;
    }

    GetBoundingBox() {
    }

    CheckInRange(collision, range = 25) {
        let tempPos = new Vector2D(this.position.x + (this.size.x / 2), this.position.y + (this.size.y / 2));
        let checkPos = new Vector2D(collision.position.x + (collision.size.x / 2), collision.position.y + (collision.size.y / 2));

        return tempPos.CheckInRange(checkPos, range);
    }

    CheckInCenterRange(collision, range = 25) {
        let a = this.GetCenterPosition(),
            b = collision.position.Clone();

        return a.CheckInRange(b, range);
    }

    CheckInCenterRangeB(collision, range = 25) {
        let a = this.GetCenterPosition(),
            b = collision.GetCenterPosition().Clone();

        return a.CheckInRange(b, range);
    }

    CheckInRealRange(collision, range = 25) {
        let a = this.GetRealCenterPosition(),
            b = collision.GetRealCenterPosition();

        return a.CheckInRange(b, range);
    }

    CheckOverlap() {
        let overlapEvent = collisionHandler.CheckCollisions(this);
    }

    GetCenterTilePosition() {
        let newPos = new Vector2D(this.position.x, this.position.y);//this.position.Clone();
        newPos.x += this.size.x / 2;
        newPos.y -= this.size.y + 32;

        return newPos;
    }

    GetCenterPosition() {
        let newPos = new Vector2D(this.position.x, this.position.y);//.Clone();
        newPos.x += this.size.x / 2 + 16;
        newPos.y += this.size.y / 2 + 16;

        return newPos;
    }

    GetRealCenterPosition() {
        let v = this.GetCenterPosition();
        
        if (this.size.x > 32) 
            v.x -= 16;

        return v;
    }

    GetPoints() {
        return [
            this.position,
            new Vector2D(this.position.x + this.size.x, this.position.y),
            new Vector2D(this.position.x + this.size.x, this.position.y + this.size.y),
            new Vector2D(this.position.x, this.position.y + this.size.y)
        ]
    }

    IsOverlaping1D(a, b) {
        return a.y >= b.x && b.y >= a.x;
    }

    DoOverlap(b, overlap = false) {
        if (this.enableCollision === true || overlap == true) {
            let ABB = this.GetBoundingBox(),
                BBB = b.GetBoundingBox();

            ABB.x -= 2;
            ABB.y -= 2;
            ABB.z += 2;
            ABB.a += 2;
            BBB.x -= 2;
            BBB.y -= 2;
            BBB.z += 2;
            BBB.a += 2;

            CanvasDrawer.GCD.AddDebugOperation(new Vector2D(ABB.x, ABB.y), 5, 'orange');
            CanvasDrawer.GCD.AddDebugOperation(new Vector2D(ABB.z, ABB.a), 5, 'blue');
            CanvasDrawer.GCD.AddDebugOperation(new Vector2D(BBB.x, BBB.y), 5, 'pink');
            CanvasDrawer.GCD.AddDebugOperation(new Vector2D(BBB.z, BBB.a), 5, 'purple');
            return this.IsOverlaping1D(new Vector2D(ABB.x, ABB.z), new Vector2D(BBB.x, BBB.z)) && this.IsOverlaping1D(new Vector2D(ABB.y, ABB.a), new Vector2D(BBB.y, BBB.a));
        }
        else
            return false;
    }

    DoIntersect(b, overlap = false) {
        //wthis.CheckIntersection(new Vector4D(b.position.x, b.position.y, b.size.x, b.size.y));
        if (this.enableCollision === true || overlap === true) {
            //let centerTile = this.GetCenterPosition();
            //let bCenter = b.GetCenterPosition();
            return this.DoOverlap(b, overlap);// (Math.abs(centerTile.x - bCenter.x) * -1 < (this.size.x + b.size.x)) && (Math.abs(centerTile.y - bCenter.y) * 1 < (this.size.y + b.size.y));
        }
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

    OnHit(damage, source) {
        this.collisionOwner.OnHit(damage, source);
    }
}

class BoxCollision extends Collision {
    constructor(position, size, enableCollision, owner = undefined, register = true) {
        super(position, size, enableCollision, owner, register);
    }

    Delete() {
        super.Delete();
    }

    GetBoundingBox() {
        return new Vector4D(this.position.x, this.position.y, this.position.x + this.size.x, this.position.y + this.size.y);
    }
}

class PolygonCollision extends Collision {
    constructor(position, size, points = [], enableCollision, owner = undefined, register = true) {
        super(position, size, enableCollision, owner, register);
        this.points = points;
        this.refPoints = [...points];
        this.boundingBox = new Vector4D(1, 1, 1, 1);
        this.CalculateBoundingBox();
    }

    Delete() {
        super.Delete();
    }

    UpdatePoints() {
        this.points = [...this.refPoints];
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].Add(this.position);
        }
    }

    GetBoundingBox() {
        return new Vector4D(this.boundingBox.x, this.boundingBox.y, this.boundingBox.x + this.boundingBox.z, this.boundingBox.y + this.boundingBox.a);
    }

    CalculateBoundingBox() {
        let sX = 9999999999, sY = 9999999999, lX = -1, lY = -1;

        for (let pos of this.points) {
            if (pos.x > lX)
                lX = pos.x;
            if (pos.x < sX)
                sX = pos.x;
            if (pos.y > lY)
                lY = pos.y;
            if (pos.y < sY)
                sY = pos.y;
        }
        this.boundingBox = new Vector4D(sX, sY, lX - sX, lY - sY);
    }

    GetCenterPosition() {
        let newPos = new Vector2D(this.boundingBox.x, this.boundingBox.y);
        newPos.x += this.boundingBox.z / 2;
        newPos.y += this.boundingBox.a - 8;

        return newPos;
    }

    GetPoints() {
        return this.points;
    }
}

//let newCollision = new BoxCollision(new Vector2D(256, 320), new Vector2D(64, 64), true);
//collisionHandler.AddCollision(newCollision);
let polygonCollision = new PolygonCollision(new Vector2D(-64, -64), new Vector2D(0, 0), [
    new Vector2D(100, 100),
    new Vector2D(200, 100),
    new Vector2D(200, 200),
    new Vector2D(150, 300),
    new Vector2D(100, 200),
    new Vector2D(100, 100)
], true);
//CollisionHandler.GCH.AddCollision(polygonCollision);

export { CollisionHandler, Collision, BoxCollision, PolygonCollision };