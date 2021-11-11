/* import { Vector2D, Vector4D } from "../classes/vectors.js";
import { Tree } from "./props/tree.js";
import { ExtendedProp } from "./props/props.js";
import { CAnimation, AnimationType } from "../animations/animations.js"; */

import { Vector2D, Vector4D, Tree, ExtendedProp, CAnimation, AnimationType } from '../internal.js';

let Props = [
    new Tree('treeBirch', new Vector2D(11 * 32, 14 * 32), undefined, 'treeBirch1'),
    new Tree('treeBirch', new Vector2D(24 * 32, 14 * 32), undefined, 'treeBirch2'),
    new Tree('treePine', new Vector2D(56 * 32, 2 * 32), undefined, 'treePine1'),
    new Tree('treePine', new Vector2D(55 * 32, 5 * 32), undefined, 'treePine2'),
    new Tree('treePine', new Vector2D(57 * 32, 17 * 32), undefined, 'treePine2'),
    new Tree('treePine', new Vector2D(58 * 32, 23 * 32), undefined, 'treePine2'),
    new Tree('treePine', new Vector2D(55 * 32, 19 * 32), undefined, 'treePine1v2'),
    new Tree('treePine', new Vector2D(54 * 32, 14 * 32), undefined, 'treePine2v2'),
    new Tree('treePine', new Vector2D(57 * 32, 7 * 32), undefined, 'treePine2v2'),
    new Tree('treePine', new Vector2D(54 * 32, 1 * 32), undefined, 'treePine2v2'),
    new Tree('treePine', new Vector2D(57 * 32, -1 * 32), undefined, 'treePine1'),
];

Props = Props.concat([
    new ExtendedProp('fence', new Vector2D(17 * 32, 0 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 32, 0, 0)),

    new ExtendedProp('fence', new Vector2D(17 * 32, 1 * 32), new CAnimation('null', new Vector2D(0, 4), new Vector2D(0, 4), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 1, 0, -8)),

    new ExtendedProp('fence', new Vector2D(18 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(19 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(20 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(21 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(22 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(23 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(24 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(25 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(26 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(27 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(28 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(29 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(30 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(31 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(32 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(33 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(34 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(35 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(36 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(37 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(38 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(39 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(40 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(41 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(42 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(43 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(44 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(45 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(46 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(47 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(48 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(49 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(50 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(51 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(52 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(53 * 32, 1 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),

    new ExtendedProp('fence', new Vector2D(54 * 32, 1 * 32), new CAnimation('null', new Vector2D(2, 2), new Vector2D(2, 2), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 1, 0, -8)),

    new ExtendedProp('fence', new Vector2D(54 * 32, 10 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 32, 0, 0)),
    new ExtendedProp('fence', new Vector2D(54 * 32, 9 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 32, 0, 0)),
    new ExtendedProp('fence', new Vector2D(54 * 32, 8 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 32, 0, 0)),
    new ExtendedProp('fence', new Vector2D(54 * 32, 7 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 32, 0, 0)),
    new ExtendedProp('fence', new Vector2D(54 * 32, 6 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 32, 0, 0)),
    new ExtendedProp('fence', new Vector2D(54 * 32, 5 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 32, 0, 0)),
    new ExtendedProp('fence', new Vector2D(54 * 32, 4 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 32, 0, 0)),
    new ExtendedProp('fence', new Vector2D(54 * 32, 3 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 32, 0, 0)),
    new ExtendedProp('fence', new Vector2D(54 * 32, 2 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 32, 0, 0)),

    new ExtendedProp('fence', new Vector2D(54 * 32, 11 * 32), new CAnimation('null', new Vector2D(0, 4), new Vector2D(0, 4), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 1, 0, -8)),

    new ExtendedProp('fence', new Vector2D(55 * 32, 11 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(56 * 32, 11 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(57 * 32, 11 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(58 * 32, 11 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(59 * 32, 11 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),

    new ExtendedProp('fence', new Vector2D(55 * 32, 15 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(56 * 32, 15 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(57 * 32, 15 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(58 * 32, 15 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(59 * 32, 15 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),

    new ExtendedProp('fence', new Vector2D(54 * 32, 15 * 32), new CAnimation('null', new Vector2D(0, 2), new Vector2D(0, 2), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 1, 0, -8)),

    new ExtendedProp('fence', new Vector2D(54 * 32, 16 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 32, 0, 0)),
    new ExtendedProp('fence', new Vector2D(54 * 32, 17 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 32, 0, 0)),
    new ExtendedProp('fence', new Vector2D(54 * 32, 18 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 32, 0, 0)),
    new ExtendedProp('fence', new Vector2D(54 * 32, 19 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 32, 0, 0)),
    new ExtendedProp('fence', new Vector2D(54 * 32, 20 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 32, 0, 0)),
    new ExtendedProp('fence', new Vector2D(54 * 32, 21 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 32, 0, 0)),
    new ExtendedProp('fence', new Vector2D(54 * 32, 22 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 32, 0, 0)),
    new ExtendedProp('fence', new Vector2D(54 * 32, 23 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 32, 0, 0)),
    new ExtendedProp('fence', new Vector2D(54 * 32, 24 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 32, 0, 0)),
    new ExtendedProp('fence', new Vector2D(54 * 32, 25 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 32, 0, 0)),
    new ExtendedProp('fence', new Vector2D(54 * 32, 26 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 32, 0, 0)),
    new ExtendedProp('fence', new Vector2D(54 * 32, 27 * 32), new CAnimation('null', new Vector2D(1, 1), new Vector2D(1, 1), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 32, 0, 0)),

    new ExtendedProp('fence', new Vector2D(54 * 32, 28 * 32), new CAnimation('null', new Vector2D(0, 4), new Vector2D(0, 4), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(3, 1, 0, -8)),

    new ExtendedProp('fence', new Vector2D(55 * 32, 28 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(56 * 32, 28 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(57 * 32, 28 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(58 * 32, 28 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
    new ExtendedProp('fence', new Vector2D(59 * 32, 28 * 32), new CAnimation('null', new Vector2D(1, 0), new Vector2D(1, 0), 32, 32, AnimationType.Single, 1), 'fence', 0, new Vector4D(32, 1, 0, -8)),
]);

export { Props } ;