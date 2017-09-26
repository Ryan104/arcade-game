// Canvas manipulation code goes here
/* 2 main functions: 
	setup() - runs on load 
	draw() - runs every frame
*/

let gameState;
let player;


function setup(){
	console.log('Running setup()');

	// Create canvas and append to document
	let canvas = createCanvas(350,465);
	canvas.parent(document.getElementById('canvas-container'));

	// Setup the game state (lives, level#, enemy patterns, score, etc)
	gameState = new GameState(3); // Init with 3 lives


	// Create player ship
	gameState.startLevel(0);



}

function draw(){
	background(0); // black

	gameState.automation(); // keeps star background scrolling
	gameState.playerInputs();
	gameState.collisions();

	fill(170,170,17);
	textSize(16);
	text(('Score: ' + gameState.score), width-70, 20);

	text(('Lives: ' + gameState.lives), 20, 20);

	drawSprites(); // draws all sprites to canvas (p5.play.js)


}