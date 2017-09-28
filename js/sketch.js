// Initialize objets
let gameState;
let allScores;

// Initialize image variables
let basicPlayerImg;
let basicEnemyImg;
let redLaserImg;
let deathImg;

// Initialize the scores
if (window.localStorage.getItem('scores')){
	// set scores to saved scores if they exist
	allScores = JSON.parse(window.localStorage.scores);
} else {
	// if there isnt any localstorage scores, create it
	clearScores();
}

document.addEventListener("DOMContentLoaded", function() {
	// Display high score list after the page finishes loading
  displayScores(allScores);
});

// Sort the scores array by their score property
function sortScores(scoresArr, sortBy){
	return scoresArr.sort((a, b) => {
		if (a[sortBy] < b[sortBy]){
			return 1;
		} else if (a[sortBy] > b[sortBy]){
			return -1;
		} else {
			return 0;
		}
	});
}

// Add scores to table
function displayScores(scores){
	sortScores(scores, 'score');
	let tableElement = document.getElementById('scoreTable');
	let html = '<thead><tr><th>Player</th><th>Score</th></tr></thead>'; // table header
	scores.forEach((scoreObj) => {
		html += `<tr><td>${scoreObj.name}</td><td>${scoreObj.score}</td></tr>`;
	});

	tableElement.innerHTML = html;
}

function clearScores(){
	// re initialize the highscores
	allScores = [
		{
			name: 'Ryan',
			score: 100,
			id: 0
		}
	];
	window.localStorage.setItem('scores', JSON.stringify(allScores));
	displayScores(allScores);
}


function startGame(){
	// Hide the form and start the game
	document.getElementById('start').style.display = 'none';
	document.getElementById('canvas-container').style.display = 'block';

	// Add the new player to the score list
	let userName = document.getElementById('nameInput').value;
	allScores.push({name: userName, score: 0, id: allScores.length});

	// Start the game
	loop();
}

 function preload(){
// Load sprite image
	basicPlayerImg = loadImage('assets/images/ship-std.png');
	basicEnemyImg = loadImage('assets/images/enemy-std.png');
	redLaserImg = loadImage('assets/images/red-laser.png');
	deathImg = loadImage('assets/images/expl-3.png');
 }


function setup(){
	console.log('Running setup()');

	// Create canvas and append to document
	let canvas = createCanvas(350,465);
	canvas.parent(document.getElementById('canvas-container'));

	// Setup the game state (lives, level#, enemy patterns, score, etc)
	gameState = new GameState(3); // Init with 3 lives

	// Start at level 0
	gameState.startLevel(0);

	noLoop(); // dont start the game untill the button is pressed

}

function draw(){
	background(0); // black

	gameState.automation(); // handles enemy movement and displaying score/lives
	gameState.playerInputs(); // handles keyborad inputs
	gameState.collisions();	// Handles all things that have to do with collision

	drawSprites(); // draws all sprites to canvas (p5.play.js)
}