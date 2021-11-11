//import { CAnimation, AnimationType } from './animations.js';
/* import { CAnimation, AnimationType } from '../animations/animations.js';
import { Vector2D } from '../classes/vectors.js'; */

import { CAnimation, AnimationType, Vector2D } from '../internal.js';

export let femaleAnimations = {
    walkUp: new CAnimation('walkUp', new Vector2D(1, 8), new Vector2D(8, 8), 64, 64, AnimationType.Cycle, 5),
    walkUpIdle: new CAnimation('walkUpIdle', new Vector2D(0, 8), new Vector2D(0, 8), 64, 64, AnimationType.Single, 2),
    walkLeft: new CAnimation('walkLeft', new Vector2D(1, 9), new Vector2D(8, 9), 64, 64, AnimationType.Cycle, 5),
    walkLeftIdle: new CAnimation('walkLeftIdle', new Vector2D(0, 9), new Vector2D(0, 9), 64, 64, AnimationType.Single, 2),
    walkDown: new CAnimation('walkDown', new Vector2D(1, 10), new Vector2D(8, 10), 64, 64, AnimationType.Cycle, 5),
    walkDownIdle: new CAnimation('walkDownIdle', new Vector2D(0, 10), new Vector2D(0, 10), 64, 64, AnimationType.Single, 2),
    walkRight: new CAnimation('walkRight', new Vector2D(1, 11), new Vector2D(8, 11), 64, 64, AnimationType.Cycle, 5),
    walkRightIdle: new CAnimation('walkRightIdle', new Vector2D(0, 11), new Vector2D(0, 11), 64, 64, AnimationType.Single, 2),
    runUp: new CAnimation('runUp', new Vector2D(0, 21), new Vector2D(7, 21), 64, 64, AnimationType.Cycle, 3),
    runLeft: new CAnimation('runLeft', new Vector2D(0, 23), new Vector2D(7, 23), 64, 64, AnimationType.Cycle, 3),
    runDown: new CAnimation('runDown', new Vector2D(0, 25), new Vector2D(7, 25), 64, 64, AnimationType.Cycle, 3),
    runRight: new CAnimation('runRight', new Vector2D(0, 27), new Vector2D(7, 27), 64, 64, AnimationType.Cycle, 3),
}

export let plantAnimations = {
    corn: {
        seed: new CAnimation('seed', new Vector2D(31, 0), new Vector2D(31, 3), 32, 64, AnimationType.Single, 50),
        grow: new CAnimation('grow', new Vector2D(31, 4), new Vector2D(31, 3), 32, 64, AnimationType.Single, 250),
    },
    pumpkin: {
        seed: new CAnimation('seed', new Vector2D(27, 0), new Vector2D(27, 3), 32, 64, AnimationType.Single, 50),
        grow: new CAnimation('grow', new Vector2D(27, 1), new Vector2D(27, 3), 32, 64, AnimationType.Single, 250),
        picked: new CAnimation('picked', new Vector2D(27, 4), new Vector2D(27, 4), 32, 64, AnimationType.Single, 250),
    },
    watermelon: {
        seed: new CAnimation('seed', new Vector2D(23, 0), new Vector2D(23, 3), 32, 64, AnimationType.Single, 50),
        grow: new CAnimation('grow', new Vector2D(23, 1), new Vector2D(23, 3), 32, 64, AnimationType.Single, 250),
        picked: new CAnimation('picked', new Vector2D(23, 4), new Vector2D(23, 4), 32, 64, AnimationType.Single, 250),
    },
    potato: {
        seed: new CAnimation('seed', new Vector2D(0, 0), new Vector2D(0, 3), 32, 64, AnimationType.Single, 50),
        picked: new CAnimation('picked', new Vector2D(0, 4), new Vector2D(0, 4), 32, 64, AnimationType.Single, 250),
    },
    bellpepperGreen: {
        seed: new CAnimation('seed', new Vector2D(18, 0), new Vector2D(18, 3), 32, 64, AnimationType.Single, 50),
        grow: new CAnimation('grow', new Vector2D(18, 2), new Vector2D(18, 3), 32, 64, AnimationType.Single, 250),
        picked: new CAnimation('picked', new Vector2D(18, 4), new Vector2D(18, 4), 32, 64, AnimationType.Single, 250),
    },
    bellpepperRed: {
        seed: new CAnimation('seed', new Vector2D(19, 0), new Vector2D(19, 3), 32, 64, AnimationType.Single, 50),
        grow: new CAnimation('grow', new Vector2D(19, 2), new Vector2D(19, 3), 32, 64, AnimationType.Single, 250),
        picked: new CAnimation('picked', new Vector2D(19, 4), new Vector2D(19, 4), 32, 64, AnimationType.Single, 250),
    },
    bellpepperOrange: {
        seed: new CAnimation('seed', new Vector2D(20, 0), new Vector2D(20, 3), 32, 64, AnimationType.Single, 50),
        grow: new CAnimation('grow', new Vector2D(20, 2), new Vector2D(20, 3), 32, 64, AnimationType.Single, 250),
        picked: new CAnimation('picked', new Vector2D(20, 4), new Vector2D(20, 4), 32, 64, AnimationType.Single, 250),
    },
    bellpepperYellow: {
        seed: new CAnimation('seed', new Vector2D(21, 0), new Vector2D(21, 3), 32, 64, AnimationType.Single, 50),
        grow: new CAnimation('grow', new Vector2D(21, 2), new Vector2D(21, 3), 32, 64, AnimationType.Single, 250),
        picked: new CAnimation('picked', new Vector2D(21, 4), new Vector2D(21, 4), 32, 64, AnimationType.Single, 250),
    },
    carrot: {
        seed: new CAnimation('seed', new Vector2D(6, 0), new Vector2D(6, 3), 32, 64, AnimationType.Single, 50),
        picked: new CAnimation('picked', new Vector2D(6, 4), new Vector2D(6, 4), 32, 64, AnimationType.Single, 250),
    },
    parsnip: {
        seed: new CAnimation('seed', new Vector2D(7, 0), new Vector2D(7, 3), 32, 64, AnimationType.Single, 50),
        picked: new CAnimation('picked', new Vector2D(7, 4), new Vector2D(7, 4), 32, 64, AnimationType.Single, 250),
    },
    radish: {
        seed: new CAnimation('seed', new Vector2D(8, 0), new Vector2D(8, 3), 32, 64, AnimationType.Single, 50),
        picked: new CAnimation('picked', new Vector2D(8, 4), new Vector2D(8, 4), 32, 64, AnimationType.Single, 250),
    },
    beetroot: {
        seed: new CAnimation('seed', new Vector2D(9, 0), new Vector2D(9, 3), 32, 64, AnimationType.Single, 50),
        picked: new CAnimation('picked', new Vector2D(9, 4), new Vector2D(9, 4), 32, 64, AnimationType.Single, 250),
    },
    garlic: {
        seed: new CAnimation('seed', new Vector2D(12, 0), new Vector2D(12, 3), 32, 64, AnimationType.Single, 50),
        picked: new CAnimation('picked', new Vector2D(12, 4), new Vector2D(12, 4), 32, 64, AnimationType.Single, 250),
    },
    onionYellow: {
        seed: new CAnimation('seed', new Vector2D(13, 0), new Vector2D(13, 3), 32, 64, AnimationType.Single, 50),
        picked: new CAnimation('picked', new Vector2D(13, 4), new Vector2D(13, 4), 32, 64, AnimationType.Single, 250),
    },
    onionRed: {
        seed: new CAnimation('seed', new Vector2D(14, 0), new Vector2D(14, 3), 32, 64, AnimationType.Single, 50),
        picked: new CAnimation('picked', new Vector2D(14, 4), new Vector2D(14, 4), 32, 64, AnimationType.Single, 250),
    },
    onionWhite: {
        seed: new CAnimation('seed', new Vector2D(15, 0), new Vector2D(15, 3), 32, 64, AnimationType.Single, 50),
        picked: new CAnimation('picked', new Vector2D(15, 4), new Vector2D(15, 4), 32, 64, AnimationType.Single, 250),
    },
    onionGreen: {
        seed: new CAnimation('seed', new Vector2D(16, 0), new Vector2D(16, 3), 32, 64, AnimationType.Single, 50),
        picked: new CAnimation('picked', new Vector2D(16, 4), new Vector2D(16, 4), 32, 64, AnimationType.Single, 250),
    },
    hotPepper: {
        seed: new CAnimation('seed', new Vector2D(17, 0), new Vector2D(17, 3), 32, 64, AnimationType.Single, 50),
        grow: new CAnimation('grow', new Vector2D(17, 0), new Vector2D(17, 3), 32, 64, AnimationType.Single, 250),
        picked: new CAnimation('picked', new Vector2D(17, 4), new Vector2D(17, 4), 32, 64, AnimationType.Single, 250),
    },
    chiliPepper: {
        seed: new CAnimation('seed', new Vector2D(22, 0), new Vector2D(22, 3), 32, 64, AnimationType.Single, 50),
        grow: new CAnimation('grow', new Vector2D(22, 0), new Vector2D(22, 3), 32, 64, AnimationType.Single, 250),
        picked: new CAnimation('picked', new Vector2D(22, 4), new Vector2D(22, 4), 32, 64, AnimationType.Single, 250),
    },
    lettuceIceberg: {
        seed: new CAnimation('seed', new Vector2D(6, 5), new Vector2D(6, 8), 32, 64, AnimationType.Single, 50),
        grow: new CAnimation('grow', new Vector2D(6, 6), new Vector2D(6, 8), 32, 64, AnimationType.Single, 250),
        picked: new CAnimation('picked', new Vector2D(6, 9), new Vector2D(6, 9), 32, 64, AnimationType.Single, 250),
    },
    cauliflower: {
        seed: new CAnimation('seed', new Vector2D(11, 5), new Vector2D(11, 8), 32, 64, AnimationType.Single, 50),
        grow: new CAnimation('grow', new Vector2D(11, 6), new Vector2D(11, 8), 32, 64, AnimationType.Single, 250),
        picked: new CAnimation('picked', new Vector2D(11, 9), new Vector2D(11, 9), 32, 64, AnimationType.Single, 250),
    },
    broccoli: {
        seed: new CAnimation('seed', new Vector2D(12, 5), new Vector2D(12, 8), 32, 64, AnimationType.Single, 50),
        grow: new CAnimation('grow', new Vector2D(12, 6), new Vector2D(12, 8), 32, 64, AnimationType.Single, 250),
        picked: new CAnimation('picked', new Vector2D(12, 9), new Vector2D(12, 9), 32, 64, AnimationType.Single, 250),
    },
}