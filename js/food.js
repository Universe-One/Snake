import canvas, { ctx } from "./canvas.js";
import game, { scoreElem, highScoreElem } from "./game.js";
import snake from "./snake.js";

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

	//BUG FOOD ISN'T GETTING NEW COORDS WHEN SPAWNING ON SNAKE
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
			return element.xPos === food.xPos && element.yPos === food.yPos;
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

export default food;