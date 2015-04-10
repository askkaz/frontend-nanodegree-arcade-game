// Enemies our player must avoid
var topSpeed = 200;
var rowPosY = [-41, 42, 125, 208, 291, 374];
var difficulty = 1;
var maxEnemyX = 450;
var maxPlayerX = 404;
var startPlayerX = 202;
var cellWidth = 101;
var cellHeight = 83;
var level = 1;

//Detect Collisions
function isCollision(player,enemy){
    return (player.y == enemy.y) && (Math.pow((player.x - enemy.x),2) < 20) ? true : false;
}
//Notify of game over condition
function gameOver() {
    window.alert('GAME OVER!!!');
}
//Notify of leveling up
function levelUp(){
    level += 1;
    window.alert("Success!! Now starting level " + level + ".  Good Luck.");
}

var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.initialize();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.speed * difficulty;
    if (this.x > maxEnemyX){
        this.initialize();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.initialize = function(){
    this.speed = 100 + topSpeed * Math.random()
    this.y = rowPosY[1 + Math.floor(3 * Math.random())]
    this.x = 0;
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.hero = 'images/char-boy.png';
    this.initialize();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function() {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    //TODO collision detection
    for (var i = allEnemies.length - 1; i >= 0; i--) {
        if(isCollision(this,allEnemies[i])){
            difficulty = 1;
            this.initialize();
            gameOver();
            allEnemies = allEnemies.slice(0,3);
            level = 1;
        }
    }
    //console.log(isCollision(this,allEnemies[0]));
};

// Draw the enemy on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.hero), this.x, this.y);
};

// Handle Inputs
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

Player.prototype.initialize = function(){
    this.x = startPlayerX;
    this.y = rowPosY[5];
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
for (var i = 2; i >= 0; i--) {
    allEnemies.push(new Enemy);
};
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
