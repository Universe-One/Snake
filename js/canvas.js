// The element references have "Elem" suffixes to differentiate them from variables used in the program.
const canvasElem = document.querySelector("#game-canvas");
const ctx = canvasElem.getContext("2d");

// canvas object contains variables related to the canvas and methods which affect the canvas.
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

export default canvas;
export { ctx };