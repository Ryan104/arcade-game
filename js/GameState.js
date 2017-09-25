console.log('GameState.js');

class GameState {
	constructor(lives, level=0, score=0){
		this.lives = lives; // The player's remaining lives
		this.level = level; // the curent level
		this.score = score; // The player's score

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

	// Start a level
	startLevel(levelNumber){
		this.level = levelNumber;
		this.currentEnemyCount = this.levelContents[levelNumber];
	}

	moveStars(){
		this.starBackground.collide(this.bottomBorder, function(star, bottom){
			star.position.y = 0;
		});
	}
}
