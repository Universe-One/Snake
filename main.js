// Some of the calculations in this program are done using canvas.cellWidth or canvas.numCellsInRow, 
// but can just as easily be done using canvas.cellHeight and canvas.numCellsInColumn since they are symmetric.
// The element references have "Elem" suffixes to differentiate them from variables used in the program.

import canvas from "/canvas.js"
import game from "/game.js";
import snake from "/snake.js";
import food from "/food.js";

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