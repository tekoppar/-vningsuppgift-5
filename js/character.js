import { GameObject } from './gameObject.js';
import { Inventory, Item } from './inventory.js';
import { Vector2D } from './vectors.js';
import { femaleAnimations } from './AllAnimations.js';
import { BoxCollision } from './collision.js';
import { CustomEventHandler } from './customEvents.js';
import { CanvasDrawer, OperationType } from './customDrawer.js';
import { MasterObject } from './masterObject.js';

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
    constructor(spriteSheet, spriteSheetName, drawIndex = 0) {
        super(spriteSheetName, new Vector2D(0, 0), true, drawIndex);
        this.characterData = new CharacterData();
        this.spriteSheet = spriteSheet;
        this.name = "NewCharacter";
        this.currentAnimation = undefined;
        this.shadowAttachment = new CharacterAttachments('./content/sprites/lpc_shadow.png', 'shadow');
        this.attachments = {};
        this.isRunning = false;
        this.inventory = new Inventory(this);
        this.activeItem;
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

    NeedsRedraw(position) {
        super.NeedsRedraw(position);
        if (this.drawingOperation !== undefined)
            this.drawingOperation.Update(position);

        if (this.shadowAttachment.drawingOperation !== undefined)
            this.shadowAttachment.drawingOperation.Update(position);

        let keys = Object.keys(this.attachments);
        for (let i = 0; i < keys.length; i++) {
            if (this.attachments[keys[i]].drawingOperation !== undefined)
                this.attachments[keys[i]].drawingOperation.Update(position);
        }
    }

    PlayAnimation() {
        let frame = this.currentAnimation.GetFrame();

        if (frame !== null) {
            this.NeedsRedraw(this.position);

            CanvasDrawer.GCD.AddDrawOperation(this.shadowAttachment.CreateDrawOperation(this.shadowAttachment.currentAnimation.GetFrame(), this.position, false, this.shadowAttachment.canvas), OperationType.gameObjects);
            CanvasDrawer.GCD.AddDrawOperation(this.CreateDrawOperation(frame, this.position, false, this.canvas), OperationType.gameObjects);

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
                CanvasDrawer.GCD.AddDrawOperation(this.attachments[keys[i]].CreateDrawOperation(this.attachments[keys[i]].currentAnimation.GetFrame(), this.position, false, this.attachments[keys[i]].canvas), OperationType.gameObjects);
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

    CEvent(eventType, key, data) {
        switch (eventType) {
            case 'input':
                if (data.eventType == 0) {
                    switch (key) {
                        case 'a': this.Velocity.x = this.Direction.x = 1; this.Direction.y = 0; this.NeedsRedraw(this.position.Clone()); break;
                        case 'w': this.Velocity.y = this.Direction.y = 1; this.Direction.x = 0; this.NeedsRedraw(this.position.Clone()); break;
                        case 'd': this.Velocity.x = this.Direction.x = -1; this.Direction.y = 0; this.NeedsRedraw(this.position.Clone()); break;
                        case 's': this.Velocity.y = this.Direction.y = -1; this.Direction.x = 0; this.NeedsRedraw(this.position.Clone()); break;
                        case 'leftShift': this.isRunning = true; this.MovementSpeed = new Vector2D(-3, -3); this.NeedsRedraw(this.position.Clone()); break;
                        case 'leftMouse':
                            if (data.eventType === 0 && this.activeItem !== undefined)
                                this.activeItem.UseItem(new BoxCollision(data.position, this.size, this.enableCollision, this));
                            break;
                    }
                }
                if (data.eventType == 1) {
                    switch (key) {
                        case 'a': this.Velocity.x = this.Direction.x = 1; this.Direction.y = 0; this.NeedsRedraw(this.position.Clone()); break;
                        case 'w': this.Velocity.y = this.Direction.y = 1; this.Direction.x = 0; this.NeedsRedraw(this.position.Clone()); break;
                        case 'd': this.Velocity.x = this.Direction.x = -1; this.Direction.y = 0; this.NeedsRedraw(this.position.Clone()); break;
                        case 's': this.Velocity.y = this.Direction.y = -1; this.Direction.x = 0; this.NeedsRedraw(this.position.Clone()); break;
                        case 'leftShift': this.isRunning = true; this.MovementSpeed = new Vector2D(-3, -3); this.NeedsRedraw(this.position.Clone()); break;
                    }
                } else if (data.eventType == 2 || data.eventType == 3) {
                    switch (key) {
                        case 'a':
                        case 'w':
                        case 'd':
                        case 's':
                            this.Velocity.x = this.Velocity.y = 0;
                            this.NeedsRedraw(this.position.Clone());
                            break;

                        case 'e':
                            if (data.eventType == 2) {
                                CustomEventHandler.NewCustomEvent('use', this);
                            }
                            break;

                        case 'leftShift': this.isRunning = false; this.MovementSpeed = new Vector2D(-1, -1); this.NeedsRedraw(this.position.Clone()); break;
                    }
                }
                break;
        }
    }
}

class CharacterData {
    constructor() {
        this.name = 'NPC';
        this.age = 18;
    }
}

export { Character, CharacterAttachments, CharacterData };