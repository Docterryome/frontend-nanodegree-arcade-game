

var speedBase = 75;
var speedVariation = 250;
var randomSpeed = function (){
    return Math.floor((Math.random() * speedVariation) + speedBase);
}

// A sprite that just sits and does nothing.
// Wait what? - Just play the game
var PlainSprite = function(sprite, x, y) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
}

PlainSprite.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = randomSpeed();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // If enemy has left the screen, reload it before the begining
    // with a new speed to simulate a new enemy
    if(this.x < 500){
    this.x += this.speed * dt;
    }
    else{
        this.x = -100;
        this.speed = randomSpeed();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Just a plain ole sprite object that sticks with yeah



//Uses the player render functions



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.init = function init(){
        this.points = 0;
        this.life = 3;
        this.playerIterator = 0;
        this.chars = ["images/char-boy.png", "images/char-cat-girl.png", "images/char-horn-girl.png", "images/char-pink-girl.png", "images/char-princess-girl.png"];
        this.sprite = this.chars[this.playerIterator];
        //Starts players at the bottom middle tile
        this.x = 200;
        this.y = 380;
        this.isUpdated = false;
        $("#lives").replaceWith('<h3 id="lives">Lives: ' + this.life + "</h3>");
        $("#points").replaceWith('<h3 id="points">Points: ' + this.points + "</h3>");
    }
};

Player.prototype.update = function() {
    // Checks for collision of enemy
    for(enemy in allEnemies){
        if (Math.abs(this.x - allEnemies[enemy].x ) < 45 && Math.abs(this.y - allEnemies[enemy].y) < 15){
            this.x = 200;
            this.y = 380;
            this.life--;
            $("#lives").replaceWith('<h3 id="lives">Lives: ' + this.life + "</h3>");

        }
    }

    // Checks if player got to the other side
    if(this.y < 0){
        this.points++;
        spriteArray.push(new PlainSprite(this.sprite, this.x, this.y));
        this.playerIterator++;
        this.sprite = this.chars[this.playerIterator % 5];
        this.x = 200;
        this.y = 380;
        this.isUpdated = true;
        $("#points").replaceWith('<h3 id="points">Points: ' + this.points + "</h3>");
    }
    // This will update the speed of the bugs for each 
    // time all the charactors reach the other side
    // isUpdated is only used to make sure this if statement
    // is only called once after all char reach the other side
    // otherwise the bugs will go crazy fast really quick.
    if(this.playerIterator % 5 == 0 && this.isUpdated){
        this.points += this.playerIterator;
        speedVariation += this.playerIterator;
        speedBase += this.playerIterator;
        spriteArray = [];
        this.isUpdated = false;
        $("#points").replaceWith('<h3 id="points">Points: ' + this.points + "</h3>");
    }
    // Checks the life of the player
    if(this.life < 0){
        // Stop Game
        spriteArray = [];
        this.init();
        speedBase = 75;
        speedVariation = 250;
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Players input
Player.prototype.handleInput = function(input){
    var isCollision = false;

        for(sprites in spriteArray){
            if(Math.abs(this.y - spriteArray[sprites].y) < 95 && Math.abs(this.x - spriteArray[sprites].x) < 10){
                //console.log("2chainz!");
                isCollision = true;
            }
        }
    if(input == 'left' && this.x > 0){
        this.x -= 101;
    }
    if(input == 'right' && this.x < 402){
        this.x += 101;
    }
    // Do to update function player will never reach top
    // Check if player is below a sprite object
    if(input == 'up' && !isCollision){
        this.y -= 86;
    }
    if(input == 'down' && this.y < 380) {
        this.y += 86;
    }
    //console.log("x: "+ this.x + ", y: " + this.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var bug1 = new Enemy(0, 36);
var bug2 = new Enemy(0, 122);
var bug3 = new Enemy(0, 208);
var allEnemies = [bug1, bug2, bug3];
var player = new Player();
player.init();
var spriteArray = [];


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
