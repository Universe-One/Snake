import canvas, { ctx } from "/js/canvas.js";
import snake from "/js/snake.js";
import food from "/js/food.js";

const scoreElem = document.querySelector("#current-score");
const highScoreElem = document.querySelector("#high-score");

// Game object contains game state and methods related to game state.
const game = {
	isOver: false,
	score: 0,
	highScore: 0,
	gameSpeed: 100,
	intervalId: null,

	// If there is a stored high score, retrieve it. Otherwise, set high score to 0.
	// Then, set the high score text to be whatever the high score is.
	retrieveHighScore: function() {
		localStorage.getItem("highScore") !== null ? 
		this.highScore = localStorage.getItem("highScore") :
		this.highScore = 0;
		highScoreElem.textContent = `High Score: ${this.highScore}`;
	},

	// Create the border of the play area. If the snake collides with this border, the game is over.
	drawWalls: function() {
		ctx.fillStyle = "rgb(0, 0, 0)";
		for(let i = 0; i < canvas.width; i += canvas.cellWidth) {
			ctx.fillRect(i, 0, canvas.cellWidth, canvas.cellHeight);
			ctx.fillRect(0, i, canvas.cellWidth, canvas.cellHeight);
			ctx.fillRect(i, canvas.height - canvas.cellHeight, canvas.cellWidth, canvas.cellHeight);
			ctx.fillRect(canvas.width - canvas.cellWidth, i, canvas.cellWidth, canvas.cellHeight);
		}
	},

	// Retrieve high score from localStorage, draw walls, and draw the keyboard controls panel so the user
	// understands the controls. This method will be run one time when the game first loads, and will never
	// need to be run again.
	initOnceOnLoad: function() {
		game.retrieveHighScore();
		game.drawWalls();

		ctx.fillStyle = "#CCCCCC";
		ctx.fillRect(140, 40, 120, 120);
		
		canvas.drawText("W", "2em monospace", "#000000", (canvas.width / 2) - 37.5, 67.5);
		canvas.drawText("A", "2em monospace", "#000000", (canvas.width / 2) - 12.5, 67.5);
		canvas.drawText("S", "2em monospace", "#000000", (canvas.width / 2) + 12.5, 67.5);
		canvas.drawText("D", "2em monospace", "#000000", (canvas.width / 2) + 37.5, 67.5);
		
		canvas.drawText("or", "1.5em monospace", "#000000", (canvas.width / 2), 100);

		canvas.drawArrowIcon("up", (canvas.width / 2) - 37.5, 132.5);
		canvas.drawArrowIcon("right", (canvas.width / 2) - 12.5, 132.5);
		canvas.drawArrowIcon("down", (canvas.width / 2) + 12.5, 132.5);
		canvas.drawArrowIcon("left", (canvas.width / 2) + 37.5, 132.5);
	},

	// Clear the canvas, draw the snake, and draw the food. This method is called when the game first loads,
	// and then every time the game is reset, so that the game may be played again.
	initBeforeEachGame: function() {
		canvas.clearCanvas();
		snake.draw();
		food.draw();
	},

	// Clear the canvas, draw the piece of food, and move the snake. This is the game loop that is called by
	// setInterval over and over again (after a specified delay) until the game is over.
	loop: function(timestamp) {
		canvas.clearCanvas();
		food.draw();
		snake.move();
	},

	// Start the game loop and set the delay to whatever the game speed is (lower speed values make the game
	// update faster). A game can only be started if there is no current game being played. One cannot play 
	// multiple games at once. This is ensured by the fact that a new game may only begin when game.intervalId 
	// is equal to null. When a new game is able to be started and a valid control is pressed, an intervalId is 
	// assigned, starting the game. When it ends and the game is reset, intervalId is set to null, and the user 
	// is again able to start a new game by inputting a valid control, and so on.
	startGame: function() {
		this.intervalId = setInterval(this.loop, this.gameSpeed);
	},

	// Handle end-of-game operations
	gameOver: function() {
		this.isOver = true;

		// If the snake's head moves into a cell occupied by the wall, triggering the end of the
		// game, reattach its most recently removed tail and remove its head. Neglecting this step
		// will either make the snake's head render above the wall or below the wall with an
		// apparently shorter body.
		snake.cells.push(snake.oldTail);
		snake.cells.shift();

		// Draw the snake one final time in the state it was in when game over triggered.
		snake.draw();

		// Stop the current game loop
		clearInterval(this.intervalId);
		
		// Add a listener that resets the game when Space is pressed.
		window.addEventListener("keydown", this.resetListener);

		// Show game over screen
		ctx.fillStyle = "#CCCCCC";
		ctx.fillRect(100, 140, 200, 120);

		// Prompt user to start a new game by pressing Space.
		canvas.drawText("Game Over!", "2em monospace", "#000000", canvas.width / 2, canvas.height / 2 - 20);
		canvas.drawText("Press Space", "1.2em monospace", "#000000", canvas.width / 2, canvas.height / 2 + 10);
		canvas.drawText("to Restart", "1.2em monospace", "#000000", canvas.width / 2, canvas.height / 2 + 28);
	},

	// Add listener when game is over, allowing game to be reset when Space is pressed.
	// Remove listener when Space is pressed and game is reset.
	// Since the listener is added to the window object, game.reset() must be used.
	// this.reset() does not work because the keyword: this refers to the window object.
	resetListener: function(e) {
		if (e.code === "Space") {
			game.reset();
		}
	},

	// Reset the game, preparing it to be played again.
	reset: function() {
		window.removeEventListener("keydown", this.resetListener);

		// Reset variables back to initial values
		this.isOver = false;
		this.score = 0;
		scoreElem.textContent = `Score: ${this.score}`;
		snake.cells = [{xPos: 120, yPos: 200}, 
					   {xPos: 100, yPos: 200}, 
					   {xPos: 80, yPos: 200}, 
					   {xPos: 60, yPos: 200}];
		snake.direction = "right";
		snake.directionQueue = [];
		snake.oldTail = null;
		food.xPos = 320;
		food.yPos = canvas.height / 2;

		// Set the game back to the state it was in when it first loaded, i.e., with the snake still
		// and awaiting user input. The only difference is that the keyboard control panel will not be displayed
		// since the user is already familiar with the controls.
		this.intervalId = null;
		this.initBeforeEachGame();
	}
}

export default game;
export { scoreElem, highScoreElem };