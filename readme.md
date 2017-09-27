# p-1

## A top-down arcade-style shoot'em up game
----------

### Inspiration
This game was inspiration by my favorite [vertically scrolling](https://en.wikipedia.org/wiki/Vertically_scrolling_video_game) arcade shooters such as [Galaga](https://en.wikipedia.org/wiki/Galaga), [Space Invaders](https://en.wikipedia.org/wiki/Space_Invaders), [Yars Revenge](https://en.wikipedia.org/wiki/Yars%27_Revenge), [Sky Shark](https://en.wikipedia.org/wiki/Flying_Shark), and [1943](https://en.wikipedia.org/wiki/1943:_The_Battle_of_Midway).

### Tools
* [p5.js](https://p5js.org/) - a javascript library for manipulating HTML5's `canvas`
* [p5.play.js](http://p5play.molleindustria.org/) - an additional library for p5 writtens specifically for game creation
* Vanilla JS DOM manipulation - For handling everything outside of the canvas

### p5.js overview
p5 and p5.play provide many useful functions that made the development of this game much easier.
The core functionality of p5's canvas manipulation rests in two functions: `setup()` and `draw()`
* `setup()` is executed when the page loads so it is useful for performing all initialization tasks such as creating the canvas, drawing the initial sprites, and initializing the player's data (score, lives, and initial location)
* `draw()` is executed every frame. Here we can listen for user inputs and redraw all the sprites as their position vectors change
Using *p5.play* ontop of *p5* provides the benefit of built-in collision detection and simplified sprite creation.
With *p5*, you would first have to create a constructor function for every type of object that would appear on the screen. Then you would create an instance within `setup()` and finally call the the method of your object which draws it to the screen in the `draw()` function.
For a pong game this would look like this:
```javascript
  let ball;
  let paddle;
  
  setup(){
    ball = new Ball(init_x, init_y, width, height);
    paddle = new Paddle(init_x, init_y, width, height);
  }
  draw(){
    ball.draw();
    paddle.draw();
  }
```
However, *p5.play* provides the `createSprite(x,y,h,w)` and `drawSprites()` methods which allows us to quickly create and draw sprites.
```javascript
  setup(){
    ball = createSprite(init_x, init_y, width, height);
    paddle = createSprite(init_x, init_y, width, height);
  }
  draw(){
    drawSprites();
    }
```
`createSprite()` automatically creates a sprite object with the given size and position and comes preloaded with methods and properties for handling velocity and collision.

Although it may not be clear at first that `drawSprites()` is valuable, it quickly becomes clear when you are trying to draw hundreds of sprites to the canvas every frame.

Perhaps the largest benefit of *p5.play* is its `.collision()` method in the Sprite class. A long collision detection algorithm of if statements becomes a single line.
```javascript
checkCollision(paddle_position, paddle_height, paddle_width){
		if (this.position.x <= 0 || this.position.x >= (width - this.width)){
			this.velocity.x *= -1;
		} 
		if (this.position.y <= 0 || this.position.y >= (height - this.height)) {
			this.velocity.y *= -1;
		} 
		// check if ball is less than paddles x position && within paddles height space
		if (this.position.x <= (paddle_position.x + paddle_width)){
			if (this.position.y <= (paddle_position.y + paddle_height)){
				if (this.position.y >= paddle_position.y){
					this.velocity.x *= -1;
				}
			}
		}
	}
  
  // ---- OR WITH p5.play.js ---- //
  
  ball.collision(walls, callback);
  
  function callback(ball, wall){ /*DO STUFF*/}

```

In this game, I used *p5.play*'s createSprite() method to create enemies, projectiles and the player.

The only limitation I found with *p5.play* was that I could not create new sprite subclasses as follow:
```javascript
class player extends Sprite {
  constructor(pos_X, pos_Y, height, width){
    super(pos_X, pos_Y, height, width);
    // player specific properties and methods
  }
}
```

However, I was still able to add properties to instances of the sprites: 
```javascript
let enemy =  createSprite(x,y,h,w);
enemy.health = 3;
```

### Overview of the DOM Manipulation
I used vanilla JS DOM manipulation to handle the start of the game and the score board.
For the game start, I just added a button that the player can click to show the canvas and start the game.

For the high scores, I store a list of all scores in the browser’s memory and dynamically create a table containing the ordered list of scores every time the player's score changes. This allows the player to see their score in relation to all previous scores in real time.

If I had more resources, I would host the scores on a remote server so that the players could compete against all player everywhere.

### What’s left to be done
* Be able to generate any amount of enemies on the screen at a time
* Increase the difficulty as the levels advance (enemies are stronger / faster)
* Boss battles
* Sound effects / music
* Pixel-art sprites
* Artwork
* Never-ending levels
* Score server
