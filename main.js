//TODO



// Many of the calculations in this program are done using cellWidth and numCellsInRow, but can just as easy
// be done using cellHeight and numCellsInColumn since they are symmetric.

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");
const score = document.querySelector("#current-score");
const highScore = document.querySelector("#high-score");

const width = canvas.width;
const height = canvas.height;
const numCellsInRow = 20;
const numCellsInColumn = 20;
const cellWidth = canvas.width / numCellsInRow;
const cellHeight = canvas.height / numCellsInColumn;

function Game() {
	this.isOver = false;
	this.score = 0;
	this.highScore = 0;
	this.gameSpeed = 100;
}

Game.prototype.retrieveHighScore = function() {
	localStorage.getItem("highScore") !== null ? 
	this.highScore = localStorage.getItem("highScore") :
	this.highScore = 0;
	
	highScore.textContent = `High Score: ${game.highScore}`;
};

Game.prototype.initBeforeEachGame = function() {
	clearCanvas();
	drawSnake();
	drawFood();
}

Game.prototype.gameOver = function() {
	this.isOver = true;
	clearInterval(intervalId);
	console.log("Game Over!");
	window.addEventListener("keydown", game.resetListener);
};

Game.prototype.resetListener = function(e) {
	if (e.code === "Space") {
		game.reset();
	}
};

Game.prototype.reset = function() {
	window.removeEventListener("keydown", game.resetListener);

	// Reset variables back to initial values
	this.isOver = false;
	this.score = 0;
	score.textContent = `Score: ${game.score}`;
	snake.cells = [{xPos: 120, yPos: 200}, 
				   {xPos: 100, yPos: 200}, 
				   {xPos: 80, yPos: 200}, 
				   {xPos: 60, yPos: 200}];
	snake.direction = "right";
	snake.directionQueue = [];
	snake.oldTail = null;
	food.xPos = 320;
	food.yPos = height / 2;

	// Start a new game loop
	intervalId = setInterval(gameLoop, game.gameSpeed);
	game.initBeforeEachGame();
};

function Snake() {
	// this.cells[0] is the snake's head and this.cells[this.cells.length - 1] is the snake's tail
	this.cells = [{xPos: 120, yPos: 200}, 
				   {xPos: 100, yPos: 200}, 
				   {xPos: 80, yPos: 200}, 
				   {xPos: 60, yPos: 200}];
	this.direction = "right";
	this.directionQueue = [];
	this.oldTail = null;
}

function Food() {
	this.xPos = 320;
	this.yPos = height / 2;
}

const game = new Game();
const snake = new Snake();
const food = new Food();

// Run the program
game.retrieveHighScore();
drawWalls();
game.initBeforeEachGame();

let intervalId = setInterval(gameLoop, game.gameSpeed);

function gameLoop(timestamp) {
	clearCanvas();
	drawFood();
	moveSnake();
}

// Keyboard controls
window.addEventListener("keydown", function(e) {
	// Length of directionQueue is limited to 2 so that the game does not remember too many
	// spammed inputs which may be accidental, but also retains the feeling of responsiveness.
	// As long as directionQueue's length is less than 2, another direction can be added to it.
	if (snake.directionQueue.length < 2) {
		switch (e.code) {
			case "KeyW":
			case "ArrowUp":
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

// Create the border of the play area
function drawWalls() {
	ctx.fillStyle = "rgb(0, 0, 0)";
	for(let i = 0; i < width; i += cellWidth) {
		ctx.fillRect(i, 0, cellWidth, cellHeight);
		ctx.fillRect(0, i, cellWidth, cellHeight);
		ctx.fillRect(i, height - cellHeight, cellWidth, cellHeight);
		ctx.fillRect(width - cellWidth, i, cellWidth, cellHeight);
	}
}

// Take every cell in the snake object and draw it according to its x and y position
function drawSnake() {
	ctx.fillStyle = "rgb(0, 192, 0)"
	
	snake.cells.forEach(function(element) {
		ctx.fillRect(element.xPos, element.yPos, cellWidth, cellHeight);
	})
}

function moveSnake() {
	if (snake.directionQueue.length !== 0) {
		snake.direction = snake.directionQueue[0];
		snake.directionQueue.shift();
	}

	// Remove the last cell (the tail) from the cells array
	snake.oldTail = snake.cells.pop();

	// Attach a cell to the beginning of the cells array, giving the snake a new head.
	// The removal of the snake's tail and attachment of a new head is what gives the appearance
	// of movement.
	if (snake.direction === "up") {
		snake.cells.unshift({xPos: snake.cells[0].xPos, yPos: snake.cells[0].yPos - cellHeight});
	} else if (snake.direction === "right") {
		snake.cells.unshift({xPos: snake.cells[0].xPos + cellWidth, yPos: snake.cells[0].yPos});
	} else if (snake.direction === "down") {
		snake.cells.unshift({xPos: snake.cells[0].xPos, yPos: snake.cells[0].yPos + cellHeight});
	} else if (snake.direction === "left") {
		snake.cells.unshift({xPos: snake.cells[0].xPos - cellWidth, yPos: snake.cells[0].yPos});
	}

	if (snake.cells[0].xPos === food.xPos && snake.cells[0].yPos === food.yPos) {
		eatFood();
	}

	detectCollision();

	// If the snake's head moves into a cell occupied by the wall, triggering the end of the
	// game, reattach its most recently removed tail and remove its head. Neglecting this step
	// will either make the snake's head render above the wall or below the wall with an
	// apparently shorter body.
	if (game.isOver) {
		snake.cells.push(snake.oldTail);
		snake.cells.shift();
	}
	drawSnake();
}

// When growSnake() is called from eatFood(), it reattaches the tail that was just removed
// this moveSnake() step. This grows the snake by one unit rather than just moving it.
function growSnake() {
	snake.cells.push(snake.oldTail);
}

function detectCollision() {
	// Detect collision with walls
	if (snake.cells[0].xPos < cellWidth ||
	snake.cells[0].xPos >= width - cellWidth ||
	snake.cells[0].yPos < cellHeight ||
	snake.cells[0].yPos >= height - cellHeight) {
		game.gameOver();
	}

	// Detect collision with self
	for (let i = 1; i < snake.cells.length; i++) {
		if (snake.cells[0].xPos === snake.cells[i].xPos &&
		snake.cells[0].yPos === snake.cells[i].yPos) {
			game.gameOver();
		}
	}
}

// If this is the first time drawing food, draw it at the specified default location. 
// Otherwise, draw it at a random location.
function drawFood() {
	ctx.fillStyle = "rgb(255, 0, 0)"

	ctx.fillRect(food.xPos, food.yPos, cellWidth, cellHeight);
}

// Increment score, update high score if needed, grow the snake, generate random coordinates 
// for new piece of food and draw it.
function eatFood() {
	game.score += 5;

	if (game.highScore <= game.score) {
		game.highScore = game.score;

		localStorage.setItem("highScore", game.highScore);
	}

	score.textContent = `Score: ${game.score}`;
	highScore.textContent = `High Score: ${game.highScore}`;

	growSnake();

	// First, choose a random cell. If this cell is occupied by the snake,
	// choose another random cell. Continue this process until a cell is
	// chosen which is not occupied by the snake. Draw the piece of food there.
	do {
		food.xPos = getRandom();
		food.yPos = getRandom();
	} while (snake.cells.some(function(element) {
		return element.xPos === food.xPos && element.yPos === food.yPos;
	}));
	
	drawFood();
}

// Clears the whole 18x18 cell play area, leaving the walls in tact.
function clearCanvas() {
	ctx.clearRect(cellWidth, cellHeight, width - (cellWidth * 2), height - (cellHeight * 2));
}

// Gets a random cell from the 18x18 cell play area. The play area does not include cells occupied by walls.
function getRandom() {
	// (cellWidth - 2) is 18 and is used because two of the cells in the 20 cell row belong to the walls.
	// The play area is an 18 cell by 18 cell grid. The walls do not count as part of the play area.
	return Math.floor(Math.random() * (numCellsInRow - 2)) * cellWidth + cellWidth;
}