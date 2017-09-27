console.log('GameState.js');

class GameState {
	constructor(lives, level=0, score=0){
		this.playing = false;
		this.lives = lives; // The player's remaining lives
		this.level = level; // the curent level
		this.score = score; // The player's score
		this.player = this.createPlayer();

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
		//player.immovable = true;

		return player;
	}


	// Create an enemy instance
	createEnemyGroup(x,y,n){
		// create n enemies
		let enemyGroup = new Group();

		for (let i=0; i<n; i++){
			let enemy = createSprite(x+i*50,y, 10, 10);
			enemy.shapeColor = color(100, 255, 0);
			enemy.health = 3;

			// enemy projectiles


			// enemies slowly move to bottom of screen
			enemy.setVelocity(0,0.5);

			this.enemies.add(enemy);
		}
		

		return enemyGroup;
	}

	destroyEnemy(enemySprite){
		enemySprite.remove();
		this.currentEnemyCount -= 1;
	}

	destroyPlayer(player){
		player.remove();
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
			newProjectile.shapeColor = color(255,0,0);
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
		console.log('starting level ' + levelNumber);
		this.level = levelNumber;
		this.currentEnemyCount = this.levelContents[levelNumber].enemyCount;

		// Create enemies based off levelContents
		this.createEnemyGroup(50,50,this.currentEnemyCount);


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
					this.score += 20;
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
			this.level += 1;
			this.startLevel(this.level);

		}
	}
}
