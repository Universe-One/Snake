import canvas, { ctx } from "./canvas.js";
import game from "./game.js";
import food from "./food.js";

// snake object contains state related to the snake and methods related to the snake.
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

	// Take every cell in the snake object and draw them according to their x and y positions
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

export default snake;