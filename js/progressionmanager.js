function ProgressionManager() {
	this.difficulty = 1;
	// Array of grades, from worst to best.
	this.gradesArr = ['F','E','D','C','B','A'];
	this.currentGrade = 'A';
	this.cooksCompleted = 0;
	this.allCookResultsArr = [];
	// Player has as many lives as there are grades
	this.lives = 6;
	this.cookValue = 0;
	this.requiredPropertiesArr = [];
	this.taskStr;

	// Reset everything to the start
	this.resetProgression = function() {
		this.difficulty = 1;
		this.maxDifficulty = 3;
		this.requiredPropertiesArr.length = 0;
		this.taskStr = null;
		this.currentGrade = 'A';
		this.lives = 6;
		this.allCookResultsArr.length = 0;
		this.cooksCompleted = 0;
	};

	// Start progression by assigning a task
	this.startProgression = function() {
		this.assignTask();
	};

	// Task assignment
	this.assignTask = function() {
		// Make an array of potential requirements
		var potentialRequirements = [
			'elasticity',
			'texture',
			'temperature',
			'solidity'
		];
		// make an array of required properties for this task
		this.requiredPropertiesArr = [];

		// Init dummy task string
		this.taskStr = 'Something';

		// Loop through difficulty count, so there is one property to match for each level of difficulty (but only up to 3)
		for (var i = 0; i < this.difficulty; i++) {
			// The index of the property we assign is random 
			var propertyIndex = utility.randomFromTo(0, potentialRequirements.length - 1);
			// Get name and random value of property.
			var name = potentialRequirements[propertyIndex];
			var value = utility.randomFromTo(-1,1);

			// Get property description
			var description = elementManager.getPropertyDescription(name, value);
			// Create property element to push to the requirements array
			var property = {
				name: name,
				value: value,
				description: description,
				fulfilled: false
			}
			// Remove this property from the potential requirements array, as we don't want it to be chosen twice for the same task
			potentialRequirements = utility.removeFromArray(name, potentialRequirements);
			this.requiredPropertiesArr.push(property);
			// Add property description to task string
			this.taskStr += ' ' + property.description;
			// Add AND to the end if this is not the last required property
			if (this.requiredPropertiesArr.length < this.difficulty) {
				this.taskStr += ' AND';
			}
		}
	};

	// Calculate formula value
	this.calcValue = function() {
		var maxValue = 100 * this.difficulty;
		// Value allows for one element to stay at max
		var value = maxValue - (mixedElementsArr[0].formula.length - 1) * 10;
		// Loop through every formula part (including first)...
		for (var i = 0; i < mixedElementsArr[0].formula.length - 1; i++) {
			var part = mixedElementsArr[0].formula[i];
			// If there is more than one of that element, subtract 5
			if (part.count > 1) {
				value -= 5;
			}
		}

		// Take an additional $5 off for every helper
		for (var i = 0; i < 8 - helperElementsArr.length; i++) {
			value -= 5;
		}
		// If value is < 0, make it 0
		if (value < 0) {
			value = 0;
		}

		this.cookValue = value;
	};

	// Tesk if a task was successfully completed
	this.testTask = function() { 
		if (!container.flushing && mixedElementsArr.length > 0) {
			var formula = container.formula;
			var fulfilled = 0;
			var sound = new Audio();
			for (var i = 0; i < this.requiredPropertiesArr.length; i++) {
				var requiredProperty = this.requiredPropertiesArr[i];
				for (var n = 0; n < mixedElementsArr.length; n++) {
					var elementProperties = mixedElementsArr[n].allPropertiesArr;
					for (var z = 0; z < elementProperties.length; z++) {
						property = elementProperties[z];
						if (property.name === requiredProperty.name) {
							if (property.description === requiredProperty.description) {
								fulfilled++;
							}
						}
					}
				}
			}
			if (fulfilled === this.requiredPropertiesArr.length) {
				if (this.difficulty < this.maxDifficulty && this.cooksCompleted % 2 === 0) {
					this.difficulty++;
				}
				var soundSrc = jsfxr([2,0.06,0.53,0.84,0.14,0.56,,,,,,0.5599,0.49,,,,,,1,,,,,0.5]);
				sound.src = soundSrc;
			}
			else {
				this.lives--;
				this.cookValue = 0;
				var soundSrc = jsfxr([2,0.06,0.53,0.84,0.14,0.56,,,,,,-0.2199,0.49,,,,,,1,,,,,0.5]);
				sound.src = soundSrc;
			}
			sound.play();
			this.cooksCompleted++;
			this.currentGrade = this.gradesArr[this.lives - 1];
			this.allCookResultsArr.push({formula: formula, value: this.cookValue});
			elementManager.restockHelperElements();
			container.formulaArr.length = 0;
			if (this.cooksCompleted === 10 || this.currentGrade === 'F') {
				loadMode('finish');
			}
			this.assignTask();
			container.flush();
		}
		else {
			var sound = new Audio();
			soundSrc = jsfxr([3,,0.0818,0.05,0.0981,0.63,,-0.6905,,,,,,,,,,,1,,,0.1499,,0.5]);
			sound.src = soundSrc;
			sound.play();
		}

	};

	this.drawTask = function() {
		var x = 45;
		var y = 100;
		this.drawTaskLabel(x, y);
		this.drawTaskText(x + 10, y);

	};

	this.drawTaskLabel = function(x, y) {
		var width = canvas.width - 347;
		var height = 35;
		ctx.save();
		ctx.fillStyle = '#c6c9b1';
		ctx.strokeStyle = ''
		ctx.fillRect(x, 0 + y - height / 2, width, height);
		ctx.restore();

		// Draw blue at top
		var barHeight = 35;
		ctx.font = fontTaskHeading;
		ctx.fillStyle = '#c6c9b1';
		ctx.textAlign = 'left';
		ctx.fillText('Cook:', x + 10, y - height / 2 - 27);		

		// Draw window outline
		drawWindowStroke(x, y - height / 2 - barHeight + 2, width, height + barHeight);	
	};

	this.drawTaskText = function(x,y) {
		ctx.save();
		ctx.textAlign = 'left';
		ctx.textBaseline = 'middle';
		ctx.fillStyle = '#000';
		ctx.font = fontTask;
		ctx.fillText(this.taskStr, x, y);
	};

	this.drawResults = function(x, y) {
		this.drawResultsWindow();
	};

	this.drawResultsWindow = function() {
		ctx.save();

		var width = 155;
		var height = canvas.height - 75 - 15;
		var x = canvas.width - 150 - 20;
		var y = 75;
		ctx.fillStyle = '#c6c9b1';
		ctx.fillRect(x, y + 35, width, height - 35);

		var barHeight = 35;

		// Draw window outline
		drawWindowStroke(x + 3, y + 3, width, height)


		// Draw results font

		ctx.font = fontSmallWindowHeading;
		ctx.fillStyle = '#c6c9b1';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillText('Performance Review', x + 10, y + 10);		
		y += fontSmallHeadingInterval * 2.5;

		ctx.font = fontRegular;
		ctx.fillStyle = '#000';
		ctx.fillText('Grade:', x + 10, y + 10);
		y += fontRegularInterval;


		// Draw grade
		ctx.fillStyle = '#ff0000';
		ctx.textAlign = 'center';
		ctx.font = fontGrade;
		ctx.fillText(this.currentGrade, x + width / 2, y + 10);

		y += fontGradeInterval + 30;

		ctx.font = fontRegular;
		ctx.fillStyle = '#000';

		ctx.fillText('Cooks completed:', x + width / 2, y);
		y += fontRegularInterval;

		// Draw grade
		ctx.textAlign = 'center';
		ctx.font = fontSmallHeading;
		ctx.fillText(this.cooksCompleted + '/10', x + width / 2, y + 10);	

		y += fontSmallHeadingInterval + 30;

		ctx.font = fontRegular;
		ctx.fillStyle = '#000';
		ctx.fillText('This Cook Value:', x + width / 2, y);
		y += fontRegularInterval;

		// Draw grade
		ctx.textAlign = 'center';
		ctx.font = fontSmallHeading;
		ctx.fillText('$' + this.cookValue, x + width / 2, y + 10);	
		ctx.restore();
	};
};