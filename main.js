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
//const initPos = 60;
//let snakeLength = 4;

function Snake() {
	this.snakeLength = 4;
	this.xPosTail = 60;
	this.yPosTail = height / 2;
	this.xPosHead = this.xPosTail + (this.snakeLength * cellWidth);
	this.yPosHead = height / 2;
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
drawFood();


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

function drawFood() {
	ctx.fillStyle = "rgb(255, 0, 0)"

	if (food.firstDraw) {
		ctx.fillRect(food.xPosDefault, food.yPosDefault, cellWidth, cellHeight);
		food.firstDraw = false;
	} else {
		ctx.fillRect(food.xPos, food.yPos, cellWidth, cellHeight);
	}
}

function getRandom() {
	// (cellWidth - 2) is 18 and is used because two of the cells in the 20 cell row belong to the walls.
	// The play area is an 18 cell by 18 cell grid. The walls do not count as part of the play area.
	return Math.floor(Math.random() * (numCellsInRow - 2)) * cellWidth + cellWidth;		
}