
function Utility() {

	var synth = null;
	window.requestAnimFrame = (function(callback) {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();



	// Set fonts based on orientation
	this.setFonts = function() {
		fontTitle = 'bold 80px verdana';
		fontTitleInterval = 110;

		fontTask = '20px Courier';
		fontTaskInterval = 35;


		fontGrade = '100px Courier';
		fontGradeInterval = 100;

		fontSmallHeading = '20px Courier';
		fontSmallHeadingInterval = 20;

		fontRegular = '15px Courier';
		fontRegularInterval = 20;

		fontCredit = '15px Courier';
		fontTiny = '12px Courier';
		fontTinyInterval = 15;

		fontTaskHeading = '20px Helvetica';

		fontWindowHeading = '30px Helvetica';
		fontSmallWindowHeading = '15px Helvetica';
	};


	// Get a random integer between two specified integers.
	this.randomFromTo = function(from, to){
		return Math.floor(Math.random() * (to - from + 1) + from);
	};

	// Shuffle an array
	this.shuffleArray = function(array) {
	    for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    }
	    return array;
	};

	this.removeFromArray = function(object,array) {
		var newArray = array;
		var index = newArray.indexOf(object);
		newArray.splice(index, 1);
		return newArray;
	};
};