//import { Matrix } from '../../classes/vectors.js';

const ULDR = {
    UpLeft: 0x00001100,
    Up: 0x00001000,
    UpRight: 0x00001001,
    Left: 0x00000100,
    Middle: 0x00001111,
    Right: 0x00000001,
    DownLeft: 0x00000110,
    Down: 0x00000010,
    DownRight: 0x00000011,
    CornerUpLeft: 0x01000000,
    CornerUpRight: 0x10000000,
    CornerDownLeft: 0x00010000,
    CornerDownRight: 0x00100000,
    UpdownMiddle: null,
    LeftRightMiddle: null,
    DownEnd: null,
    UpEnd: null,
    LeftEnd: null,
    RightEnd: null,
    CenterEnd: null,
    CornerDoubleULDR: 0x10010000,
    CornerDoubleDLUR: 0x01100000
}

export function GetAtlasTileMatrix(binary, middle) {
    let first4 = binary.slice(0, 4);
    let last4 = binary.slice(4);

    switch (first4) {
        case '0001':
            switch (last4) {
                case '0100':return middle === 0 ? ULDR.Middle : ULDR.Right;
                case '1100': return ULDR.Middle;
                case '0101': return middle === 0 ? ULDR.Middle : ULDR.Right;
                case '0011': return ULDR.Middle;
                case '1011': return ULDR.Middle;
                case '0001':return middle === 0 ? ULDR.Middle : ULDR.Right;
                case '1101': return ULDR.Middle;
                case '1111': return ULDR.Middle; // used to be 0
                case '0111': return ULDR.Middle;
                case '0110': return ULDR.Middle; // used to be 1
                case '1000':
                case '0010':
                case '0000':
                case '1110':
                case '1010':
                case '1001': return ULDR.Middle;
            }
            break;
        case '0010':
            switch (last4) {
                case '0001': return ULDR.Middle;
                case '0010': return middle === 0 ? ULDR.Middle : ULDR.Left;
                case '0100': return ULDR.Middle;
                case '1000': return middle === 0 ? ULDR.Middle : ULDR.Left;
                case '0011': return ULDR.Middle;
                case '1010': return middle === 0 ? ULDR.Middle : ULDR.Left;
                case '1100':
                case '0110': return ULDR.Middle;
                case '1110': return ULDR.Middle; // used to be 0
                case '1011': return ULDR.Middle; // used to be 0
                case '0111': return ULDR.Middle;
                case '1101':
                case '1001':
                case '1111':
                case '0101':
                case '0000': return ULDR.Middle;
            }
            break;
        case '0100':
            switch (last4) {
                case '1000':
                case '1001':
                case '1110':
                case '0001': return ULDR.Middle;
                case '0010':
                case '0100':
                case '0011':return ULDR.Middle;
                case '1100': return ULDR.Middle;
                case '0101':
                case '1010': return ULDR.Middle; // used to be 1
                case '1101': return ULDR.Middle;
                case '1011': return ULDR.Middle;
                case '0110': return ULDR.Middle;
                case '0111': return ULDR.Middle; // used to be 0
                case '1111': return ULDR.Middle; //used to be 1
                case '0000': return ULDR.Middle;
            }
            break;
        case '1000':
            switch (last4) {
                case '0001': return middle === 0 ? ULDR.Middle : ULDR.Up;
                case '1001': return ULDR.Middle;
                case '1000':return middle === 0 ? ULDR.Middle : ULDR.Up;
                case '1101': return ULDR.Middle; // used to be 1
                case '0010':
                case '0101': return ULDR.Middle;
                case '1100': return ULDR.Middle;
                case '1011': return ULDR.Middle;
                case '0100': return ULDR.Middle; // used to be 0
                case '0111': return ULDR.Middle; // used to be 0
                case '0011':return ULDR.Middle;
                case '1010': return ULDR.Middle;
                case '0110': return ULDR.Middle;
                case '1110': return ULDR.Middle; // used to be 1
                case '1111': return ULDR.Middle;// used to be 0
                case '0000': return ULDR.Middle;
            }
            break;
        case '0011':
            switch (last4) {
                case '0100':
                case '1010':
                case '0101':
                case '0011':
                case '0010':
                case '1011': return ULDR.Middle;
                case '1100':
                case '1101':
                case '0110':
                case '1111':
                case '1000':
                case '0001':
                case '0111':
                case '1110':
                case '1001': return ULDR.Middle;
            }
            break;
        case '0110':
            switch (last4) {
                case '0010':
                case '0100': return ULDR.Middle;
                case '0110': return ULDR.Middle;
                case '1100': return ULDR.Middle;
                case '1010': return ULDR.Middle; // used to be 1
                case '0101':
                case '0001':
                case '1001': return middle === 1 ? ULDR.CornerDownRight : ULDR.Middle;
                case '0011': return middle === 0 ? ULDR.Middle : ULDR.CornerDownRight;
                case '0111': return middle === 0 ? ULDR.Middle : ULDR.CornerDownRight;
                case '1011': return middle === 0 ? ULDR.Middle : ULDR.CornerDownRight;
                case '1110': return ULDR.Middle; // used to be 1
                case '1111': return middle === 1 ? ULDR.CornerDownRight : ULDR.Middle;
                case '0000':
                case '1000':
                case '1001': return ULDR.Middle;
                case '1101': return middle === 0 ? ULDR.Middle : ULDR.CornerDownRight;
            }
            break;
        case '1100':
            switch (last4) {
                case '1111':
                case '0111':
                case '1011':
                case '1010':
                case '1101':
                case '0011':
                case '1001':
                case '1100':
                case '0100':
                case '0001':
                case '0101': return ULDR.Middle;
                case '1000':
                case '1010':
                case '0010':
                case '0110': return middle === 0 ? ULDR.Middle : ULDR.Left;
                case '1110': return ULDR.Middle;
            }
            break;
        case '0101':
            switch (last4) {
                case '1001': return middle === 0 ? ULDR.Middle : ULDR.CornerDownLeft;
                case '1011': return middle === 0 ? ULDR.Middle : ULDR.CornerDownLeft;
                case '0011': return ULDR.Middle; //used to be 1
                case '0110': return ULDR.Middle;
                case '1100': return middle === 0 ? ULDR.Middle : ULDR.CornerDownLeft;
                case '0111': return ULDR.Middle;
                case '0101': return middle === 1 ? ULDR.Middle : ULDR.CornerDownLeft;
                case '1010': return middle === 0 ? ULDR.Middle : ULDR.CornerDownLeft;
                case '0100': return middle === 1 ? ULDR.Middle : ULDR.UpLeft;
                case '1101':
                case '1110': return middle === 0 ? ULDR.Middle : ULDR.CornerDownLeft;
                case '1111': return middle === 0 ? ULDR.Middle : ULDR.CornerDownLeft;
                case '1000': return middle === 0 ? ULDR.Middle : ULDR.CornerDownLeft;
                case '0010':
                case '0001':
                case '0000': return ULDR.Middle;
            }
            break;
        case '1010':
            switch (last4) {
                case '0010':
                case '1010':
                case '1011': return ULDR.Middle;
                case '1001': return ULDR.Middle; // used to be 0
                case '0001': return ULDR.Middle; // used to be 0
                case '0100': return middle === 0 ? ULDR.Middle : ULDR.CornerUpRight;
                case '1000': return middle === 1 ? ULDR.Middle : ULDR.CornerUpRight;
                case '0011': return ULDR.Middle; // used to be 1
                case '0101': return middle === 0 ? ULDR.Middle : ULDR.CornerUpRight;
                case '1110': return middle === 0 ? ULDR.Middle : ULDR.CornerUpRight;
                case '0111':
                case '1111': return middle === 0 ? ULDR.Middle : ULDR.CornerUpRight;
                case '0110': return middle === 0 ? ULDR.Middle : ULDR.CornerUpRight;
                case '1101': return middle === 0 ? ULDR.Middle : ULDR.CornerUpRight;
                case '1100': return middle === 0 ? ULDR.Middle : ULDR.CornerUpRight;
                case '0000': return ULDR.Middle;
            }
            break;
        case '1001':
            switch (last4) {
                case '0001':
                case '1000': return ULDR.Middle; // used to be 0
                case '1100': return ULDR.Middle;
                case '1010': return middle === 0 ? ULDR.Middle : ULDR.CornerUpLeft;
                case '1001': return ULDR.Middle // used to be 1
                case '1110': return middle === 0 ? ULDR.Middle : ULDR.CornerUpLeft;
                case '1101': return middle === 1 ? ULDR.Middle : ULDR.Middle;// : ULDR.CornerDownLeft;
                case '0111': return middle === 0 ? ULDR.Middle : ULDR.CornerUpLeft;
                case '0011':
                case '0110': return middle === 1 ? ULDR.CornerUpLeft : ULDR.Middle;
                case '1011': return middle === 1 ? ULDR.CornerUpLeft : ULDR.Middle;
                case '1111': return middle === 0 ? ULDR.Middle : ULDR.CornerUpLeft;
                case '0010': return middle === 0 ? ULDR.Middle : ULDR.CornerUpLeft;
                case '0101':
                case '0100': return ULDR.Middle;
                case '0000': return ULDR.Middle;
            }
            break;
        case '1110':
            switch (last4) {
                case '1000':
                case '0010': return ULDR.Middle;
                case '0011': return middle === 0 ? ULDR.Middle : ULDR.CornerDownRight;
                case '0110': return middle === 0 ? ULDR.Middle : ULDR.CornerUpRight;
                case '1100': return middle === 0 ? ULDR.Middle : ULDR.CornerUpRight;
                case '0100': return middle === 0 ? ULDR.Middle : ULDR.CornerUpRight;
                case '0001': return middle === 0 ? ULDR.Middle : ULDR.CornerDownRight;
                case '0101': return middle === 0 ? ULDR.Middle : ULDR.Left;
                case '1001': return middle === 0 ? ULDR.Middle : ULDR.CornerDownRight;
                case '1010': return ULDR.Middle;
                case '0111': return middle === 0 ? ULDR.Middle : ULDR.Left;
                case '1011': return middle === 0 ? ULDR.Middle : ULDR.CornerDownRight;
                case '1101': return middle === 0 ? ULDR.Middle : ULDR.Left;
                case '1111': return middle === 0 ? ULDR.Middle : ULDR.Left;
                case '1110': return middle === 0 ? ULDR.Middle : ULDR.CornerUpRight;
            }
            break;
        case '0111':
            switch (last4) {
                case '1001': return middle === 0 ? ULDR.Middle : ULDR.Down;
                case '1100': return middle === 0 ? ULDR.Middle : ULDR.CornerDownLeft;
                case '1101':
                case '1011': return middle === 0 ? ULDR.Middle : ULDR.Down;
                case '1111': return middle === 0 ? ULDR.Middle : ULDR.Down;
                case '0101':
                case '0111': return middle === 0 ? ULDR.Middle : ULDR.CornerDownRight;
                case '1110': return middle === 0 ? ULDR.Middle : ULDR.CornerDownLeft;
                case '0100':
                case '0110': return ULDR.Middle;
                case '0001': return middle === 0 ? ULDR.Middle : ULDR.CornerDownRight;
                case '0010': return ULDR.Middle; // used to be 1
                case '1000': return middle === 0 ? ULDR.Middle : ULDR.CornerDownLeft;
                case '0011': return middle === 0 ? ULDR.Middle : ULDR.CornerDownRight;
                case '1010': return middle === 0 ? ULDR.Middle : ULDR.CornerDownLeft;
            }
            break;
        case '1011':
            switch (last4) {
                case '0110': return middle === 0 ? ULDR.Middle : ULDR.Up;
                case '1111': return middle === 0 ? ULDR.Middle : ULDR.Up;
                case '1000': return ULDR.Middle;
                case '0011': return middle === 0 ? ULDR.Middle : ULDR.CornerUpLeft;
                case '1110': return middle === 0 ? ULDR.Middle : ULDR.Up;
                case '0111': return middle === 0 ? ULDR.Middle : ULDR.Up;
                case '0010': return middle === 0 ? ULDR.Middle : ULDR.CornerUpLeft;
                case '0001':
                case '1001': return ULDR.Middle;
                case '1101': return middle === 0 ? ULDR.Middle : ULDR.CornerUpRight;
                case '1011': return middle === 0 ? ULDR.Middle : ULDR.CornerUpLeft;
                case '0101': return middle === 0 ? ULDR.Middle : ULDR.CornerUpRight;
                case '1010': return middle === 0 ? ULDR.Middle : ULDR.CornerUpLeft;
                case '1100': return middle === 0 ? ULDR.Middle : ULDR.CornerUpRight;
                case '0100': return middle === 0 ? ULDR.Middle : ULDR.CornerUpRight;
            }
            break;
        case '1101':
            switch (last4) {
                case '0100':return ULDR.Middle;
                case '0001': return ULDR.Middle;
                case '1000': return middle === 0 ? ULDR.Middle : ULDR.CornerDownLeft;
                case '0011': return middle === 0 ? ULDR.Middle : ULDR.CornerUpLeft;
                case '1100': return middle === 0 ? ULDR.Middle : ULDR.CornerDownLeft;
                case '1110':
                case '1011': return middle === 0 ? ULDR.Middle : ULDR.Right;
                case '1101': return middle === 0 ? ULDR.Middle : ULDR.CornerDownLeft;
                case '1010': return middle === 1 ? ULDR.Right : ULDR.Middle;
                case '1111': return middle === 1 ? ULDR.Right : ULDR.Middle;
                case '0111': return middle === 0 ? ULDR.Middle : ULDR.CornerUpLeft;
                case '0010': return middle === 0 ? ULDR.Middle : ULDR.CornerUpLeft;
                case '1001': return middle === 0 ? ULDR.Middle : ULDR.CornerDownLeft;
                case '0110': return middle === 1 ? ULDR.CornerUpLeft : ULDR.Middle;
                case '0101': return ULDR.Middle;
            }
            break;
        case '1111':
            switch (last4) {
                case '0011': return middle === 0 ? ULDR.Middle : ULDR.CornerDoubleDLUR;
                case '1100': return middle === 0 ? ULDR.Middle : ULDR.CornerDoubleULDR;
                case '1011': return middle === 0 ? ULDR.Middle : ULDR.DownRight;
                case '1110': return middle === 0 ? ULDR.Middle : ULDR.UpRight;
                case '0111': return middle === 0 ? ULDR.Middle : ULDR.UpLeft;
                case '0110': return middle === 0 ? ULDR.Middle : ULDR.Up;
                case '1001': return middle === 0 ? ULDR.Middle : ULDR.Down;
                case '0101': return middle === 0 ? ULDR.Middle : ULDR.Left;
                case '1010': return middle === 0 ? ULDR.Middle : ULDR.Right;
                case '1101': return middle === 0 ? ULDR.Middle : ULDR.DownLeft;
                case '0001': return middle === 0 ? ULDR.Middle : ULDR.CornerDownRight;
                case '1111': return ULDR.Middle;
                case '1000': return middle === 0 ? ULDR.Middle : ULDR.CornerDownLeft;
                case '0100': return middle === 0 ? ULDR.Middle : ULDR.CornerUpRight;
                case '0010': return middle === 0 ? ULDR.Middle : ULDR.CornerUpLeft;
            }
            break;
        case '0000':
            switch (last4) {
                case '0001': return ULDR.Middle;
                case '0010': return middle === 0 ? ULDR.Middle : ULDR.CornerUpLeft;
                case '0100': return middle === 0 ? ULDR.Middle : ULDR.CornerUpRight;
                case '1000': return ULDR.Middle;
                case '0011':
                case '0110':
                case '1100':
                case '0101':
                case '1010':
                case '1001':
                case '1110':
                case '0111':
                case '1011':
                case '1101':
                case '1111': return ULDR.Middle;
                case '0000': return ULDR.Middle;
            }
            break;
    }

    return null;
}