/******* INITIATE CANVAS *******/
var canvas=document.getElementById("gameCanvas");
var ctx=canvas.getContext("2d");

var baseElementsArr = [];
var mixedElementsArr = [];
var mixingPaletteElementsArr = [];
var helperElementsArr = [];
var progressionManager = new ProgressionManager();
var utility = new Utility();
var elementManager = new ElementManager();
var draggedElement;
var container;
var gameName = 'Breaking Brad';
var gameMode;
var bubblesArr = [];
var onMobile = false;


init();
function init() {
	// Check if user is on mobile
	if (window.orientation >= 0) {
		onMobile = true;
	}
	utility.setFonts();

	// Load menu
	loadMode('menu');
	main();
};

function loadMode(mode) {
	gameMode = mode;
	switch (mode) {
		case 'menu':
			// If not on mobile, hide unneeded stuff and show menu stuff
			if (!onMobile) {
				document.getElementById("endUI").style.display="none";
				document.getElementById("menuButton").disabled = true;
				document.getElementById("startUI").style.display="block";
				document.getElementById("startButton").disabled = false;
				// Create the base elements just to display for the instructions
				elementManager.createBaseElements();
			}
			break;
		case 'main':
			// Add mouse listeners
			window.addEventListener("mousemove", onMouseMove, false);
			window.addEventListener("mousedown", onMouseDown, false);
			// Hide start screen elements				
			document.getElementById("startUI").style.display="none";
			document.getElementById("startButton").disabled = true;

			// Reset relevant vars
			baseElementsArr.length = 0;
			helperElementsArr.length = 0;
			bubblesArr.length = 0;
			mixedElementsArr.length = 0;
			progressionManager.resetProgression();	
			elementManager.createBaseElements();
			elementManager.createHelperElements();
			container = new Container();
			mixingPalette = new MixingPalette();
			progressionManager.resetProgression();
			progressionManager.startProgression();

			// Create bubbles
			initBubbles();

			// Display and activate submit and empty button
			document.getElementById("submitButton").style.display="block";
			document.getElementById("submitButton").disabled = false;
			document.getElementById("emptyButton").style.display="block";
			document.getElementById("emptyButton").disabled = false;
			break;
		case 'finish':
			// Remove listeners
			window.removeEventListener("mousemove", onMouseMove, false);
			window.removeEventListener("mousedown", onMouseDown, false);
			
			// Delete base elements
			baseElementsArr.length = 0;

			// Disable and hide submit and empty buttons
			document.getElementById("submitButton").style.display="none";
			document.getElementById("submitButton").disabled = true;
			document.getElementById("emptyButton").style.display="none";
			document.getElementById("emptyButton").disabled = true;

			// Enable and disaply end screen buttons
			document.getElementById("endUI").style.display="block";
			document.getElementById("menuButton").disabled = false;
		break;
	}
};

function initBubbles() {
	// Pick random number of bubbles to spawn, between 10 and 20
	var quant = utility.randomFromTo(10,20);
	var alpha = utility.randomFromTo(50,100) / 100;
	var color;
	if (mixedElementsArr.length > 0) {
		color = mixedElementsArr[0].color;
	}
	// Create each bubble
	for (var i = 0; i < quant; i++) {
		var bubble = new Bubble();
		bubble.init();
		bubble.alpha = alpha;
		bubble.color = color;
		bubblesArr.push(bubble);
	}
};

function draw() {
	ctx.clearRect (0, 0, canvas.width ,canvas.height);

	// Create green background gradient
	var grd=ctx.createRadialGradient(canvas.width / 2 - 100,canvas.height / 2,5,canvas.width / 2 - 100,canvas.height / 2,canvas.height);
	grd.addColorStop(0,"#13410E");
	grd.addColorStop(1,"#1C2400");

	// Fill canvs with bg gradient
	ctx.fillStyle = grd;
	ctx.fillRect(0,0, canvas.width,canvas.height);

	// If user is not on mobile...
	if (!onMobile) {
		switch(gameMode) {
			// Draw game instructions on menu screen
			case 'menu':
				drawInstructions();
				break;
			// Draw elements, mixing palettes, task, bubbles, etc on main screen
			case 'main':
				drawBaseElements();
				drawHelperElements();
				drawContainer();
				drawMixingPalette();
				drawDraggedElement();
				drawMixingPaletteElements();
				drawTask();
				drawBubbles();
				drawResults();
				drawUI();
				break;
			// Draw finish heading and results on finish screen.
			case 'finish':
				ctx.save();
				ctx.textBaseline = 'top';
				drawFinishHeading();
				drawCookList();
				ctx.restore();
		}
	}

	// If user is on mobile, tell them they're screwed
	else {
		ctx.fillStyle = '#fff';
		ctx.font = fontSmallHeading;
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		var x = canvas.width / 2;
		var y = canvas.height / 2;
		ctx.fillText('Sorry! No mobile support because reasons :( ', x, y);
	}
};

// The following are self explanatory based on their functon names...
function drawInstructions() {
	ctx.textBaseline = 'baseline';
	var x = 10;
	var y = 250;
	ctx.font = fontRegular;
	ctx.fillStyle = '#c6c9b1';
	ctx.fillText('Dear Brad,', x, y);
	y += fontRegularInterval * 1.5;
	ctx.fillText('Your teacher wants you to cook some totally legal substances using 5 base elements:', x, y);
	y += fontRegularInterval * 1.5 + 65;
	drawBaseElements();

	ctx.fillText('Then he wants to sell them. The simpler the final substance, the more "pure" and valuable it is.', x, y);
	y += fontRegularInterval * 1.5;

	ctx.save();
	ctx.fillStyle = '#fff';
	ctx.fillText('Combine the BASE ELEMENTS to get the properties he\'s looking for. They are unlimited.', x, y);
	y += fontRegularInterval;
	ctx.fillText('You\'ve got some limited HELPER ELEMENTS to use as well. These restock after each cook:', x, y);
	ctx.restore();
	x += 780;
	ctx.save();
	ctx.fillStyle = 'rgb(189,189,189)';
	ctx.beginPath();
	ctx.arc(x + 15, y - 5, 15, 0, 2*Math.PI, false);
	ctx.closePath();
	ctx.fill();

	ctx.fillStyle = 'rgba(0,0,0,0.3)';
	var symbol = 'Li';
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';
	ctx.font = fontSmallHeading;
	ctx.fillText(symbol, x + 15, y - 5);
	ctx.restore();

	y += fontRegularInterval * 1.5;
	x -= 780;
	ctx.fillText('TIP: Antemanium has a useful effect! Add it to a formula to reverse very polarized properties.', x, y);
	y += fontRegularInterval;
	ctx.fillText('TIP: Drag elements from the mixing vial to the Palette to save them for later.', x, y);

};

function drawFinishHeading() {
	ctx.textBaseline = 'top';
	var x = canvas.width / 2;
	var y = 10;
	ctx.font = fontTitle;
	ctx.textAlign = 'center';
	ctx.fillStyle = '#c6c9b1';
	if (progressionManager.currentGrade === 'F') {
		ctx.fillText('You Failed', x, y);
	}
	else {
		ctx.fillText('Done!', x, y);
	}
};

function drawCookList() {
	var x = canvas.width / 4;
	var y = 130;
	ctx.font = fontSmallHeading;
	ctx.textAlign = 'left';
	var totalEarned = 0;
	for (var i = 0; i < progressionManager.allCookResultsArr.length; i++) {
		var cook = progressionManager.allCookResultsArr[i];
		ctx.fillText('Cook ' + (i + 1) + ':', x, y);
		x += 150;
		ctx.fillText(cook.formula, x, y);
		x += 150;
		ctx.fillText('|', x, y);
		x += 100;
		ctx.fillText(cook.value, x, y);
		x = canvas.width / 4;
		y += fontSmallHeadingInterval;
		totalEarned += cook.value;
	}
	y += fontSmallHeadingInterval;
	ctx.fillText('TOTAL EARNED: $' + totalEarned, x, y);
};

function drawContainer() {
	if (container) {
		container.draw();
	}
};

function drawMixingPalette() {
	if (mixingPalette) {
		mixingPalette.draw();
	}
};

function drawBubbles() {
	for (var i = 0; i < bubblesArr.length; i++) {
		var bubble = bubblesArr[i];
		bubble.draw();
	}
};


function drawTask() {
	progressionManager.drawTask();
};

function drawBaseElements() {
	var x = 5;
	var y = 100;
	var size = 50;
	var margin = 5;

	for (var i = 0; i < baseElementsArr.length; i++) {
		element = baseElementsArr[i];
		element.draw();
	}
};


function drawHelperElements() {
	var x = 5;
	var y = 100;
	var size = 50;
	var margin = 5;

	for (var i = 0; i < helperElementsArr.length; i++) {
		element = helperElementsArr[i];
		element.draw();
	}
};


function drawDraggedElement() {
	if (draggedElement) {
		draggedElement.draw();
	}
};

function drawMixedElements() {
	var x = 5;
	var y = 100;
	var size = 50;
	var margin = 5;

	for (var i = 0; i < mixedElementsArr.length; i++) {
		element = mixedElementsArr[i];
		element.draw();
	}
};

function drawMixingPaletteElements() {
	var x = 5;
	var y = 100;
	var size = 50;
	var margin = 5;

	for (var i = 0; i < mixingPaletteElementsArr.length; i++) {
		element = mixingPaletteElementsArr[i];
		element.draw();
	}
};

function drawResults() {
	progressionManager.drawResults();
};

function drawUI() {
	drawFrame();
};

function drawWindowStroke(x, y, width, height) {
	// Draw window outline
	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#165124';
	ctx.rect(x - 2, y - 2,width, height);
	ctx.stroke();

	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#616b4d';
	ctx.rect(x - 2, y - 2, width + 1, height);
	ctx.stroke();
};

function drawFrame() {
	ctx.save();
	// Draw blue at top
	var barHeight = '50';
	ctx.fillStyle = '#c6c9b1';
	ctx.textBaseline = 'top';
	ctx.textAlign = 'left';
	ctx.font = fontWindowHeading;
	ctx.fillText(gameName, 10, 7);

	// Draw window outline
	drawWindowStroke(3, 3, canvas.width - 5, canvas.height - 4);
	ctx.restore();

};

// Game loop
function main() {
	var now = Date.now();
	var delta = now - then;
	window.requestAnimFrame(main);
	modifier = delta/1000;
	draw();

	then = now;
};


var then = Date.now();