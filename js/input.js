var numShapes;
var shapes;
var dragIndex;
var dragging;
var mouseX;
var mouseY;
var dragHoldX;
var dragHoldY;
var timer;
var targetX;
var targetY;
var ease = 0.45;

var draggedFromMixingPalette = false;


function onMouseDown(event) {
	var i;
	var boundingRect = canvas.getBoundingClientRect();
	mouseX = (event.clientX - boundingRect.left)*(canvas.width/boundingRect.width);
	mouseY = (event.clientY - boundingRect.top)*(canvas.height/boundingRect.height);

	// Loop through all base elements
	for (var i=0; i < baseElementsArr.length; i++) {
		// Check if mouse is touching the element as it goes down
		if (baseElementsArr[i].hitTest(mouseX, mouseY)) {	
			// If yes, spawn new base element to drag
			draggedElement = elementManager.spawnNewElement(baseElementsArr[i].name);
			draggedElement.x = mouseX;
			draggedElement.y = mouseY;
			dragging = true;
			draggedFromMixingPalette = false;
			dragIndex = 0;
		}
	}
	
	// Loop through all elements in mixing palette
	for (var i=0; i < mixingPaletteElementsArr.length; i++) {
		// Check if mouse is touching the element as it goes down
		if (mixingPaletteElementsArr[i].hitTest(mouseX, mouseY)) {	
			draggedElement = mixingPaletteElementsArr[i];
			draggedElement.x = mouseX;
			draggedElement.y = mouseY;
			dragging = true;
			draggedFromMixingPalette = true;
			dragIndex = 0;
		}
	}
	
	// Loop through all helper elements
	for (var i=0; i < helperElementsArr.length; i++) {
		// Check if mouse is touching the element as it goes down
		if (helperElementsArr[i].hitTest(mouseX, mouseY)) {	
			draggedElement = helperElementsArr[i];
			draggedElement.x = mouseX;
			draggedElement.y = mouseY;
			dragging = true;
			dragIndex = 0;
		}
	}

	// If container exists and there is an element inside, and the mouse is touching the container as it goes down...
	if (container && mixedElementsArr.length > 0 && container.hitTest(mouseX, mouseY)) {
		draggedElement = mixedElementsArr[0];
		draggedElement.x = mouseX;
		draggedElement.y = mouseY;
		dragging = true;
		draggedFromMixingPalette = false;
		dragIndex = 0;	
	}

	if (dragging) {
		dragHoldX = mouseX - draggedElement.x;
		dragHoldY = mouseY - draggedElement.y;
		targetX = mouseX - dragHoldX;
		targetY = mouseY - dragHoldY;
		timer = setInterval(onTimerTick, 1000/30);
	}
	window.removeEventListener("mousedown", onMouseDown, false);
	window.addEventListener("mouseup", onMouseUp, false);
	
	if (event.preventDefault) {
		event.preventDefault();
	} 
	else if (event.returnValue) {
		event.returnValue = false;
	} 
	return false;
};


function onTimerTick() {
	draggedElement.x = draggedElement.x + ease * (targetX - draggedElement.x);
	draggedElement.y = draggedElement.y + ease * (targetY - draggedElement.y);

	if ((!dragging)&&(Math.abs(draggedElement.x - targetX) < 0.1) && (Math.abs(draggedElement.y - targetY) < 0.1)) {
		draggedElement.x = targetX;
		draggedElement.y = targetY;
	}
};


function onMouseUp(event) {
	var sound = new Audio();
	window.addEventListener("mousedown", onMouseDown, false);
	window.removeEventListener("mouseup", onMouseUp, false);
	
	// If something is being dragged...
	if (dragging) {
		// Drop it
		dragging = false;
		clearInterval(timer);
		// If dragged element is not a helper or an element from the container...
		if (draggedElement !== mixedElementsArr[0] && !draggedElement.isHelper) {
			// Check if dragged element is now in container
			var inContainer = container.hitTest(draggedElement.x, draggedElement.y);
			//If it IS in container...
			if (inContainer) {
				// If it is being dragged from the mixing palette to the container...
				if (draggedFromMixingPalette) {
					// Remove it from the mixing palette
					mixingPalette.removeFromPalette(draggedElement);
				}
				// Add it to conatiner
				mixedElementsArr.push(draggedElement);

				// If this element's name is Antemanium and it is the only element in the container...
				if (mixedElementsArr.length === 1 && mixedElementsArr[0].name === 'Antemanium') {
					// Set all properties to neutral.
					var antemanium = mixedElementsArr[0];
					antemanium.elasticity = 0;
					antemanium.solidity = 0;
					antemanium.texture = 0;
					antemanium.temperature = 0;
					antemanium.setAllPropertiesArr();
				}
				// Stir elements
				elementManager.stirElements();
				// Calculate value of the mixed element
				progressionManager.calcValue();
				// Play the sound of the dragged element
				sound = draggedElement.sound;
			}
			// If dragged element is NOT in the container...
			else {
				// Create a new sound and play it
				var soundSrc = jsfxr([3,,0.0818,0.05,0.0981,0.63,,-0.6905,,,,,,,,,,,1,,,0.1499,,0.5]);
				sound.src = soundSrc;
			}
		}
		// If the dragged element is a helper element...
		else if (draggedElement.isHelper) {
			// If there is already something in the container and helper element is touching the container...
			if (mixedElementsArr.length > 0 && container.hitTest(draggedElement.x, draggedElement.y)) {
				// Mix the helper element in and play its sound
				elementManager.mixHelper(draggedElement);
				sound = draggedElement.sound;
				progressionManager.calcValue();

			}
			// Otherwise, move it back to its original position
			else {
				draggedElement.x = draggedElement.parentX;
				draggedElement.y = draggedElement.parentY;
				var soundSrc = jsfxr([3,,0.0818,0.05,0.0981,0.63,,-0.6905,,,,,,,,,,,1,,,0.1499,,0.5]);
				sound.src = soundSrc;
			}
		}
		// If the element is from the mixing flask itself...
		else {
			// If it has been dragged tothe mixing palette...
			var inMixingPalette = mixingPalette.hitTest(draggedElement.x, draggedElement.y);
			// Add it to the palette and play its sound
			if (inMixingPalette) {
				mixingPaletteElementsArr.push(draggedElement);
				if (draggedElement === mixedElementsArr[0]) {
					container.mix();
					// container.empty();

				}
				// sound = draggedElement.sound;
			}	
			else {
				var soundSrc = jsfxr([3,,0.0818,0.05,0.0981,0.63,,-0.6905,,,,,,,,,,,1,,,0.1499,,0.5]);
				sound.src = soundSrc;
			}			
		}

		sound.play();
		draggedElement = null;
	}
};

function onMouseMove(event) {
	// If we are in the main game...
	if (gameMode === 'main') {
		var boundingRect = canvas.getBoundingClientRect();
		mouseX = (event.clientX - boundingRect.left)*(canvas.width/boundingRect.width);
		mouseY = (event.clientY - boundingRect.top)*(canvas.height/boundingRect.height);

		// If an element is being dragged
		if (dragging) {
			var posX;
			var posY;
			var shapeRad = draggedElement.width;
			var minX = shapeRad;
			var maxX = canvas.width - shapeRad;
			var minY = shapeRad;
			var maxY = canvas.height - shapeRad;
			
			posX = mouseX - dragHoldX;
			posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
			posY = mouseY - dragHoldY;
			posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);
			
			targetX = posX;
			targetY = posY;
		} 
		// If an element is not being dragged
		else {
			var hoveredOverSomething = false;
			// If user hasn't hovered over anything yet
			if (!hoveredOverSomething) {
				// Loop through all base elements and see if anything is hovered
				for (i=0; i < baseElementsArr.length; i++) {
					if (baseElementsArr[i].hitTest(mouseX, mouseY)) {	
						if (!baseElementsArr[i].isHovered) {
							baseElementsArr[i].isHovered = true;
							hoveredOverSomething = true;
						}
					}
					else {
						if (baseElementsArr[i].isHovered) {
							baseElementsArr[i].isHovered = false;
							if (hoveredOverSomething) {
								hoveredOverSomething = false;
							}
						}
					}
				}
				// Loop through all mixing palette elements and see if anything is hovered
				for (i=0; i < mixingPaletteElementsArr.length; i++) {
					if (mixingPaletteElementsArr[i].hitTest(mouseX, mouseY)) {	
						if (!mixingPaletteElementsArr[i].isHovered) {
							mixingPaletteElementsArr[i].isHovered = true;
							hoveredOverSomething = true;
						}
					}
					else {
						if (mixingPaletteElementsArr[i].isHovered) {
							mixingPaletteElementsArr[i].isHovered = false;
							if (hoveredOverSomething) {
								hoveredOverSomething = false;
							}
						}
					}
				}

				// Loop through all helper elements and see if anything is hovered
				for (i=0; i < helperElementsArr.length; i++) {
					if (helperElementsArr[i].hitTest(mouseX, mouseY)) {	
						if (!helperElementsArr[i].isHovered) {
							helperElementsArr[i].isHovered = true;
							hoveredOverSomething = true;
						}
					}
					else {
						if (helperElementsArr[i].isHovered) {
							helperElementsArr[i].isHovered = false;
							if (hoveredOverSomething) {
								hoveredOverSomething = false;
							}
						}
					}
				}		
			}
		}
	}
};
		