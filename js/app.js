'use strict';

//
// Enemy - enemies our player must avoid
//
class Enemy {
    constructor({speed = defaultEnemySpeed, yPos = enemyStartYPos, sprite = defaultEnemySprite} = {}) {
        this.sprite = sprite;
        this.speed = speed;
        this.x = 0;
        this.y = yPos;
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        this.x = this.x + (this.speed * dt);
        if (this.collisionOccurred()) {
            youDiedSound.play();
            player.resetPosition();
        }
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    collisionOccurred() {
        var enemy = this;
        var collision = (player, enemy) => {
            return (player.x <= enemy.x + 64 && player.x >= enemy.x - 64) &&
                (player.y <= enemy.y + 64 && player.y >= enemy.y - 64)};
        return collision(player, enemy);
    }
};

//
// Player - character user controls
//
class Player {
    constructor(speed = defaultPlayerSpeed) {
        this.sprite = defaultPlayerSprite;
        this.resetPosition();
        this.speed = speed;
    }

    // Handle update to players position
    update() {

        // Don't allow off canvas to left
        if (this.x < 0) {
            this.x = 0;
        }

        // Don't allow off canvas to right
        if (this.x > 410) {
            this.x = 410;
        }

        // Don't allow off canvas down
        if (this.y > 420) {
            this.y = 420;
        }

        // Player won, made it to top
        if (this.y < 0) {
            youWonSound.play();
            this.resetPosition();
        }

    }

    // Put player back at starting position
    resetPosition() {
        this.x = startPosition.xPos;
        this.y = startPosition.yPos;
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(press) {
        if (press === 'left') {
            this.x -= this.speed;
        } else if (press === 'right') {
            this.x += this.speed;
        } else if (press === 'down') {
            this.y += this.speed;
        } else if (press === 'up') {
            this.y -= this.speed;
        }
    }
}

//
// Class to manage the game
//
class Game {
    static spawnEnemies() {
        const enemySpriteList = ['images/enemy-bug.png', 'images/grass-block.png', 'images/water-block.png'];
        let enemyNumber = Math.floor(Math.random() * Math.floor(maxNumEnemies));
        for (var i = 0; i < enemyNumber; i++) {
            let randomSpriteIndex = Math.floor(Math.random() * Math.floor(enemySpriteList.length));
            allEnemies.push(new Enemy({
                speed: (defaultEnemySpeed * Math.random() * 3) + defaultEnemySpeed,
                yPos: (enemyStartYPos * Math.random() * 5) + enemyStartYPos,
                sprite: enemySpriteList[randomSpriteIndex]
            }));
        }
    }
    static start() {
            setInterval(Game.spawnEnemies, enemySpawnRate);
    }
}

const startPosition = {xPos: 200, yPos: 420};
const defaultPlayerSpeed = 40;
const defaultPlayerSprite = 'images/char-boy.png';

const enemyStartYPos = 50;
const defaultEnemySpeed = 45;
const defaultEnemySprite = 'images/enemy-bug.png';
const maxNumEnemies = 4;
const enemySpawnRate = 1200;

let youDiedSound = new Audio('sounds/YouDied.m4a');
let youWonSound = new Audio('sounds/YouWon.m4a');

let allEnemies = [];
let player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

Game.start();
