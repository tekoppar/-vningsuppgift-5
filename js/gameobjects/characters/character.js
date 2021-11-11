/* import { GameObject } from '../gameObject.js';
import { Inventory } from '../characters/inventory.js';
import { Item } from '../items/item.js';
import { Vector2D } from '../../classes/vectors.js';
import { femaleAnimations } from '../../animations/AllAnimations.js';
import { BoxCollision, CollisionHandler } from '../collision/collision.js';
import { CustomEventHandler } from '../../eventHandlers/customEvents.js';
import { CanvasDrawer } from '../../drawers/canvas/customDrawer.js';
import { OperationType } from '../../drawers/canvas/operation.js';
import { MasterObject } from '../../classes/masterObject.js'; */

import { GameObject, Inventory, Item, Vector2D, femaleAnimations, BoxCollision, CollisionHandler, CustomEventHandler, CanvasDrawer, OperationType, MasterObject } from '../../internal.js';

const FacingDirection = {
    Left: 0,
    Right: 1,
    Up: 2,
    Down: 3
}

class CharacterAttachments extends GameObject {
    constructor(spriteSheet, name, drawIndex = 0) {
        super(name, new Vector2D(0, 0), false, drawIndex);
        this.spriteSheet = spriteSheet;
        this.currentAnimation = undefined;
        this.name = name;
        this.BoxCollision.overlapEvents = false;
    }

    ChangeAnimation(animation) {
        if (this.currentAnimation != animation)
            this.currentAnimation = animation;
    }

    FixedUpdate() {
        super.FixedUpdate();
    }
}


class Character extends GameObject {
    constructor(spriteSheet, spriteSheetName, drawIndex = 0, position = new Vector2D(0,0)) {
        super(spriteSheetName, position, false, drawIndex);
        this.characterData = new CharacterData();
        this.spriteSheet = spriteSheet;
        this.name = "NewCharacter";
        this.currentAnimation = undefined;
        this.shadowAttachment = new CharacterAttachments('./content/sprites/lpc_shadow.png', 'shadow');
        this.attachments = {};
        this.isRunning = false;
        this.inventory = new Inventory(this);
        this.activeItem;
        this.BlockingCollision = new BoxCollision(this.position.Clone(), new Vector2D(16, 16), true, this, true);
    }

    AddAttachment(atlas, name, drawIndex) {
        this.attachments[name] = new CharacterAttachments(atlas, name, drawIndex);
    }

    ChangeAnimation(animation) {
        if (this.currentAnimation === undefined || this.currentAnimation.name != animation.name) {
            this.currentAnimation = animation;
            this.shadowAttachment.ChangeAnimation(animation.Clone());
            this.BoxCollision.size = new Vector2D(animation.h, animation.w);

            let keys = Object.keys(this.attachments);
            for (let i = 0; i < keys.length; i++) {
                this.attachments[keys[i]].ChangeAnimation(animation.Clone());
            }
        }
    }

    FlagDrawingUpdate(position) {
        super.FlagDrawingUpdate(position);

        if (this.shadowAttachment.drawingOperation !== undefined)
            this.shadowAttachment.FlagDrawingUpdate(position);

        let keys = Object.keys(this.attachments);
        for (let i = 0; i < keys.length; i++) {
            if (this.attachments[keys[i]].drawingOperation !== undefined)
                this.attachments[keys[i]].FlagDrawingUpdate(position);
        }
    }

    NeedsRedraw(position) {
        super.NeedsRedraw(position);

        if (this.drawingOperation !== undefined)
            this.FlagDrawingUpdate(position);

        if (this.shadowAttachment.drawingOperation !== undefined)
            this.shadowAttachment.FlagDrawingUpdate(position);

        let keys = Object.keys(this.attachments);
        for (let i = 0; i < keys.length; i++) {
            if (this.attachments[keys[i]].drawingOperation !== undefined)
                this.attachments[keys[i]].FlagDrawingUpdate(position);
        }
    }

    PlayAnimation() {
        let frame = this.currentAnimation.GetFrame();

        if (frame !== null) {
            this.NeedsRedraw(this.position);

            this.shadowAttachment.CreateDrawOperation(this.shadowAttachment.currentAnimation.GetFrame(), this.position, false, this.shadowAttachment.canvas, OperationType.gameObjects);
            this.CreateDrawOperation(frame, this.position, false, this.canvas, OperationType.gameObjects);

            let facingDirection = this.GetFacingDirection();

            if (facingDirection === FacingDirection.Up) {
                this.attachments.redHair.drawIndex = 1;
                this.attachments.underDress.drawIndex = 0;
            } else {
                this.attachments.redHair.drawIndex = 0;
                this.attachments.underDress.drawIndex = 1;
            }

            let keys = Object.keys(this.attachments);
            for (let i = 0; i < keys.length; i++) {
                this.attachments[keys[i]].CreateDrawOperation(
                    this.attachments[keys[i]].currentAnimation.GetFrame(),
                    this.position,
                    false,
                    this.attachments[keys[i]].canvas,
                    OperationType.gameObjects
                );
            }
        } else {
            this.shadowAttachment.currentAnimation.GetFrame();

            let keys = Object.keys(this.attachments);
            for (let i = 0; i < keys.length; i++) {
                this.attachments[keys[i]].currentAnimation.GetFrame();
            }
        }
    }

    CheckAnimation() {
        let facingDirection = this.GetFacingDirection();

        if (facingDirection != undefined) {
            switch (facingDirection) {
                case FacingDirection.Left:
                    if (this.Velocity.x == 1)
                        this.ChangeAnimation(this.isRunning === true ? femaleAnimations.runLeft.Clone() : femaleAnimations.walkLeft.Clone());
                    else
                        this.ChangeAnimation(femaleAnimations.walkLeftIdle.Clone());
                    break;
                case FacingDirection.Right:
                    if (this.Velocity.x == -1)
                        this.ChangeAnimation(this.isRunning === true ? femaleAnimations.runRight.Clone() : femaleAnimations.walkRight.Clone());
                    else
                        this.ChangeAnimation(femaleAnimations.walkRightIdle.Clone());
                    break;
                case FacingDirection.Up:
                    if (this.Velocity.y == 1)
                        this.ChangeAnimation(this.isRunning === true ? femaleAnimations.runUp.Clone() : femaleAnimations.walkUp.Clone());
                    else
                        this.ChangeAnimation(femaleAnimations.walkUpIdle.Clone());
                    break;
                case FacingDirection.Down:
                    if (this.Velocity.y == -1)
                        this.ChangeAnimation(this.isRunning === true ? femaleAnimations.runDown.Clone() : femaleAnimations.walkDown.Clone());
                    else
                        this.ChangeAnimation(femaleAnimations.walkDownIdle.Clone());
                    break;
            }
        }
    }

    UpdateMovement() {
        if (this.Velocity.x !== 0 || this.Velocity.y !== 0) {
            if (this.drawingOperation !== undefined)
                this.NeedsRedraw(this.previousPosition.Clone());

            this.BoxCollision.position = this.position.Clone();
            this.BoxCollision.position.Add(Vector2D.Mult(this.MovementSpeed, this.Velocity));

            this.BlockingCollision.position = this.BoxCollision.GetCenterPosition();
            this.BlockingCollision.position.Sub({x:this.BlockingCollision.size.x + this.BlockingCollision.size.x / 2, y: this.BlockingCollision.size.y - this.BlockingCollision.size.y });

            if (this.CheckCollision() === true) {
                this.previousPosition = this.position.Clone();
                this.position.Add(Vector2D.Mult(this.MovementSpeed, this.Velocity));
            } else {
                this.BoxCollision.position = this.position;
                this.BlockingCollision.position = this.BoxCollision.GetCenterPosition();
                this.BlockingCollision.position.Sub({x:this.BlockingCollision.size.x + this.BlockingCollision.size.x / 2, y: this.BlockingCollision.size.y - this.BlockingCollision.size.y });
            }
        }
    }

    CheckCollision() {
        return CollisionHandler.GCH.CheckCollisions(this.BlockingCollision);
    }

    GetFacingDirection() {
        if (this.Direction.x != 0) {
            if (this.Direction.x == 1)
                return FacingDirection.Left;
            else
                return FacingDirection.Right;
        } else if (this.Direction.y != 0) {
            if (this.Direction.y == 1)
                return FacingDirection.Up;
            else
                return FacingDirection.Down;
        }
    }

    FixedUpdate() {
        super.FixedUpdate();
        this.CheckAnimation();

        if (this.currentAnimation !== undefined) {
            this.PlayAnimation();
        }

        this.UpdateMovement();
    }

    UpdateDirection(direction, value) {
        switch (direction) {
            case 'x':
                this.Velocity.x = this.Direction.x = value;
                this.Direction.y = 0;
                break;

            case 'y':
                this.Velocity.y = this.Direction.y = value;
                this.Direction.x = 0;
                break;
        }

        this.NeedsRedraw(this.position.Clone());
    }

    StopMovement() {
        this.Velocity.x = this.Velocity.y = 0;
        this.NeedsRedraw(this.position.Clone());
    }

    SetMovement(type, speed) {
        switch (type) {
            case 'running': this.isRunning = true; break;
            case 'walking': this.isRunning = false; break;
        }

        this.MovementSpeed = new Vector2D(speed, speed);
        this.NeedsRedraw(this.position.Clone());
    }

    Interact() {
        let overlaps = CollisionHandler.GCH.GetInRange(this.BoxCollision, 64);

        for (let overlap of overlaps) {
            if (overlap.CEvent !== undefined)
                overlap.CEvent('use', this);
        }
    }

    UseItem(data) {
        if (this.activeItem !== undefined)
            this.activeItem.UseItem(new BoxCollision(data.position, this.size, this.enableCollision, this, false));
    }

    CEvent(eventType, key, data) {
        switch (eventType) {
        }
    }
}

class CharacterData {
    constructor() {
        this.name = 'NPC';
        this.age = 18;
    }
}

class MainCharacter extends Character {
    constructor(spriteSheet, spriteSheetName, name, drawIndex = 0, position = new Vector2D(0,0)) {
        super(spriteSheet, spriteSheetName, drawIndex, position);
        this.name = name;
    }

    FixedUpdate() {
        super.FixedUpdate();
    }
}

export { Character, CharacterAttachments, CharacterData, MainCharacter };