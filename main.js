const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;
const numCellsInRow = 20;
const numCellsInColumn = 20;
const cellWidth = canvas.width / numCellsInRow;
const cellHeight = canvas.height / numCellsInColumn;
const initPos = 60;
let snakeLength = 4;

drawWalls();
drawSnake();
drawFood();



function drawWalls() {
	ctx.fillStyle = "rgb(0, 0, 0)";
	// for loop's condition expression and increment expression uses width, but could
	// just as easily use height since they are symmetric.
	for(let i = 0; i < width; i += cellWidth) {
		ctx.fillRect(i, 0, cellWidth, cellHeight);
		ctx.fillRect(0, i, cellWidth, cellHeight);
		ctx.fillRect(i, height - cellHeight, cellWidth, cellHeight);
		ctx.fillRect(width - cellWidth, i, cellWidth, cellHeight);
	}
}

function drawSnake() {
	ctx.fillStyle = "rgb(0, 192, 0)"
	for (let i = initPos; i < initPos + (cellWidth * snakeLength); i += cellWidth) {
		ctx.fillRect(i, height / 2, cellWidth, cellHeight);
	}
}

function drawFood() {
	ctx.fillStyle = "rgb(255, 0, 0)"
	ctx.fillRect(width - cellWidth - initPos, height / 2, cellWidth, cellHeight);
}