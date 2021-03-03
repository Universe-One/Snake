//TODO
// Make it so direction can only be changed once per cycle
//
// Make it so food cannot spawn on top of snake

// Many of the calculations in this program are done using cellWidth and numCellsInRow, but can just as easy
// be done using cellHeight and numCellsInColumn since they are symmetric.

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");
const score = document.querySelector("#score");

const width = canvas.width;
const height = canvas.height;
const numCellsInRow = 20;
const numCellsInColumn = 20;
const cellWidth = canvas.width / numCellsInRow;
const cellHeight = canvas.height / numCellsInColumn;

function Game() {
	this.isOver = false;
	this.score = 0;
}

function Snake() {
	this.snakeLength = 4;
	this.xPosTail = 60;
	this.yPosTail = height / 2;
	this.xPosHead = this.xPosTail + (this.snakeLength * cellWidth);
	this.yPosHead = height / 2;
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
drawWalls();
drawSnake();
drawFood();

const intervalId = setInterval(gameLoop, 1000);

function gameLoop(timestamp) {
	clearCanvas();
	drawFood();
	moveSnake();
}

// Control snake with key inputs
window.addEventListener("keydown", function(e) {
	switch (event.code) {
		case "KeyW":
		case "ArrowUp":
			if (snake.directionQueue.length < 2) {
				if (snake.direction !== "up" && snake.direction !== "down") {
					snake.directionQueue.push("up");
					console.log(snake.directionQueue);
				}
			}
			break;
		case "KeyD":
		case "ArrowRight":
			if (snake.directionQueue.length < 2) {
				if (snake.direction !== "right" && snake.direction !== "left") {
					snake.directionQueue.push("right");
					console.log(snake.directionQueue);
				}
			}
			break;
		case "KeyS":
		case "ArrowDown":
			if (snake.directionQueue.length < 2) {
				if (snake.direction !== "down" && snake.direction !== "up") {
					snake.directionQueue.push("down");
					console.log(snake.directionQueue);
				}
			}
			break;
		case "KeyA":
		case "ArrowLeft":
			if (snake.directionQueue.length < 2) {
				if (snake.direction !== "left" && snake.direction !== "right") {
					snake.directionQueue.push("left");
					console.log(snake.directionQueue);
				}
			}
			break;
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
	ctx.fillRect(snake.xPosHead, snake.yPosHead, cellWidth, cellHeight);



/*
	if (snake.direction === "up" ) {
		ctx.fillRect(snake.xPosHead, snake.yPosHead, cellWidth, cellHeight);
	} else if (snake.direction === "right") {
		ctx.fillRect(snake.xPosHead, snake.yPosHead, cellWidth, cellHeight);
	} else if (snake.direction === "down") {
		ctx.fillRect(snake.xPosHead, snake.yPosHead, cellWidth, cellHeight);
	} else if (snake.direction === "left") {
		ctx.fillRect(snake.xPosHead, snake.yPosHead, cellWidth, cellHeight);
	}
*/
}

function moveSnake() {
	if (snake.directionQueue.length !== 0) {
		snake.direction = snake.directionQueue[0];
		snake.directionQueue.shift();
	}

	if (snake.direction === "up") {
		snake.yPosHead -= cellHeight;
	} else if (snake.direction === "right") {
		snake.xPosHead += cellWidth;
	} else if (snake.direction === "down") {
		snake.yPosHead += cellHeight;
	} else if (snake.direction === "left") {
		snake.xPosHead -= cellWidth;
	}

	if (snake.xPosHead === food.xPos && snake.yPosHead === food.yPos) {
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
			snake.yPosHead += cellHeight;
		} else if (snake.direction === "right") {
			snake.xPosHead -= cellWidth;
		} else if (snake.direction === "down") {
			snake.yPosHead -= cellHeight;
		} else if (snake.direction === "left") {
			snake.xPosHead += cellWidth;
		}
	}

	drawSnake();
}

function growSnake() {
	console.log("grow");
}

function detectCollision() {
	// Detect collision with walls
	if (snake.xPosHead < cellWidth ||
	snake.xPosHead >= width - cellWidth ||
	snake.yPosHead < cellHeight ||
	snake.yPosHead >= height - cellHeight) {
		gameOver();
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
	score.textContent = `Score: ${game.score}`;

	growSnake();

	food.xPos = getRandom();
	food.yPos = getRandom();

	drawFood();
}

function gameOver() {
	game.isOver = true;
	clearInterval(intervalId);
	console.log("Game Over!");
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