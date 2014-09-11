/* 
Elasticity: 
	1 - elastic
	2 - firm
	3 - rigid

Texture:
	1 - rough
	2 - semi-smooth
	3 - smooth

Temperature:
	1 - cold
	2 - warm
	3 - hot

Solidity:
	1 - liquid
	2 - gel
	3 - solid
*/

function Element() {

	// Init main variables
	this.name;
	this.elasticity;
	this.texture;
	this.temperature;
	this.solidity;
	this.allPropertiesArr = [];
	this.x;
	this.y;
	this.width = 50;
	this.height = 50;
	this.velX = 0;
	this.velY = 0;
	this.accelX = 0;
	this.accelY = 0;
	this.isHovered = false;
	this.formula;
	this.sound;

	this.color ='rgb(0,0,0)';

	this.hitTest = function(hitX,hitY) {
		if (hitX > this.x && hitX < this.x + this.width && hitY > this.y && hitY < this.y + this.height) {
			return true;
		}
		return false;
	};

	this.draw = function() {
		ctx.save();
		ctx.fillStyle = 'rgb(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ')';
		ctx.fillRect(this.x, this.y, this.width, this.height);

		// Draw element symbol
		ctx.fillStyle = '#c6c9b1';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		// Element symbol consists of first two characters of element name
		var symbol = this.name.match(/.{1,2}/g)[0];
		ctx.font = fontSmallHeading;
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 3;
		ctx.strokeText(symbol, this.x + this.width / 2 , this.y + this.height / 2);
		ctx.fillText(symbol, this.x + this.width / 2 , this.y + this.height / 2);

		ctx.restore();
		if (this.isHovered) {
			this.drawInformation();
		}
	};

	this.setAllPropertiesArr = function() {
		// Create an array of all properties for this element
		this.allPropertiesArr = [
			{
				name: 'elasticity', 
				value: this.elasticity,
				description: elementManager.getPropertyDescription('elasticity', this.elasticity)
			},
			{
				name: 'texture', 
				value: this.texture,
				description: elementManager.getPropertyDescription('texture', this.texture)
			},
			{
				name: 'temperature', 
				value: this.temperature,
				description: elementManager.getPropertyDescription('temperature', this.temperature)
			},
			{
				name: 'solidity', 
				value: this.solidity,
				description: elementManager.getPropertyDescription('solidity', this.solidity)
			}		
		];
	};

	this.drawInformation = function() {
		var inMixingPalette = mixingPalette.hitTest(this.x, this.y);
		var x; 
		var y;
		if (!inMixingPalette) {
			x = this.x + this.width + 5;
			y = this.y;
			ctx.textAlign = "left";
		}
		else {
			x = mixingPalette.x - 5;
			y = this.y;
			ctx.textAlign = "right";
		}
		ctx.save();
		ctx.textBaseline = 'middle';
		ctx.font = fontTiny;
		ctx.fillStyle = 'rgb(' + this.color.r + ',' + this.color.g + ',' + this.color.b +')';
		ctx.fillText(this.name, x, y);
		y += 13;
		ctx.fillStyle = '#ccc';
		for (var i = 0; i < this.allPropertiesArr.length; i++) {
			var property = this.allPropertiesArr[i];
			var description;
			if (this.name !== 'Antemanium') {
				description = property.description;
			}
			else {
				description = 'N/A';
			}
			ctx.fillText(property.name + ': ' + description, x, y);
			y += 13;
		}

		ctx.restore();
	};
};

function Helper() {

	// Init main variables
	this.radius = 25;
	this.color;
	this.name;
	this.property;
	this.x;
	this.y;
	this.parentX;
	this.parentY;
	this.allPropertiesArr;
	this.sound;

	this.hitTest = function(hitX,hitY) {
		var dx = this.x - hitX;
		var dy = this.y - hitY;		
		return(dx*dx + dy*dy < this.radius*this.radius);
	};

	this.draw = function() {
		ctx.save();
		ctx.fillStyle = 'rgb(' + this.color.r + ',' + this.color.g + ',' + this.color.b +')';
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = 'rgba(0,0,0,0.3)';
		var symbol = this.name.match(/.{1,2}/g)[0];
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		ctx.font = fontSmallHeading;
		ctx.fillText(symbol, this.x, this.y);
		ctx.restore();
		if (this.isHovered) {
			this.drawInformation();
		}
	};

	this.drawInformation = function() {
		var x = 622;
		var y = canvas.height - 250;
		ctx.save();
		ctx.textAlign = "right";
		ctx.textBaseline = 'middle';
		ctx.font = fontTiny;
		ctx.fillStyle = '#c6c9b1';
		ctx.fillText(this.name, x, y);
		ctx.restore();
	};
};

// Main element manager
function ElementManager() {

	// Create the helpers
	this.createHelperElements = function() {
		var helperCount = 2;
		var x = 565;
		var y = canvas.height - 105;
		var radius = 15;
		for (var i = 0; i < helperCount; i++) {
			this.createHelper('Liquifier', x, y, radius);
			x += radius * 2 + 3;
		}

		x = 565;
		y -= 35;
		for (var i = 0; i < helperCount; i++) {
			this.createHelper('Cooler', x, y, radius);
			x += radius * 2 + 3;
		}

		x = 565;
		y -= 35;
		for (var i = 0; i < helperCount; i++) {
			this.createHelper('Smoother', x, y, radius);
			x += radius * 2 + 3;
		}
		x = 565;
		y -= 35;
		for (var i = 0; i < helperCount; i++) {
			this.createHelper('Elasticizer', x, y, radius);
			x += radius * 2 + 3;
		}		
	};
	
	this.createHelper = function(name, x, y, radius) {
		switch (name) {
			case 'Liquifier':
				var helper = new Helper();
				helper.name = 'Liquifier';
				helper.radius = radius;
				helper.formula = [{count: 1, symbol: 'Li'}];
				helper.property = {name: 'solidity', value: -0.25};
				helper.isHelper = true;
				helper.color = {
					r: 122,
					g: 122,
					b: 122
				};
				helper.x = x + radius;
				helper.y = y - radius;
				helper.parentX = x + radius;
				helper.parentY = y - radius;

				helperElementsArr.push(helper);
				break;
			case 'Cooler':
				var helper = new Helper();
				helper.name = 'Cooler';
				helper.radius = radius;
				helper.formula = [{count: 1, symbol: 'Co'}];
				helper.property = {name: 'temperature', value: -0.25};
				helper.isHelper = true;
				helper.color = {
					r: 145,
					g: 145,
					b: 145
				};
				helper.x = x + radius;
				helper.y = y - radius;
				helper.parentX = x + radius;
				helper.parentY = y - radius;

				helperElementsArr.push(helper);
				break;		
			case 'Smoother':
				var helper = new Helper();
				helper.name = 'Smoother';
				helper.radius = radius;
				helper.formula = [{count: 1, symbol: 'Sm'}];
				helper.property = {name: 'texture', value: -0.25};
				helper.isHelper = true;
				helper.color = {
					r: 189,
					g: 189,
					b: 189
				};
				helper.x = x + radius;
				helper.y = y - radius;
				helper.parentX = x + radius;
				helper.parentY = y - radius;

				helperElementsArr.push(helper);
				break;				
			case 'Elasticizer':
				var helper = new Helper();
				helper.name = 'Elasticizer';
				helper.radius = radius;
				helper.formula = [{count: 1, symbol: 'El'}];
				helper.property = {name: 'elasticity', value: -0.25};
				helper.isHelper = true;
				helper.color = {
					r: 219,
					g: 219,
					b: 219
				};
				helper.x = x + radius;
				helper.y = y - radius;
				helper.parentX = x + radius;
				helper.parentY = y - radius;
				helperElementsArr.push(helper);
				break;
			
		}
		var soundSrc = jsfxr([2,0.02,0.11,0.35,0.32,0.91,,-0.02,,0.04,0.14,-0.88,0.63,,-0.56,,-0.28,0.06,1,,,,,0.5]);
		helper.sound = new Audio();
		helper.sound.src = soundSrc;
	};

	// Restock all the helper elements
	this.restockHelperElements = function() {
		// There should be 2 of each element
		var reqHelpers = 2;

		// Get all liquifiers
		var liquifierHelperArr = this.getHelpers('Liquifier');
		// Subtract # of liquifiers from required helpers
		var helpersNeeded = reqHelpers - liquifierHelperArr.length;
		var radius = 15;
		// For each helper needed, spawn a new liquifier
		for (var i = 0; i < helpersNeeded; i++) {
			var y = canvas.height - 105;
			this.createHelper('Liquifier', 0, 0, radius);
		}

		// Again, get all the liquifiers (including newly spawned ones)
		liquifierHelperArr = this.getHelpers('Liquifier');

		// Draw each liquifier
		var x = 580;
		var y = canvas.height - 120;
		for (var i = 0; i < liquifierHelperArr.length; i++) {
			var helper = liquifierHelperArr[i];
			helper.x = x;
			helper.y = y;
			helper.parentX = x; 
			helper.parentY = y;
			x += radius * 2 + 3;
		}

		// Continue to do the same for the other helpers
		var coolerHelperArr = this.getHelpers('Cooler');
		helpersNeeded = reqHelpers - coolerHelperArr.length;
		for (var i = 0; i < helpersNeeded; i++) {
			this.createHelper('Cooler', 0, 0, radius);
		}	
		coolerHelperArr = this.getHelpers('Cooler');		
		x = 580;
		y -= 35;
		for (var i = 0; i < coolerHelperArr.length; i++) {
			var helper = coolerHelperArr[i];
			helper.x = x;
			helper.y = y;
			helper.parentX = x; 
			helper.parentY = y;
			x += radius * 2 + 3;
		}
		
		var smootherHelperArr = this.getHelpers('Smoother');
		helpersNeeded = reqHelpers - smootherHelperArr.length;
		for (var i = 0; i < helpersNeeded; i++) {
			this.createHelper('Smoother', 0, 0, radius);
		}	

		smootherHelperArr = this.getHelpers('Smoother');		
		x = 580;
		y -= 35;
		for (var i = 0; i < smootherHelperArr.length; i++) {
			var helper = smootherHelperArr[i];
			helper.x = x;
			helper.y = y;
			helper.parentX = x; 
			helper.parentY = y;
			x += radius * 2 + 3;
		}	

		var elasticizerHelperArr = this.getHelpers('Elasticizer');
		helpersNeeded = reqHelpers - elasticizerHelperArr.length;
		for (var i = 0; i < helpersNeeded; i++) {
			this.createHelper('Elasticizer', 0, 0, radius);
		}	

		elasticizerHelperArr = this.getHelpers('Elasticizer');		
		x = 580;
		y -= 35;
		for (var i = 0; i < elasticizerHelperArr.length; i++) {
			var helper = elasticizerHelperArr[i];
			helper.x = x;
			helper.y = y;
			helper.parentX = x; 
			helper.parentY = y;
			x += radius * 2 + 3;
		}		
	};

	this.mixHelper = function(helper) {
		// If this is NOT the first element being placed in the container...
	//	if (mixedElementsArr.length === 2) {
			// Calculate the new formula
			var formula = container.calcFormula(mixedElementsArr[0], helper);
			// Combine the elements
			var combinedElement = this.combineElements(mixedElementsArr[0], helper);
			// Empty the container
		//	container.empty();
			// Assign formula to combined element
			combinedElement.formula = formula;
			// Push combined element to container
		//	mixedElementsArr.push(combinedElement);
	//	}
		// Calculate formula string
		container.calcFormulaStr();

		// Mix helper elements

		// Loop through all properties of the mixed element in the container
		for (var i = 0; i < mixedElementsArr[0].allPropertiesArr.length; i++) {
			var property = mixedElementsArr[0].allPropertiesArr[i];
			// If the property name matches the property name of the helper...
			if (helper.property.name === property.name) {
				// Add helper's value for that property to existing property value
				mixedElementsArr[0][helper.property.name] += helper.property.value;

				// If it ends up > 1, set to 1. If it ends up < 0, set to 0.
				if (mixedElementsArr[0][helper.property.name] > 1) {
					mixedElementsArr[0][helper.property.name] = 1;
				}
				else if (mixedElementsArr[0][helper.property.name] < -1) {
					mixedElementsArr[0][helper.property.name] = -1;
				}

				// Set the properties
				mixedElementsArr[0].setAllPropertiesArr();
			}
		}
		// Remove this helper from the array of helpers as it is used up
		helperElementsArr = utility.removeFromArray(helper, helperElementsArr);
	};

	// Get all helpers of a certain name
	this.getHelpers = function(name) {
		// Init array of specified helpers
		var helperArr = [];
		// Loop through array of all existing helpers
		for (var i = 0; i < helperElementsArr.length; i++) {
			// If helper name matches the specified name, add it to array
			if (helperElementsArr[i].name === name) {
				helperArr.push(helperElementsArr[i]);
			}
		}
		return helperArr;
	};

	this.createBaseElements = function() {

		// Create Toughinium
		var element = new Element();
		element.name = 'Toughinium';
		element.formula = [{count: 1, symbol: 'To'}];
		element.elasticity = 1;
		element.texture = 0;
		element.temperature = 0;
		element.solidity = 0;
		var soundSrc = jsfxr([2,0.02,0.11,0.35,0.32,0.77,,,,,,-0.4,0.63,,-0.56,,,,1,,,,,0.5]); 
		element.sound = new Audio();
		element.sound.src = soundSrc;
		element.color = {
			r: 85,
			g: 0,
			b: 196
		}
		baseElementsArr.push(element);

		// Create Roghitinam
		element = new Element();
		element.name = 'Roghitinam';
		element.formula = [{count: 1, symbol: 'Ro'}];
		element.elasticity = 0;
		element.texture = 1;
		element.temperature = 0;
		element.solidity = 0;
		element.color = {
			r: 91,
			g: 209,
			b: 232
		}	

		baseElementsArr.push(element);

		// Create Heatonium
		element = new Element();
		element.name = 'Heatoinium';
		element.formula = [{count: 1, symbol: 'He'}];
		element.elasticity = 0;
		element.texture = 0;
		element.temperature = 1;
		element.solidity = 0;
		element.color = {
			r: 232,
			g: 0,
			b: 43
		}	

		baseElementsArr.push(element);

		// Create Solidantium
		element = new Element();
		element.name = 'Solidantium';
		element.formula = [{count: 1, symbol: 'So'}];
		element.elasticity = 0;
		element.texture = 0;
		element.temperature = 0;
		element.solidity = 1;
		element.color = {
			r: 227,
			g: 16,
			b: 235
		}	

		baseElementsArr.push(element);

		// Create Antemanium
		element = new Element();
		element.name = 'Antemanium';
		element.formula = [{count: 1, symbol: 'An'}];
		element.color = {
			r: 115,
			g: 222,
			b: 0
		}
		baseElementsArr.push(element);

		// Position the elements depending on game mode

		// If main, they are positioned vertically along left side of canvas
		if (gameMode === 'main') {
			var x = 25;
			var y = (canvas.height / 2) - ((25 * 5) + (40 * 4)) / 2;
			var size = 25;
			var margin = 40;
		}

		// Otherwise (meaning in menu) they are positioned horizontally with instructions
		else {
			var x = 10;
			var y = 300;
			var size = 25;
			var margin = 40;
		}

		// Loop through all the elements and position based on the above
		for (var i = 0; i < baseElementsArr.length; i++) {
			element = baseElementsArr[i];
			element.x = x;
			element.y = y;

			if (gameMode === 'main') {
				y += size + margin;
				element.setAllPropertiesArr();
			}
			else {
				x += size + margin;
			}
		}
	};

	// Spawn a new element of a certain name
	this.spawnNewElement = function(name) {
		var element = new Element();
		switch (name) {
			case 'Toughinium':
				element.name = 'Toughinium';
				element.formula = [{count: 1, symbol: 'To'}];
				element.elasticity = 1;
				element.texture = 0;
				element.temperature = 0;
				element.solidity = 0;
				var soundSrc = jsfxr([2,0.02,0.11,0.35,0.32,0.52,,0.1599,,0.04,0.14,0.4599,0.63,,-0.56,,-0.28,0.06,1,,,,,0.5]); 
				element.sound = new Audio();
				element.sound.src = soundSrc;
				element.color = {
					r: 85,
					g: 0,
					b: 196
				}

				break;
			case 'Roghitinam':
				element.name = 'Roghitinam';
				element.formula = [{count: 1, symbol: 'Ro'}];
				element.elasticity = 0;
				element.texture = 1;
				element.temperature = 0;
				element.solidity = 0;
				var soundSrc = jsfxr([2,0.02,0.11,0.35,0.32,0.48,,0.1599,,0.04,0.14,-0.26,0.63,,-0.56,,-0.28,0.06,1,,,,,0.5]);
				element.sound = new Audio();
				element.sound.src = soundSrc;
				element.color = {
					r: 91,
					g: 209,
					b: 232
				}
				break;	
			case 'Heatoinium':
				element.name = 'Heatoinium';
				element.formula = [{count: 1, symbol: 'He'}];
				element.elasticity = 0;
				element.texture = 0;
				element.temperature = 1;
				element.solidity = 0;
				var soundSrc = jsfxr([2,0.02,0.11,0.35,0.32,0.72,,0.1599,,0.04,0.14,-0.3199,0.63,,-0.56,,-0.28,0.48,1,,,,,0.5]);
				element.sound = new Audio();
				element.sound.src = soundSrc;				
				element.color = {
					r: 232,
					g: 0,
					b: 43
				}			
				break;	
			case 'Solidantium':
				element.name = 'Solidantium';
				element.formula = [{count: 1, symbol: 'So'}];
				element.elasticity = 0;
				element.texture = 0;
				element.temperature = 0;
				element.solidity = 1;
				var soundSrc = jsfxr([2,0.02,0.11,0.35,0.32,0.44,,0.1599,,0.04,0.14,0.4399,0.63,,-0.56,,-0.28,0.06,1,,,,,0.5]);
				element.sound = new Audio();
				element.sound.src = soundSrc;				
				element.color = {
					r: 227,
					g: 16,
					b: 235
				}			
				break;	
			case 'Antemanium':
				element.name = 'Antemanium';
				element.formula = [{count: 1, symbol: 'An'}];
				element.elasticity = -1;
				element.texture = -1;
				element.temperature = -1;
				element.solidity = -1;
				var soundSrc = jsfxr([2,0.02,0.11,0.35,0.32,0.29,,0.1599,,0.04,0.14,0.4399,0.63,,-0.56,,-0.28,0.06,1,,,,,0.5]);
				element.sound = new Audio();
				element.sound.src = soundSrc;				
				element.color = {
					r: 115,
					g: 222,
					b: 0
				}			
				break;	

		};

		// Create array of properties for element
		element.allPropertiesArr = [
			{
				name: 'elasticity', 
				value: element.elasticity,
				description: this.getPropertyDescription('elasticity', element.elasticity)
			},
			{
				name: 'texture', 
				value: element.texture,
				description: this.getPropertyDescription('texture', element.texture)
			},
			{
				name: 'temperature', 
				value: element.temperature,
				description: this.getPropertyDescription('temperature', element.temperature)
			},
			{
				name: 'solidity', 
				value: element.solidity,
				description: this.getPropertyDescription('solidity', element.solidity)
			}		

		];

		return element;
	};

	// Stir the elements
	this.stirElements = function() {
		container.volume = 100;
		container.flushing = false;
		// If this is NOT the first element being placed in the container...
		if (mixedElementsArr.length === 2) {
			// Calculate the new formula
			var formula = container.calcFormula(mixedElementsArr[0], mixedElementsArr[1]);
			// Combine the elements
			var combinedElement = this.combineElements(mixedElementsArr[0], mixedElementsArr[1]);
			// Empty the container
			container.empty();
			// Assign formula to combined element
			combinedElement.formula = formula;
			// Push combined element to container
			mixedElementsArr.push(combinedElement);
		}
		// Calculate formula string
		container.calcFormulaStr();
		initBubbles();
	};

	// Combine two elements
	this.combineElements = function(element1, element2) {
		var name1 = element1.name
		var name2 = element2.name;

		// Get first 3 chars of first element name
		var namePart1 = name1.match(/.{1,3}/g)[0];
		// Split 2nd element name into sets of 3 chars
		var name2Split = name2.match(/.{1,3}/g);
		var namePart2 = "";
		// Loop through all sets of 3 chars except the first from second element name & create second part of name
		for (var i = 1; i < name2Split.length; i++) {
			var string = name2Split[i];
			namePart2 += string;
		}
		var name = namePart1 + namePart2;
	
		// Create new element
		var combinedElement = new Element();
		combinedElement.name = name;

		// Set all the properties for the new element
		if (element1.name !== 'Antemanium' && element2.name !== 'Antemanium') {
			combinedElement.elasticity = (element1.elasticity + element2.elasticity) / 2;
			combinedElement.texture = (element1.texture + element2.texture) / 2;
			combinedElement.temperature = (element1.temperature + element2.temperature) / 2;
			combinedElement.solidity = (element1.solidity + element2.solidity) / 2;
		}
		else {
			combinedElement.elasticity = (element1.elasticity * element2.elasticity);
			combinedElement.texture = (element1.texture * element2.texture);
			combinedElement.temperature = (element1.temperature * element2.temperature);
			combinedElement.solidity = (element1.solidity * element2.solidity);
		}

		combinedElement.setAllPropertiesArr();
		
		// Combine colors of the two combined elements into a new color
		var newColor = {
			r: Math.round(0.5 * element1.color.r + 0.5 * element2.color.r),
			g: Math.round(0.5 * element1.color.g + 0.5 * element2.color.g),
			b: Math.round(0.5 * element1.color.b + 0.5 * element2.color.b)
		};

		// Assign new color to combined element
		combinedElement.color = newColor;
		combinedElement.sound = element1.sound;

		return combinedElement;
	};

	// Assign descriptions to each property value
	this.getPropertyDescription = function(propertyName, value) {
		switch (propertyName) {
			case 'elasticity':
				switch (true) {
					case value >= 0.5:
						return 'Rigid';
					case value > -0.5: 
						return 'Firm';
					default:
						return 'Elastic';
				}
				break;
			case 'texture':
				switch (true) {
					case value >= 0.5:
						return 'Rough';
					case value > -0.5: 
						return 'Semi-rough';
					default:
						return 'Smooth';
				}
				break;		
			case 'temperature':
				switch (true) {
					case value >= 0.5:
						return 'Hot';
					case value > -0.5:
						return 'Warm';
					default:
						return 'Cold';
				}
				break;
			case 'solidity':
				switch (true) {
					case value >= 0.5:
						return 'Solid';
					case value > -0.5:
						return 'Gel';
					default:
						return 'Liquid';
				}
				break;
		}
	} 
};

// These are just for visual effect - other than that they do nothing.
function Bubble() {
	this.x = container.x;
	this.y = container.y;
	this.parentX = this.x;
	this.parentY = this.y;
	this.radius;
	this.color;
	this.floatSpeedX;
	this.floatSpeedY;
	this.alpha = 1;
	
	this.init = function() {
		this.floatSpeedX = utility.randomFromTo(-10,10);
		this.floatSpeedX = this.floatSpeedX / 25;
		this.floatSpeedY = utility.randomFromTo(5,10) / 25;
		this.radius = utility.randomFromTo(5,15);
		this.y = container.y - container.radius + this.radius;
		this.parentY = this.y;
	}

	this.setColor = function() {
		var mixedElement = mixedElementsArr[0];
		this.color = mixedElement.color;
	}

	
	this.draw = function() {
		if (this.alpha <= 0.01) {
			utility.removeFromArray(this, bubblesArr);
		}
		else {
			if (this.color) {
				if (!container.flushing) {
					if (this.x < container.x - container.radius / 2 ||
						this.x > container.x + container.radius / 2) {
						this.alpha -= 0.03;
						
					}
					if (this.y < container.y - container.height) {
						this.alpha -= 0.03;
						
					}
				}
					
				
				this.x += this.floatSpeedX;
				this.y -= this.floatSpeedY;
				ctx.fillStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + this.alpha + ')';
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
				ctx.closePath();
				ctx.fill();
			}
		}
		
	}

};