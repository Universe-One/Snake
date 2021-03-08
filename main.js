//TODO
// MAKE ONE FINAL PASS THROUGH CODE AND COMMENTS TO ENSURE ACCURACY

// Implement ES6 Modules
// Refactor/tidy up code (get rid of global variables)
// Clean up commenting
// Add a canvas(or some other aptly named) object for clearcanvas, drawText, etc. to be methods of


// Some of the calculations in this program are done using canvas.cellWidth or canvas.numCellsInRow, 
// but can just as easily be done using canvas.cellHeight and canvas.numCellsInColumn since they are symmetric.
// The element references have "Elem" suffixes to differentiate them from variables used in the program.
const canvasElem = document.querySelector("#game-canvas");
const ctx = canvasElem.getContext("2d");
const scoreElem = document.querySelector("#current-score");
const highScoreElem = document.querySelector("#high-score");

const canvas = {
	width: canvasElem.width,
	height: canvasElem.height,
	numCellsInRow: 20, 
	numCellsInColumn: 20,

	// An object property cannot reference another property of the same object in its declaration
	// using the this keyword. Therefore, canvasElem.width / this.numCellsInRow cannot be assigned to
	// cellWidth through normal property assignment. Likewise, canvasElem.height / this.numCellsInColumn
	// cannot be assigned directly to cellHeight. Using a getter function is a good workaround.
	// Inside of an object, the this keyword simply refers to the global window object. However, inside
	// of a method/function, the this keyword is set to the object that the method/function is called on.
	get cellWidth() {
		return this.width / this.numCellsInRow;
	},
	get cellHeight() {
		return this.height / this.numCellsInColumn;
	},

	// Clears the 18x18 cell play area, leaving the walls in tact. Since the walls are static and nothing
	// can ever appear above them, clearing the whole 20x20 canvas and redrawing the walls is not necessary.
	clearCanvas: function() {
		ctx.clearRect(this.cellWidth, this.cellHeight, 
					  this.width - (this.cellWidth * 2), this.height - (this.cellHeight * 2));
	},

	// Draw text on the canvas (used for keyboard control panel and game over panel).
	drawText: function(text, font, color, xPos, yPos) {
		ctx.fillStyle = color;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = font;
		ctx.fillText(text, xPos, yPos);
	},

	// Draw arrow icons to represent arrow keys. These are drawn to the right of the
	// WASD key icons. The values chosen are intended to keep spacing symmetric.
	drawArrowIcon: function(direction, xPos, yPos) {
		let xOffsetStem;
		let yOffsetStem;
		let xOffsetHead;
		let yOffsetHead;
		let headPoint;
		let yOffsetExtra = 0;
		let xOffsetExtra = 0;
		switch (direction) {
			// Set variables related to drawing arrow heads and arrow stems, then draw arrow heads.
			case "up":
				xOffsetStem = 1;
				yOffsetStem = 8;
				xOffsetHead = 5;
				yOffsetHead = 4;
				headPoint = yOffsetHead - 6;
				ctx.beginPath();
				ctx.moveTo(xPos - xOffsetHead, (yPos - yOffsetStem) + yOffsetHead);
				ctx.lineTo(xPos, (yPos - yOffsetStem) + headPoint);
				ctx.lineTo(xPos + xOffsetHead, (yPos - yOffsetStem) + yOffsetHead);
				ctx.fill();
				break;
			case "right":
				xOffsetStem = 8;
				yOffsetStem = 1;
				xOffsetHead = -4;
				yOffsetHead = 5;
				headPoint = xOffsetHead + 6;
				xOffsetExtra = 2; // move 2 pixels to the left for symmetry of pixel spacing
				ctx.beginPath();
				ctx.moveTo(((xPos + xOffsetStem) + xOffsetHead) - xOffsetExtra, yPos - yOffsetHead);
				ctx.lineTo(((xPos + xOffsetStem) + headPoint) - xOffsetExtra , yPos);
				ctx.lineTo(((xPos + xOffsetStem) + xOffsetHead) - xOffsetExtra, yPos + yOffsetHead);
				ctx.fill();
				break;
			case "down":
				xOffsetStem = 1;
				yOffsetStem = 8;
				xOffsetHead = 5;
				yOffsetHead = -4;
				headPoint = yOffsetHead + 6;
				yOffsetExtra = 2; // move 2 pixels up to vertically align down arrow with other arrows
				ctx.beginPath();
				ctx.moveTo(xPos - xOffsetHead, ((yPos + yOffsetStem) + yOffsetHead) - yOffsetExtra);
				ctx.lineTo(xPos, ((yPos + yOffsetStem) + headPoint) - yOffsetExtra);
				ctx.lineTo(xPos + xOffsetHead, ((yPos + yOffsetStem) + yOffsetHead) - yOffsetExtra);
				ctx.fill();
				break;
			case "left":
				xOffsetStem = 8;
				yOffsetStem = 1;
				xOffsetHead = 4;
				yOffsetHead = 5;
				headPoint = xOffsetHead - 6;
				ctx.beginPath();
				ctx.moveTo(((xPos - xOffsetStem) + xOffsetHead) - xOffsetExtra, yPos - yOffsetHead);
				ctx.lineTo(((xPos - xOffsetStem) + headPoint) - xOffsetExtra , yPos);
				ctx.lineTo(((xPos - xOffsetStem) + xOffsetHead) - xOffsetExtra, yPos + yOffsetHead);
				ctx.fill();
				break;
		}
		// Draw arrow stems
		ctx.beginPath();
		ctx.moveTo(((xPos) - xOffsetStem) - xOffsetExtra, (yPos - yOffsetStem) - yOffsetExtra);
		ctx.lineTo(((xPos) - xOffsetStem) - xOffsetExtra, (yPos + yOffsetStem) - yOffsetExtra);
		ctx.lineTo(((xPos) + xOffsetStem) - xOffsetExtra, (yPos + yOffsetStem) - yOffsetExtra);
		ctx.lineTo(((xPos) + xOffsetStem) - xOffsetExtra, (yPos - yOffsetStem) - yOffsetExtra);
		ctx.fill();
	}
}

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

// Snake object contains state related to the snake and methods related to the snake.
const snake = {
	// An array of objects, each with xPos and yPos properties, are used to represent the snake's cells.
	// cells[0] is the snake's head and cells[cells.length - 1] is the snake's tail.
	cells: [{xPos: 120, yPos: 200}, 
			{xPos: 100, yPos: 200}, 
			{xPos: 80, yPos: 200}, 
			{xPos: 60, yPos: 200}],
	direction: "right",
	directionQueue: [],
	// oldTail is used to grow the snake when food is eaten and to draw the final state of the snake
	// if a collision occurs with the outer walls.
	oldTail: null,

	// Take every cell in the snake object and draw it according to its x and y position
	draw: function() {
		ctx.fillStyle = "rgb(0, 192, 0)"
		
		this.cells.forEach(function(element) {
			ctx.fillRect(element.xPos, element.yPos, canvas.cellWidth, canvas.cellHeight);
		})
	},

	// Physically move the snake and handle operations related to the snake's movement such as eating food
	// and detecting collision.
	move: function() {
		// If the the direction queue is not empty, take the next-in-line direction and apply it to the snake
		// before removing it from the queue.
		if (this.directionQueue.length !== 0) {
			this.direction = this.directionQueue[0];
			this.directionQueue.shift();
		}

		// Remove the last cell (the tail) from the cells array
		this.oldTail = this.cells.pop();

		// Attach a cell to the beginning of the cells array, giving the snake a new head.
		// The removal of the snake's tail and attachment of a new head is what gives the appearance
		// of movement.
		if (this.direction === "up") {
			this.cells.unshift({xPos: this.cells[0].xPos, yPos: this.cells[0].yPos - canvas.cellHeight});
		} else if (this.direction === "right") {
			this.cells.unshift({xPos: this.cells[0].xPos + canvas.cellWidth, yPos: this.cells[0].yPos});
		} else if (this.direction === "down") {
			this.cells.unshift({xPos: this.cells[0].xPos, yPos: this.cells[0].yPos + canvas.cellHeight});
		} else if (this.direction === "left") {
			this.cells.unshift({xPos: this.cells[0].xPos - canvas.cellWidth, yPos: this.cells[0].yPos});
		}

		// If snake's head occupies the same cell as a piece of food, eat it.
		if (this.cells[0].xPos === food.xPos && this.cells[0].yPos === food.yPos) {
			food.eat();
		}

		// Detect collision between the snake and itself and between the snake and the outer walls.
		this.detectCollision();

		// Call snake.draw() here if the game is not over. This is the default behavior. 
		// If the game is over, snake.draw() is instead called from game.gameOver() before 
		// the game over screen is drawn. The snake needs to be drawn one final time in
		// game.gameOver() to show the state of the snake when game over triggers. It needs 
		// to be drawn before the game over screen so the snake never renders above the
		// game over screen.
		if (!game.isOver) {
			this.draw();
		}
	},
	// When snake.grow() is called from food.eat(), it reattaches the tail that was just removed
	// this snake.move() step. This grows the snake by one unit rather than just moving it.
	grow: function() {
		this.cells.push(this.oldTail);
	},
	// Check if snake's head occupies a cell which is also occupied by an outer wall or another snake cell.
	// If it does, then the game is over.
	detectCollision: function() {
		// Detect collision with walls
		if (this.cells[0].xPos < canvas.cellWidth ||
		this.cells[0].xPos >= canvas.width - canvas.cellWidth ||
		this.cells[0].yPos < canvas.cellHeight ||
		this.cells[0].yPos >= canvas.height - canvas.cellHeight) {
			game.gameOver();
		}
		// Detect collision with self
		for (let i = 1; i < this.cells.length; i++) {
			if (this.cells[0].xPos === this.cells[i].xPos &&
				this.cells[0].yPos === this.cells[i].yPos) {
				game.gameOver();
			}
		}
	}
}

// Food object contains position of food and methods related to food.
const food = {
	xPos: 320,
	yPos: canvas.height / 2,

	// If this is the first time drawing food, draw it at the specified default location. 
	// Otherwise, draw it at a random location.
	draw: function() {
		ctx.fillStyle = "rgb(255, 0, 0)"

		ctx.fillRect(this.xPos, this.yPos, canvas.cellWidth, canvas.cellHeight);
	},
	// Increment score, update high score if needed, grow the snake, generate random coordinates 
	// for new piece of food and draw it.
	eat: function() {
		game.score += 5;

		if (game.highScore <= game.score) {
			game.highScore = game.score;

			localStorage.setItem("highScore", game.highScore);
		}

		scoreElem.textContent = `Score: ${game.score}`;
		highScoreElem.textContent = `High Score: ${game.highScore}`;

		snake.grow();

		// First, choose a random cell. If this cell is occupied by the snake,
		// choose another random cell. Continue this process until a cell is
		// chosen which is not occupied by the snake. Draw the piece of food there.
		do {
			this.xPos = this.getRandom();
			this.yPos = this.getRandom();
		} while (snake.cells.some(function(element) {
			return element.xPos === this.xPos && element.yPos === this.yPos;
		}));
		
		this.draw();
	},
	// Gets a random cell from the 18x18 cell play area. The play area does not include cells occupied by walls.
	getRandom: function() {
		// (canvas.numcellsInRow - 2) is 18 and is used because two of the cells in the 20 cell row/column 
		// belong to the walls, and as a result, should not be able to be chosen.
		return Math.floor(Math.random() * (canvas.numCellsInRow - 2)) * canvas.cellWidth + canvas.cellWidth;
	}
}

// Initialize the game, preparing it to be played.
game.initBeforeEachGame();
game.initOnceOnLoad();

// Keyboard controls
window.addEventListener("keydown", function(e) {
	// Length of directionQueue is limited to 2 so that the game does not remember too many
	// spammed inputs which may be accidental, but also retains the feeling of responsiveness.
	// As long as directionQueue's length is less than 2, another direction can be added to it.

	if (snake.directionQueue.length < 2) {
		switch (e.code) {
			case "KeyW":
			case "ArrowUp":
				// When the game is loaded for the first time or is reset after a game over, 
				// the intervalId will be null and the snake will be frozen in place.
				// If the controls for up, right, or down are pressed, the game starts
				// and the snake begins moving in the selected direction. If the control for
				// left is pressed, nothing happens, as the snake begins by facing right,
				// which makes it illegal for the snake to move left.
				if (game.intervalId === null) {
					game.startGame();
				}
				// When a directional button is pressed and there is nothing in the queue,
				// add the appropriate direction to the queue if the snake is not currently 
				// moving in or opposite that direction.
				if (snake.direction !== "up" && snake.direction !== "down" &&
					snake.directionQueue.length === 0) {
					snake.directionQueue.push("up");
				}
				// When a directional button is pressed and there is something in the queue,
				// add the appropriate direction to the queue as its second direction element
				// if this is different from the queue's first direction element.
				// A queue should not be allowed to look like ["up", "up"], and this is what
				// prevents that.
				if (snake.directionQueue[0] !== "up" && snake.directionQueue[0] !== "down" &&
					snake.directionQueue.length > 0) {
					snake.directionQueue.push("up");
				}
				break;
			case "KeyD":
			case "ArrowRight":
				if (game.intervalId === null) {
					game.startGame();
				}
				if (snake.direction !== "right" && snake.direction !== "left" &&
					snake.directionQueue.length === 0) {
					snake.directionQueue.push("right");
				}
				if (snake.directionQueue[0] !== "right" && snake.directionQueue[0] !== "left" &&
					snake.directionQueue.length > 0) {
					snake.directionQueue.push("right");
				}
				break;
			case "KeyS":
			case "ArrowDown":
				if (game.intervalId === null) {
					game.startGame();
				}
				if (snake.direction !== "down" && snake.direction !== "up" &&
					snake.directionQueue.length === 0) {
					snake.directionQueue.push("down");
				}
				if (snake.directionQueue[0] !== "down" && snake.directionQueue[0] !== "up" &&
					snake.directionQueue.length > 0) {
					snake.directionQueue.push("down");
				}
				break;
			case "KeyA":
			case "ArrowLeft":
				if (snake.direction !== "left" && snake.direction !== "right" &&
					snake.directionQueue.length === 0) {
					snake.directionQueue.push("left");
				}
				if (snake.directionQueue[0] !== "left" && snake.directionQueue[0] !== "right" &&
					snake.directionQueue.length > 0) {
					snake.directionQueue.push("left");
				}
				break;
		}
	}
});