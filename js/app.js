/** Global variables. */
var topSpeed = 200;
var rowPosY = [-41, 42, 125, 208, 291, 374];
var difficulty = 1;
var maxEnemyX = 600;
var maxPlayerX = 404;
var startPlayerX = 202;
var cellWidth = 101;
var cellHeight = 83;
var level = 1;

/**
 * Detects collisions
 * @param {Player} player - The hero of the game.
 * @param {Enemy} enemy - One of the bad guys.
 */
function isCollision(player,enemy){
    return (player.y == enemy.y) && (Math.pow((player.x - enemy.x),2) < 3000) ? true : false;
}

/** Pop up window for game over condition. */
function gameOver() {
    window.alert('GAME OVER!!!');
}

/** Pop up window for level up condition. */
function levelUp(){
    level += 1;
    window.alert("Success!! Now starting level " + level + ".  Good Luck.");
}

/**
 * Represents an enemy.
 * @constructor
 */
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.initialize();
};

/**
 * Updates the enemies position.
 * @param {float} dt - The time between frames.
 */
Enemy.prototype.update = function(dt) {
    this.x += dt * this.speed * difficulty;
    if (this.x > maxEnemyX){
        this.initialize();
    }
};

/** Draw the enemy on the screen. */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/** Initialize speed and position data for the enemy. */
Enemy.prototype.initialize = function(){
    this.speed = 100 + topSpeed * Math.random()
    this.y = rowPosY[1 + Math.floor(3 * Math.random())]
    this.x = -100;
};

/**
 * Represents a hero player.
 * @constructor
 */
var Player = function() {
    this.hero = 'images/char-boy.png';
    this.initialize();
};

/** Checks for collisions between hero and all enemies. */
Player.prototype.update = function() {
    for (var i = allEnemies.length - 1; i >= 0; i--) {
        if(isCollision(this,allEnemies[i])){
            difficulty = 1;
            this.initialize();
            gameOver();
            allEnemies = allEnemies.slice(0,3);
            level = 1;
            break;
        }
    }
};

/** Draw the hero on the screen. */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.hero), this.x, this.y);
};

/** Handle key presses. */
Player.prototype.handleInput = function(key) {
    switch (key){
        case 'left':
        this.x = Math.max(this.x - cellWidth,0);
        break;
        case 'up':
        this.y = Math.max(this.y - cellHeight,rowPosY[0]);
        if (this.y === rowPosY[0]){
            this.initialize();
            difficulty += 0.1;
            allEnemies.push(new Enemy);
            levelUp();
        }
        break;
        case 'right':
        this.x = Math.min(this.x + cellWidth,maxPlayerX);
        break;
        case 'down':
        this.y = Math.min(this.y + cellHeight,rowPosY[5]);
        break;
    }
};

/** Initialize player position. */
Player.prototype.initialize = function(){
    this.x = startPlayerX;
    this.y = rowPosY[5];
};

/** Instantiate the objects. */
var allEnemies = [];
for (var i = 2; i >= 0; i--) {
    allEnemies.push(new Enemy);
};
var player = new Player();

/** Listen for key presses. */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
