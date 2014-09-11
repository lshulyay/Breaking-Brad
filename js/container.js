// The mixing palette is a kind of container, so we keep it in the container file alongside the main container.
function MixingPalette() {
	this.width = 65;
	this.height = 300;
	this.x = 635;
	this.y = 115;

	this.draw = function() {
		ctx.save();
		ctx.fillStyle = '#c6c9b1';
		ctx.fillRect(this.x, this.y, this.width, this.height);

		var width = this.width;
		var height = 35;
		var x = this.x;
		var y = this.y - height * 2.5;
		ctx.fillStyle = '#c6c9b1';
		ctx.fillRect(x, y, width, height - 35);
		
		ctx.font = fontSmallWindowHeading;
		ctx.fillStyle = '#c6c9b1';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'middle';
		ctx.fillText('Palette', x + 5, y + height * 2);		
		y += fontSmallHeadingInterval * 2.5;

		// Draw window outline
		drawWindowStroke(x + 3, y + 3, this.width, this.height + height);
		ctx.restore();

	}

	this.removeFromPalette = function(element) {
		mixingPaletteElementsArr = utility.removeFromArray(element, mixingPaletteElementsArr);
	}

	this.hitTest = function(hitX,hitY) {
		if (hitX > this.x && hitX < this.x + this.width && hitY > this.y && hitY < this.y + this.height) {
			return true;
		}
		return false;
	}
}

function Container() {
	this.width = 100;
	this.height = 250;
	this.radius = 50;
	this.volume = this.radius + 50;
	this.x = 280;
	this.y = canvas.height - this.height + this.radius * 2 + 30;
	this.formulaArr = [];
	this.formula = "";
	this.flushing = false;
	this.flushX = 0;
	this.flushY = 0;
	this.flushSpeed = 10;
	this.flushWidth = 15;
	this.flushHeight = 15;
	this.saving = false;
	this.saveX = 0;
	this.saveY = 0;
	this.saveSpeed = 10;
	this.saveWidth = 15;
	this.saveHeight = 15;

	this.hitTest = function(hitX,hitY) {
		// Make this a little wider than the top tube on purpose, to allow for some lenience when user is dragging onto container.
		var x = this.x - this.radius - 45;
		var y = this.y - this.height - this.radius;

		if (hitX > x && hitX < x + (this.radius + 45) * 2) {
			if (hitY > y && hitY < y + this.height + this.radius * 2) {
				return true;
			}
		}
		return false;
	};



	this.empty = function() {
		// Reset cook value
		progressionManager.cookValue = 0;

		// Reset formula
		this.formula = "";

		// Remove all elements
		mixedElementsArr.length = 0;

		
	};

	this.calcFormula = function(element1, element2) {
		var firstLoopArr;
		var secondLoopArr;

		// Loop through shorter formula first
		if (element1.formula.length < element2.formula.length) {
			firstLoopArr = element1.formula;
			secondLoopArr = element2.formula;
		}
		else {
			firstLoopArr = element2.formula;
			secondLoopArr = element1.formula;
		}
		// Loop through all formula parts in the shorter formula
		for (var i = 0; i < firstLoopArr.length; i++) {
			var loop1FormulaPart = firstLoopArr[i];

			// Loop through all formula parts in the longer formula
			 for (var n = 0; n < secondLoopArr.length; n++) {
				var loop2FormulaPart = secondLoopArr[n];

				// If symbol already exists...
				if (loop1FormulaPart.symbol === loop2FormulaPart.symbol) {
					// Simply add to the count of that part in the longer formula
					secondLoopArr[n] = {count: loop1FormulaPart.count + loop2FormulaPart.count, symbol: loop1FormulaPart.symbol};
					break;
				}
				// ELSE if this is the last part in the longer formula (no existing match has been found)
				else if (n === secondLoopArr.length - 1) {
					// Add a new part 
					var part = {count: 1, symbol: loop1FormulaPart.symbol};
					secondLoopArr.push(part);
					break;
				}
			}
		}
		return secondLoopArr;
	};

	this.flush = function() {
		// Play emptying sound
		var soundSrc = jsfxr([2,,0.0818,0.09,0.0981,0.85,,-0.5896,,,,0.24,,0.0491,-0.04,,-0.02,,0.89,,,0.0585,,0.5]);
		var sound = new Audio();
		sound.src = soundSrc;
		sound.play();

		/*this.volume--;
		var bubble = new Bubble();
		bubblesArr.push(bubble); */
		this.flushing = true;
		this.flushX = this.x;
		this.flushY = this.y - 100;
		this.flushWidth = 15;
		this.flushHeight = 15;
		this.flushColor = ctx.fillStyle = 'rgb(' + mixedElementsArr[0].color.r + ',' + mixedElementsArr[0].color.g + ',' + mixedElementsArr[0].color.b +')';
	}

	this.mix = function() {
		// Play emptying sound
		var sound = mixedElementsArr[0].sound;
		sound.play();

		this.saving = true;
		this.saveX = this.x;
		this.saveY = this.y - 155;
		this.saveWidth = 15;
		this.saveHeight = 15;
		this.saveColor = ctx.fillStyle = 'rgb(' + mixedElementsArr[0].color.r + ',' + mixedElementsArr[0].color.g + ',' + mixedElementsArr[0].color.b +')';

	}

	// Calculate formula string to display
	this.calcFormulaStr = function() {
		// Start off with a blank string
		var formulaStr = "";
		// Loop through each formula part in the currently mixed element
		for (var i = 0; i < mixedElementsArr[0].formula.length; i++) {
			var part = mixedElementsArr[0].formula[i];
			// If count is > 1, display it. Otherwise just display the symbol
			if (part.count > 1) {
				formulaStr += part.count;
			}
			formulaStr += part.symbol;
		}

		
		this.formula = formulaStr;
	};

	this.draw = function() {
		ctx.fillStyle = '#ccc';
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius * 2, 0,  Math.PI, false);
		ctx.stroke();
		ctx.closePath();
		ctx.beginPath();
		ctx.fillRect(this.x - this.radius, this.y - 250, this.radius * 2, this.height);
		ctx.lineWidth = 5;
		ctx.strokeStyle = 'rgba(255,255,255,0.2)';
		
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI, false);
        ctx.lineTo(this.x - this.radius,this.y - 50);
        ctx.lineTo(this.x + this.radius,this.y - 50);
		ctx.closePath();

		ctx.stroke();
		ctx.fill();

		ctx.save();
		if (mixedElementsArr.length > 0) {
			ctx.fillStyle = 'rgb(' + mixedElementsArr[0].color.r + ',' + mixedElementsArr[0].color.g + ',' + mixedElementsArr[0].color.b + ')';
			
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.volume, 0, Math.PI, false);
	        ctx.lineTo(this.x - this.radius,this.y - 50);
	        ctx.lineTo(this.x + this.radius,this.y - 50);
			ctx.closePath();
			ctx.fill();
			ctx.restore(); 
			if (this.volume <= 1) {
				this.empty();
			}
		}


		this.drawFlushPipe();
		if (this.flushing) {
			this.moveFlushingMixture();
		} 
		this.drawPalettePipe();
		if (this.saving) {
			this.movePaletteMixture();
		} 
		this.drawLabel();
		this.drawPropertyBars();
		this.drawFormula();
	};

	this.drawFlushPipe = function() {
		var x = this.x;
		var y = this.y - 100;
		ctx.fillStyle = "#ccc";
		ctx.fillRect(x, y, 250, 15);
		x += 250;
		ctx.fillRect(x, y, 15, 123);
		y += 123;
		ctx.fillRect(x, y, 100, 15);
	}	

	this.drawPalettePipe = function() {
		var x = this.x;
		var y = this.y - 155;
		ctx.fillStyle = '#ccc';
		ctx.fillRect(x, y, 360, 15);
	}

	this.movePaletteMixture = function() {
		ctx.fillStyle = this.saveColor;
		ctx.fillRect(this.saveX, this.saveY, this.saveWidth, this.saveHeight);
		if (this.saveX + this.saveWidth < this.x + 360) {
			this.saveWidth += this.flushSpeed * 2;
		}

		if (this.saveX < this.x + 360) {
			this.saveX += this.flushSpeed;
			this.saveWidth -= this.flushSpeed;
			this.volume -= this.flushSpeed / 5;
		}
		else {
			this.volume = 100;
			this.saving = false;
			this.empty();
		}
	}

	this.moveFlushingMixture = function() {
		ctx.fillStyle = this.flushColor;
		ctx.fillRect(this.flushX, this.flushY, this.flushWidth, this.flushHeight);
		if (this.flushY <= this.y - 100) {

			if (this.flushX + this.flushWidth < this.x + 265) {
		 		this.flushWidth += this.flushSpeed;
		 		// this.flushX += this.flushSpeed;
	 		}
	 	
		 	if (this.flushX < this.x + 250) {
		 		this.flushX += this.flushSpeed / 2;
		 		this.flushWidth -= this.flushSpeed / 2;
		 	}

		 	else {
		 		this.flushX = this.x + 250;
		 		this.flushY = this.y - 75;
 				this.flushWidth = 15;
		 	}

		}
		else {
			if (this.flushY + this.flushHeight < this.y - 100 + 123) {
		 		this.flushHeight += this.flushSpeed;
		 		// this.flushX += this.flushSpeed;
	 		}
	 	
		 	if (this.flushY < this.y - 100 + 123) {
		 		this.flushY += this.flushSpeed / 2;
		 		this.flushHeight -= this.flushSpeed / 2;
		 	}

		 	else if (this.flushY >= this.y - 100 + 123 && this.flushX === this.x + 250) {
		 		this.flushY = this.y - 100 + 123;
		 		this.flushX = this.x + 250;
 				this.flushHeight = 15;
		 	}

		 	if (this.flushY === this.y - 100 + 123 && this.flushX + this.flushWidth < this.x + 350) {
		 		this.flushWidth += this.flushSpeed;
		 		
		 	}

		 	if (this.flushY === this.y - 100 + 123 && this.flushX < this.x + 300) {
		 			this.flushX += this.flushSpeed / 2;
		 			this.flushWidth -= this.flushSpeed / 2;
	 		}
	 		else if (this.flushY >= this.y - 100 + 123 && this.flushX >= this.x + 300) {
				this.volume = 100;
				this.flushing = false;
	 		}
		}

	 	this.volume -= this.flushSpeed / 5;

	}

	this.drawFormula = function() {
		ctx.save();
		ctx.textBaseline = 'top';
		var x = this.x - this.radius;
		var y = this.y - this.height - this.radius / 2;
		ctx.fillStyle = '#c6c9b1';
		ctx.font = fontRegular;
		ctx.fillText(this.formula, x, y);
		ctx.restore();
	};

	this.drawLabel = function() {
		ctx.save();
		ctx.textBaseline = 'bottom';
		ctx.textAlign = 'left';
		var x = this.x - this.radius;
		var y = this.y - this.height - this.radius / 2;
		ctx.font = '50px Courier';

		if (mixedElementsArr.length > 0) {
			ctx.fillStyle = 'rgb(' + mixedElementsArr[0].color.r + ',' + mixedElementsArr[0].color.g + ',' + mixedElementsArr[0].color.b +')';
			ctx.fillText(mixedElementsArr[0].name, x, y);
			y += fontSmallHeadingInterval;
			ctx.fillStyle = "#c6c9b1";
			ctx.font = fontRegular;
			x = this.x + 60;
			y = this.y - this.height + this.radius / 2;
			for (var i = 0; i < mixedElementsArr[0].allPropertiesArr.length; i++) {
				var property = mixedElementsArr[0].allPropertiesArr[i];
				ctx.fillText(property.name + ': ' + property.description, x, y);
				y += fontRegularInterval;
			}		
		}
		else {
			ctx.fillStyle = '#c6c9b1';
			ctx.fillText('Empty', x, y);
		}
	
		ctx.restore();
	};

	this.drawPropertyBars = function() {
		var width = 100;
		var height = 5;
		var x = this.x + this.radius + 70;
		var y = this.y - (height + 60);

		// elasticity
		ctx.fillStyle = '#C6C9B1';
		ctx.fillRect(x, y, width, height);
		ctx.textBaseline = 'top';

		if (mixedElementsArr.length > 0) {
			// Draw marker
			ctx.fillStyle = 'rgb(' + mixedElementsArr[0].color.r + ',' + mixedElementsArr[0].color.g + ',' + mixedElementsArr[0].color.b +')';
			ctx.fillRect(x + width / 2 + mixedElementsArr[0].allPropertiesArr[0].value * 50, y, 3, 10);
		}

		ctx.fillStyle = '#C6C9B1';
		x -= 10;
		y += height + 2;
		ctx.font = fontTiny;
		ctx.fillText('Elastic -- Rigid', x, y);

		// texture
		x = this.x + this.radius + 70;
		y += 25;
		ctx.fillStyle = '#C6C9B1';
		ctx.fillRect(x, y, width, height);
		ctx.textBaseline = 'top';
		ctx.textAlign = 'left';
		if (mixedElementsArr.length > 0) {

			// Draw marker
			ctx.fillStyle = 'rgb(' + mixedElementsArr[0].color.r + ',' + mixedElementsArr[0].color.g + ',' + mixedElementsArr[0].color.b +')';
			ctx.fillRect(x + width / 2 + mixedElementsArr[0].allPropertiesArr[1].value * 50, y, 3, 10);
		}

		ctx.fillStyle = '#C6C9B1';
		x -= 10;
		y += height + 2;
		ctx.font = fontTiny;
		ctx.fillText('Smooth ---- Rough', x, y);


		// temperature
		x = this.x + this.radius + 70;
		y += 25;
		ctx.fillStyle = '#C6C9B1';
		ctx.fillRect(x, y, width, height);
		ctx.textBaseline = 'top';

		if (mixedElementsArr.length > 0) {

			// Draw marker
			ctx.fillStyle = 'rgb(' + mixedElementsArr[0].color.r + ',' + mixedElementsArr[0].color.g + ',' + mixedElementsArr[0].color.b +')';
			ctx.fillRect(x + width / 2 + mixedElementsArr[0].allPropertiesArr[2].value * 50, y, 3, 10);
		}

		ctx.fillStyle = '#C6C9B1';
		x -= 10;
		y += height + 2;
		ctx.font = fontTiny;
		ctx.fillText('Cold -------- Hot', x, y);


		// solidity
		x = this.x + this.radius + 70;
		y += 25;
		ctx.fillStyle = '#C6C9B1';
		ctx.fillRect(x, y, width, height);
		ctx.textBaseline = 'top';

		if (mixedElementsArr.length > 0) {

			// Draw marker
			ctx.fillStyle = 'rgb(' + mixedElementsArr[0].color.r + ',' + mixedElementsArr[0].color.g + ',' + mixedElementsArr[0].color.b +')';
			ctx.fillRect(x + width / 2 + mixedElementsArr[0].allPropertiesArr[3].value * 50, y, 3, 10);
		}

		ctx.fillStyle = '#C6C9B1';
		x -= 10;
		y += height + 2;
		ctx.font = fontTiny;
		ctx.fillText('Liquid ---- Solid', x, y);
	};
};