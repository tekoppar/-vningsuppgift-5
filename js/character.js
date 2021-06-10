import { GameObject } from './gameObject.js';
import { Inventory, Item } from './inventory.js';
import { Vector2D } from './vectors.js';
import { femaleAnimations } from './AllAnimations.js';
import { CustomEventHandler } from './customEvents.js';
import { CanvasDrawer } from './customDrawer.js';
import { MasterObject } from './masterObject.js';

const FacingDirection = {
    Left: 0,
    Right: 1,
    Up: 2,
    Down: 3
}

class CharacterAttachments extends GameObject {
    constructor(spriteSheet, name) {
        super();
        this.spriteSheet = spriteSheet;
        this.currentAnimation = undefined;
        this.name = name;

        this.LoadAtlas();
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
    constructor(spriteSheet) {
        super();
        this.characterData = new CharacterData();
        this.spriteSheet = spriteSheet;
        this.name = "NewCharacter";
        this.currentAnimation = undefined;
        this.shadowAttachment = new CharacterAttachments('./content/sprites/lpc_shadow.png', 'shadow');
        this.attachments = [];
        this.isRunning = false;
        this.inventory = new Inventory(this);

        this.LoadAtlas();
    }

    AddAttachment(atlas, name) {
        this.attachments.push(new CharacterAttachments(atlas, name));
    }

    ChangeAnimation(animation) {
        if (this.currentAnimation != animation) {
            this.currentAnimation = animation;
            this.shadowAttachment.ChangeAnimation(animation);
            this.BoxCollision.size = new Vector2D(animation.h, animation.w);

            for (let i = 0; i < this.attachments.length; i++) {
                this.attachments[i].ChangeAnimation(animation);
            }
        }
    }

    PlayAnimation() {
        let frame = this.currentAnimation.GetFrame();

        if (frame !== null) {
            CanvasDrawer.GCD.AddDrawOperation(this.CreateDrawOperation(this.shadowAttachment.currentAnimation.GetFrame(), this.position, false, this.shadowAttachment.canvas));
            CanvasDrawer.GCD.AddDrawOperation(this.CreateDrawOperation(frame, this.position, false, this.canvas));

            let facingDirection = this.GetFacingDirection();
            if (facingDirection === FacingDirection.Up) {
                for (let i = this.attachments.length; i > 0; i--) {
                    CanvasDrawer.GCD.AddDrawOperation(this.CreateDrawOperation(this.attachments[i - 1].currentAnimation.GetFrame(), this.position, false, this.attachments[i - 1].canvas));
                }
            } else {
                for (let i = 0; i < this.attachments.length; i++) {
                    CanvasDrawer.GCD.AddDrawOperation(this.CreateDrawOperation(this.attachments[i].currentAnimation.GetFrame(), this.position, false, this.attachments[i].canvas));
                }
            }
        }
    }

    CheckAnimation() {
        let facingDirection = this.GetFacingDirection();

        if (facingDirection != undefined) {
            switch (facingDirection) {
                case FacingDirection.Left:
                    if (this.Velocity.x == 1)
                        this.ChangeAnimation(this.isRunning === true ? femaleAnimations.runLeft : femaleAnimations.walkLeft);
                    else
                        this.ChangeAnimation(femaleAnimations.walkLeftIdle);
                    break;
                case FacingDirection.Right:
                    if (this.Velocity.x == -1)
                        this.ChangeAnimation(this.isRunning === true ? femaleAnimations.runRight : femaleAnimations.walkRight);
                    else
                        this.ChangeAnimation(femaleAnimations.walkRightIdle);
                    break;
                case FacingDirection.Up:
                    if (this.Velocity.y == 1)
                        this.ChangeAnimation(this.isRunning === true ? femaleAnimations.runUp : femaleAnimations.walkUp);
                    else
                        this.ChangeAnimation(femaleAnimations.walkUpIdle);
                    break;
                case FacingDirection.Down:
                    if (this.Velocity.y == -1)
                        this.ChangeAnimation(this.isRunning === true ? femaleAnimations.runDown : femaleAnimations.walkDown);
                    else
                        this.ChangeAnimation(femaleAnimations.walkDownIdle);
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
            this.PlayAnimation(this.currentAnimation);
        }

        this.UpdateMovement();
    }

    CEvent(eventType, key, data) {
        switch (eventType) {
            case 'input':
                if (data == 0) {
                    switch (key) {
                        case 'a': this.Velocity.x = this.Direction.x = 1; this.Direction.y = 0; break;
                        case 'w': this.Velocity.y = this.Direction.y = 1; this.Direction.x = 0; break;
                        case 'd': this.Velocity.x = this.Direction.x = -1; this.Direction.y = 0; break;
                        case 's': this.Velocity.y = this.Direction.y = -1; this.Direction.x = 0; break;
                        case 'leftShift': this.isRunning = true; this.MovementSpeed = new Vector2D(-3, -3); break;
                    }
                } else if (data == 1) {
                    switch (key) {
                        case 'a':
                        case 'w':
                        case 'd':
                        case 's':
                            this.Velocity.x = this.Velocity.y = 0;
                            break;

                        case 'e':
                            CustomEventHandler.NewCustomEvent('use', this);
                            break;

                        case 'leftShift': this.isRunning = false; this.MovementSpeed = new Vector2D(-1, -1); break;
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