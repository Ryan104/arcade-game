console.log('GameState.js');

class GameState {
	constructor(lives, level=0, score=0){
		this.playing = false;
		this.lives = lives; // The player's remaining lives
		this.level = level; // the curent level
		this.score = score; // The player's score
		this.player = this.createPlayer();
		this.message = "GO!";

		this.enemies = new Group();

		this.playerProjectiles = new Group(); // player projectiles will have collision events with enemies
		this.enemyProjectiles = new Group(); // enemy projectiles will have collision events with the player

		// levelContents -- how many enemies appear each level, etc
		this.levelContents = [
			{
				enemyCount: 3
			},
			{
				enemyCount: 4
			},
			{
				enemyCount: 5
			},
			{
				enemyCount: 6
			},
			{
				enemyCount: 6
			},
			{
				enemyCount: 6
			}
		];

		this.currentEnemyCount; // Keep track of how many enemies are left on screen

		// Borders - stuff get deleted when it crosses these
		this.borders = this.createBorderGroup();

		// Star Background - we're flying!
		this.starBackground = new Group();
		for (let i=0; i<20; i++){
			let randSize = random(2,6);
			let star = createSprite(random(width), random(height), randSize, randSize);
			star.setVelocity(0, 1.3); // move toward bottom of screen to simulate movement
			star.shapeColor = color(random(200,255), random(200,255), random(200,255));
			this.starBackground.add(star);
		}
	}

	// Create a player instance
	createPlayer(){
		let player = createSprite(width/2, height-50, 25, 25);
		player.addImage(basicPlayerImg, 'playerStd');
		//player.shapeColor = color(255,0,0);

		return player;
	}

	// Create an enemy instance
	createEnemyGroup(x,y,n){
		// create n enemies
		let enemyGroup = new Group();

		for (let i=0; i<n; i++){
			let enemy = createSprite(x+i*50, y, 10, 10);  // create new enemeis spaced across field
			
			enemy.addImage(basicEnemyImg, 'enemyStd');  // add a sprite image
			
			//enemy.shapeColor = color(100, 255, 0);  // no sprite image

			enemy.health = 3;  // enemies can take 3 hits

			enemy.setVelocity(0,0.5);  // enemies slowly move to bottom of screen
		
			this.enemies.add(enemy);  // add the enemies to the group for collision detection
		}
		return enemyGroup;
	}

	destroyEnemy(enemySprite){
		enemySprite.remove();
		this.currentEnemyCount -= 1;
	}

	destroyPlayer(player){ // when the player dies...
		// create an exploding animation
		let death = createSprite(player.position.x, player.position.y, 20, 20);
		death.addImage(deathImg);
		death.life = 50;

		// remove the player sprite from the game
		player.remove();

		// If there are any lives left - create a new player sprite, else the game is over
		this.lives -= 1;
		if (this.lives > 0){
			this.player = this.createPlayer();
		} else {
			this.playing = false;
		}
	}

	createProjectile(whoShot, x, y, vel=2){
		// whoshot must be 'player' or 'enemy'
		// x and y are the initial position of the projectile (ie the position of the object that created them)
		// v is the velocity of the projectile

		let newProjectile = createSprite(x, y, 2, 5);

		if (whoShot === 'player'){
			newProjectile.setVelocity(0, (vel * -1));
			newProjectile.shapeColor = color(0,0,255);
			this.playerProjectiles.add(newProjectile);
		} else if (whoShot === 'enemy'){
			newProjectile.setVelocity(0, vel);
			newProjectile.addImage(redLaserImg, 'enemy laser');
			//newProjectile.shapeColor = color(255,0,0);
			this.enemyProjectiles.add(newProjectile);
		}


	}

	createBorderGroup(){
		// creates boundaries for the game board - useful for detecting when objects leave the playing field
		// TODO: Make borders transparent
		let borders = new Group();
		borders.add(createSprite(width/2, height, width, 2)); // Bottom
		borders.add(createSprite(width/2, 0, width, 2)); // Top
		borders.add(createSprite(width, height/2, 2, height)); // Right
		borders.add(createSprite(0, height/2, 2, height)); // Left

		for (let i=0;i<4;i++){
			//borders[i].immovable = true;
			borders[i].shapeColor = color(0,0,255);
		}

		return borders;
	}

	// Start a level
	startLevel(levelNumber){
		this.playing = true;
		console.log('starting level ' + this.level);

		// repeat level 6
		if (this.level > 5){
			this.currentEnemyCount = this.levelContents[5].enemyCount;
		} else {
			this.currentEnemyCount = this.levelContents[this.level].enemyCount;
		}

		// Create enemies based off levelContents
		this.createEnemyGroup(50,50,this.currentEnemyCount);
	}

	increaseScore(points, prefix=""){
		// increaseScore() - add to the score property, dispays a notification, and updates the highscore board
		// Increase the score property
		this.score += points;
		// Display message when user scores points
		this.message = prefix + ' (+' + points + ' points)';

		// Add score to the the scores element with the largest ID (the most recent one)
		sortScores(allScores, 'id');
		allScores[0].score = this.score;
		// display all the scores
		displayScores(allScores);
		// save scores to localStorage
		window.localStorage.setItem('scores', JSON.stringify(allScores));
	}

	playerInputs(){
		// Player movement
		if (keyIsDown(65)){ // 65 == a
			this.player.position.x -= 2;
		}
		if (keyIsDown(68)){
			this.player.position.x += 2;
		}
		// Player fire
		if (keyIsPressed){
			if (key === ' '){
				this.createProjectile('player', this.player.position.x, this.player.position.y);
				key = ']'; // reset key to prevent rapid fire
			}
		}

		/* 
			there are multiple ways to take keyboard inputs, tired several. 
			key is down works best because you can get mutltiple key presses at same time
			otherwise javscript's 'key' or 'keycode' variable will always be the most recent press
		*/
	}

	collisions(){
		// ---- Border Collisions ---- //

		// Player cant leave field
		this.player.collide(this.borders[2]);
		this.player.collide(this.borders[3]); // NOTE: could not get collider to work with entire borders group...

		// Projectiles cannot leave borders
		this.playerProjectiles.collide(this.borders[1], function(projectile){
			projectile.remove();
		});

		// Enemy leaves the game
		this.enemies.collide(this.borders[0], (enemy, projectile) => {
			this.destroyEnemy(enemy);
			console.log(this.currentEnemyCount);
		});

		// cycle the background
		this.starBackground.collide(this.borders[0], function(star, bottom){
			star.position.y = 0;
		});

		if (this.playing){ // only check collisions if the game is active ie Not game over

			// ---- Projectile Collisions ---- //

			// Player's projectile hits enemy
			this.enemies.collide(this.playerProjectiles, (enemy, projectile) => {
				enemy.health -= 1;
				if (enemy.health <= 0){
					this.destroyEnemy(enemy);
					this.increaseScore(20, 'Destroyed Enemy');
				}
				projectile.remove();
			});

			// Enemies projectile hits player
			this.enemyProjectiles.collide(this.player, (projectile, player) => {
				this.destroyPlayer(player);
				projectile.remove();

				console.log('lives: ' + this.lives);
			});


			// ---- Player/Enemy Collision ---- //

			// player collides with enemy
			this.enemies.collide(this.player, (enemy, player) => {
				this.destroyEnemy(enemy);
				this.destroyPlayer(player);
			});
		}
	}

	automation(){

		// Enemy fire randomly
		this.enemies.forEach((enemy) => {
			if (Math.random() < 0.01){ // odds of enemy firing each frame
				this.createProjectile('enemy', enemy.position.x, enemy.position.y, 1.5);
			}
		});

		// Display the score and lives at top of canvas
		fill(170,170,17);
		textSize(16);
		text(('Score: ' + this.score), width-90, 20);
		text(('Lives: ' + this.lives), 20, 20);
		textAlign(CENTER);
		text(this.message, width/2, 50);

		// Check if player is dead... display game over
		if (!this.playing && this.lives <= 0){
			fill(170,170,17);
			textSize(36);
			textAlign(CENTER);
			text('GAME OVER', width/2, height/2);
			textSize(22);
			text('Final Score: ' + this.score, width/2, height/1.5);

		}

		// Move to next level if all enemies gone
		if (this.playing && this.currentEnemyCount === 0){
			this.increaseScore(this.level * 15, 'Level ' + (this.level+1));
			this.level += 1;
			if (this.level % 3 === 0 && this.level !== 0){ 
				this.lives += 1;
			}
			this.startLevel(this.level);

		}
	}
}
