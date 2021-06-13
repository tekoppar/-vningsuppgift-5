import { Vector2D, Vector, Vector4D } from './vectors.js';
import { plantAnimations, femaleAnimations } from './AllAnimations.js';

var AnimationType = {
    Idle: 0, /* Loops forever */
    Cycle: 1, /* Only loops on input */
    Single: 2, /* Only goes once */
}

class CFrame {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

class Animation {
    constructor(name = '', start = new Vector2D(0, 0), end = new Vector2D(0, 0), w = 32, h = 32, animationType = AnimationType.Cycle, animationSpeed = 3) {
        this.name = name;
        this.frames = [];
        this.start = start;
        this.end = end;
        this.w = w;
        this.h = h;
        this.currentFrame = 0;
        this.animationType = animationType;
        this.animationSpeed = animationSpeed;
        this.cooldown = 0;
        this.animationFinished = false;

        this.ConstructAnimation(this.start, this.end, this.w, this.h);
    }

    Clone() {
        return new Animation(
            this.name,
            this.start,
            this.end,
            this.w,
            this.h,
            this.animationType,
            this.animationSpeed
        );
    }

    SetSpeed(speed) {
        this.cooldown = this.animationSpeed = speed;
    }

    GetFrame() {
        let frameIndex = this.currentFrame;

        if (this.cooldown === 0 && this.animationFinished !== true) {
            if (this.currentFrame === this.frames.length)
                this.animationFinished = true;

            switch (this.animationType) {
                case AnimationType.Cycle:
                case AnimationType.Idle:
                    if (this.currentFrame == this.frames.length) {
                        this.currentFrame = 0;
                        frameIndex = 0;
                        this.animationFinished = false;
                    }
                    else {
                        this.currentFrame++;
                        this.cooldown = this.animationSpeed;
                    }
                    break;

                case AnimationType.Single:
                    if (this.currentFrame < this.frames.length) {
                        this.currentFrame++;
                        this.cooldown = this.animationSpeed;
                    }
                    break;
            }

            return this.frames[frameIndex];
        } else {
            this.cooldown--;
            //return this.frames[frameIndex];
        }

        return null;
    }

    ConstructAnimation(start, end, w, h) {
        let index = 0;

        if (start.x !== end.x) {
            if (start.x > end.x) {
                for (let x = start.x; x > start.x - 1; x--) {
                    this.frames.push(new CFrame(start.x - index, start.y, w, h));
                    index++;
                }
            } else {
                for (let x = start.x; x < end.x + 1; x++) {
                    this.frames.push(new CFrame(start.x + index, start.y, w, h));
                    index++;
                }
            }
        } else {
            if (start.y > end.y) {
                for (let x = start.y; x > end.y - 1; x--) {
                    this.frames.push(new CFrame(start.x, start.y - index, w, h));
                    index++;
                }
            } else {
                for (let x = start.y; x < end.y + 1; x++) {
                    this.frames.push(new CFrame(start.x, start.y + index, w, h));
                    index++;
                }
            }
        }
    }
}

export { CFrame, Animation, plantAnimations, femaleAnimations, AnimationType };