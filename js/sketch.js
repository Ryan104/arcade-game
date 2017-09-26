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

	// Start at level 0
	gameState.startLevel(0);



}

function draw(){
	background(0); // black

	gameState.automation(); // handles enemy movement and displaying score/lives
	gameState.playerInputs(); // handles keyborad inputs
	gameState.collisions();	// Handles all things that have to do with collision

	drawSprites(); // draws all sprites to canvas (p5.play.js)
}