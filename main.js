//TODO
// Make it so food cannot spawn on top of snake




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

let intervalId = setInterval(gameLoop, 200);

function Game() {
	this.isOver = false;
	this.score = 0;
	this.highScore = 0;
}

Game.prototype.retrieveHighScore = function() {
	localStorage.getItem("highScore") !== null ? 
	this.highScore = localStorage.getItem("highScore") :
	this.highScore = 0;
	
	highScore.textContent = `High Score: ${game.highScore}`;
};

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
	snake.snakeLength = 4;
	snake.cells = [{xPos: 120, yPos: 200}, 
				   {xPos: 100, yPos: 200}, 
				   {xPos: 80, yPos: 200}, 
				   {xPos: 60, yPos: 200}];
	/*snake.xPosTail = 60;
	snake.yPosTail = height / 2;
	snake.xPosHead = snake.xPosTail + (snake.snakeLength * cellWidth);
	snake.yPosHead = height / 2;*/
	snake.direction = "right";
	snake.directionQueue = [];
	food.xPos = 320;
	food.yPos = height / 2;

	// Start a new game loop
	intervalId = setInterval(gameLoop, 200);
};

function Snake() {
	this.snakeLength = 4;
	this.cells = [{xPos: 120, yPos: 200}, 
				   {xPos: 100, yPos: 200}, 
				   {xPos: 80, yPos: 200}, 
				   {xPos: 60, yPos: 200}];
	/*this.xPosTail = 60;
	this.yPosTail = height / 2;
	this.xPosHead = this.xPosTail + (this.snakeLength * cellWidth);
	this.yPosHead = height / 2;*/
	this.direction = "right";
	this.directionQueue = [];
}

function Food() {
	this.xPos = 320;
	this.yPos = height / 2;
}

// Run the program
const game = new Game();
const snake = new Snake();
const food = new Food();
game.retrieveHighScore();
drawWalls();
drawSnake();
drawFood();


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

function drawWalls() {
	ctx.fillStyle = "rgb(0, 0, 0)";
	for(let i = 0; i < width; i += cellWidth) {
		ctx.fillRect(i, 0, cellWidth, cellHeight);
		ctx.fillRect(0, i, cellWidth, cellHeight);
		ctx.fillRect(i, height - cellHeight, cellWidth, cellHeight);
		ctx.fillRect(width - cellWidth, i, cellWidth, cellHeight);
	}
}

function drawSnake() {
	ctx.fillStyle = "rgb(0, 192, 0)"

	// Working one-cell version
	ctx.fillRect(snake.cells[0].xPos, snake.cells[0].yPos, cellWidth, cellHeight);
}

function moveSnake() {
	if (snake.directionQueue.length !== 0) {
		snake.direction = snake.directionQueue[0];
		snake.directionQueue.shift();
	}

	if (snake.direction === "up") {
		snake.cells[0].yPos -= cellHeight;
	} else if (snake.direction === "right") {
		snake.cells[0].xPos += cellWidth;
	} else if (snake.direction === "down") {
		snake.cells[0].yPos += cellHeight;
	} else if (snake.direction === "left") {
		snake.cells[0].xPos -= cellWidth;
	}

	if (snake.cells[0].xPos === food.xPos && snake.cells[0].yPos === food.yPos) {
		eatFood();
	}

	detectCollision();

	// If snake's head moves into a cell occupied by the wall, triggering the end of the
	// game, move the head back one cell so the head doesn't physically render over/under
	// the wall. Even if the wall is rendered over the snake's head, neglecting this step
	// causes the snake to appear one unit shorter when it collides with a wall
	// since the snake's head will be drawn under the wall, which should not be possible.
	if (game.isOver) {
		if (snake.direction === "up") {
			snake.cells[0].yPos += cellHeight;
		} else if (snake.direction === "right") {
			snake.cells[0].xPos -= cellWidth;
		} else if (snake.direction === "down") {
			snake.cells[0].yPos -= cellHeight;
		} else if (snake.direction === "left") {
			snake.cells[0].xPos += cellWidth;
		}
	}

	drawSnake();
}

function growSnake() {
	console.log("grow");
}

function detectCollision() {
	// Detect collision with walls
	if (snake.cells[0].xPos < cellWidth ||
	snake.cells[0].xPos >= width - cellWidth ||
	snake.cells[0].yPos < cellHeight ||
	snake.cells[0].yPos >= height - cellHeight) {
		game.gameOver();
	}
}

// If this is the first time drawing food, draw it at the specified default location. 
// Otherwise, draw it at a random location.
function drawFood() {
	ctx.fillStyle = "rgb(255, 0, 0)"

	ctx.fillRect(food.xPos, food.yPos, cellWidth, cellHeight);
}

// Increment score, generate random coordinates for new piece of food and draw it.
function eatFood() {
	game.score += 5;

	if (game.highScore <= game.score) {
		game.highScore = game.score;

		localStorage.setItem("highScore", game.highScore);
	}


	score.textContent = `Score: ${game.score}`;
	highScore.textContent = `High Score: ${game.highScore}`;

	growSnake();

	food.xPos = getRandom();
	food.yPos = getRandom();

	drawFood();
}

// Clears the whole 18 cell by 18 cell play area, leaving the walls in tact.
function clearCanvas() {
	ctx.clearRect(cellWidth, cellHeight, width - (cellWidth * 2), height - (cellHeight * 2));
}

function getRandom() {
	// (cellWidth - 2) is 18 and is used because two of the cells in the 20 cell row belong to the walls.
	// The play area is an 18 cell by 18 cell grid. The walls do not count as part of the play area.
	return Math.floor(Math.random() * (numCellsInRow - 2)) * cellWidth + cellWidth;		
}