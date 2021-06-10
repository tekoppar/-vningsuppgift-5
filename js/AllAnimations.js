//import { Animation, AnimationType } from './animations.js';
import { Animation, AnimationType } from './animations.js';
import { Vector2D } from './vectors.js';

export let femaleAnimations = {
    walkUp: new Animation('walkUp', new Vector2D(1, 8), new Vector2D(7, 8), 64, 64, AnimationType.Cycle, 10),
    walkUpIdle: new Animation('walkUpIdle', new Vector2D(0, 8), new Vector2D(0, 8), 64, 64, AnimationType.Idle, 2),
    walkLeft: new Animation('walkLeft', new Vector2D(1, 9), new Vector2D(7, 9), 64, 64, AnimationType.Cycle, 10),
    walkLeftIdle: new Animation('walkLeftIdle', new Vector2D(0, 9), new Vector2D(0, 9), 64, 64, AnimationType.Idle, 2),
    walkDown: new Animation('walkDown', new Vector2D(1, 10), new Vector2D(7, 10), 64, 64, AnimationType.Cycle, 10),
    walkDownIdle: new Animation('walkDownIdle', new Vector2D(0, 10), new Vector2D(0, 10), 64, 64, AnimationType.Idle, 2),
    walkRight: new Animation('walkRight', new Vector2D(1, 11), new Vector2D(7, 11), 64, 64, AnimationType.Cycle, 10),
    walkRightIdle: new Animation('walkRightIdle', new Vector2D(0, 11), new Vector2D(0, 11), 64, 64, AnimationType.Idle, 2),
    runUp: new Animation('runUp', new Vector2D(0, 21), new Vector2D(7, 21), 64, 64, AnimationType.Cycle, 10),
    runLeft: new Animation('runLeft', new Vector2D(0, 23), new Vector2D(7, 23), 64, 64, AnimationType.Cycle, 10),
    runDown: new Animation('runDown', new Vector2D(0, 25), new Vector2D(7, 25), 64, 64, AnimationType.Cycle, 10),
    runRight: new Animation('runRight', new Vector2D(0, 27), new Vector2D(7, 27), 64, 64, AnimationType.Cycle, 10),
}

export let plantAnimations = {
    corn: {
        seed: new Animation('seed', new Vector2D(31, 0), new Vector2D(31, 3), 32, 64, AnimationType.Single, 50),
        grow: new Animation('grow', new Vector2D(31, 4), new Vector2D(31, 3), 32, 64, AnimationType.Single, 250),
    },
    pumpkin: {
        seed: new Animation('seed', new Vector2D(27, 0), new Vector2D(27, 3), 32, 64, AnimationType.Single, 50),
        grow: new Animation('grow', new Vector2D(27, 1), new Vector2D(27, 3), 32, 64, AnimationType.Single, 250),
        picked: new Animation('picked', new Vector2D(27, 4), new Vector2D(27, 4), 32, 64, AnimationType.Single, 250),
    },
    watermelon: {
        seed: new Animation('seed', new Vector2D(23, 0), new Vector2D(23, 3), 32, 64, AnimationType.Single, 50),
        grow: new Animation('grow', new Vector2D(23, 1), new Vector2D(23, 3), 32, 64, AnimationType.Single, 250),
        picked: new Animation('picked', new Vector2D(23, 4), new Vector2D(23, 4), 32, 64, AnimationType.Single, 250),
    },
    potato: {
        seed: new Animation('seed', new Vector2D(0, 0), new Vector2D(0, 3), 32, 64, AnimationType.Single, 50),
        picked: new Animation('picked', new Vector2D(0, 4), new Vector2D(0, 4), 32, 64, AnimationType.Single, 250),
    },
}