// Many of the calculations in this program are done using cellWidth and numCellsInRow, but can just as easy
// be done using cellHeight and numCellsInColumn since they are symmetric.

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;
const numCellsInRow = 20;
const numCellsInColumn = 20;
const cellWidth = canvas.width / numCellsInRow;
const cellHeight = canvas.height / numCellsInColumn;

function Snake() {
	this.snakeLength = 4;
	this.xPosTail = 60;
	this.yPosTail = height / 2;
	this.xPosHead = this.xPosTail + (this.snakeLength * cellWidth);
	this.yPosHead = height / 2;
	this.direction = ""
}

function Food() {
	this.firstDraw = true;
	this.xPosDefault = 320;
	this.yPosDefault = height / 2;
	this.xPos = getRandom();
	this.yPos = getRandom();
}

// Run the program

let snake = new Snake();
let food = new Food();
drawWalls();
drawSnake();
drawFood();

// Control snake with key inputs
window.addEventListener("keydown", function(e) {
	switch (event.code) {
		case "KeyW":
		case "ArrowUp":
			if (snake.direction !== "up" && snake.direction !== "down") {
				snake.direction = "up";
				moveSnake();
			}
			break;
		case "KeyD":
		case "ArrowRight":
			if (snake.direction !== "right" && snake.direction !== "left") {
				snake.direction = "right";
				moveSnake();
			}
			break;
		case "KeyS":
		case "ArrowDown":
			if (snake.direction !== "down" && snake.direction !== "up") {
				snake.direction = "down";
				moveSnake();
			}
			break;
		case "KeyA":
		case "ArrowLeft":
			if (snake.direction !== "left" && snake.direction !== "right") {
				snake.direction = "left";
				moveSnake();
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
	for (let i = snake.xPosTail; i < snake.xPosHead; i += cellWidth) {
		ctx.fillRect(i, snake.yPosTail, cellWidth, cellHeight);
	}
}

function moveSnake() {
	//clearCanvas();
	if (snake.direction === "up") {
		console.log("up");
	} else if (snake.direction === "right") {
		//snake.xPosHead += cellWidth;
		console.log("right");
	} else if (snake.direction === "down") {
		console.log("down");
	} else if (snake.direction === "left") {
		//snake.xPosHead -= cellWidth;
		console.log("left");
	}
}

// If this is the first time drawing food, draw it at the specified default location. 
// Otherwise, draw it at a random location.
function drawFood() {
	ctx.fillStyle = "rgb(255, 0, 0)"

	if (food.firstDraw) {
		ctx.fillRect(food.xPosDefault, food.yPosDefault, cellWidth, cellHeight);
		food.firstDraw = false;
	} else {
		ctx.fillRect(food.xPos, food.yPos, cellWidth, cellHeight);
	}
}

function eatFood() {
	clearCanvas();

	//grow snake

	drawSnake();
	drawFood();
}


function gameOver() {
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