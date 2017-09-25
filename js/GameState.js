console.log('GameState.js');

class GameState {
	constructor(lives, level=0, score=0){
		this.lives = lives; // The player's remaining lives
		this.level = level; // the curent level
		this.score = score; // The player's score
		this.player;

		// levelContents -- how many enemies appear each level, etc
		this.levelContents = [
			{
				enemyCount: 3
			}
		];

		this.currentEnemyCount; // Keep track of how many enemies are left on screen

		// Borders - stuff get deleted when it crosses these
		this.bottomBorder = createSprite(width/2, height, width, 2);
		this.bottomBorder.shapeColor = (100);
		this.bottomBorder.immovable = 0;

		this.topBorder = createSprite(width/2, 0, width, 2);
		this.topBorder.shapeColor = (100);
		this.topBorder.immovable = 0;

		// Star Background - we're flying!
		this.starBackground = new Group();
		for (let i=0; i<20; i++){
			let randSize = random(2,6);
			let star = createSprite(random(width), random(height), randSize, randSize);
			star.setVelocity(0, 2); // move toward bottom of screen to simulate movement
			star.shapeColor = color(random(200,255), random(200,255), random(200,255));
			this.starBackground.add(star);
		}
	}

	// Create a player instance
	createPlayer(){
		console.log('creating player');
		let player = createSprite(width/2, height-50, 25, 25);
		player.shapeColor = color(255,0,0);
		player.immovable = true;

		return player;
	}


	// Create an enemy instance
	createEnemyGroup(x,y,n){
		// create n enemies
		let enemyGroup = new Group();

		for (let i=0; i<n; i++){
			let enemy = createSprite(x+i*50,y, 20, 20);
			enemy.shapeColor = color(100, 255, 0);
			enemy.immovable = true;

			// enemies slowly move to bottom of screen
			enemy.setVelocity(0,0.25);

			enemyGroup.add(enemy);
		}
		

		return enemyGroup;
	}

	// Start a level
	startLevel(levelNumber){
		console.log('starting level ' + levelNumber);
		this.level = levelNumber;
		this.currentEnemyCount = this.levelContents[levelNumber];

		// Create Player
		this.player = this.createPlayer();

		// Create enemies based off levelContents
		this.createEnemyGroup(50,50,3);


	}

	movePlayer(){
		if (keyIsDown(65)){ // 65 == a
			this.player.position.x -= 2;
		}
		if (keyIsDown(68)){
			this.player.position.x += 2;
		}

		// there are multiple ways to take keyboard inputs, tired several. key is down works best because you can get mutltiple key presses at same time
		// otherwise javscript's 'key' or 'keycode' variable will always be the most recent press
	}

	moveStars(){
		this.starBackground.collide(this.bottomBorder, function(star, bottom){
			star.position.y = 0;
		});
	}
}
