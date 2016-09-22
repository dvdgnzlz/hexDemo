  
var Cube = function( col, row ){
	// col and row are expressed in map coordinates....
	// *** ASSUMES odd-q verical layout *** ...
	var _that = this;
	var mod = col%2; // 0 if even, 1 if odd...
	var adjCol = col - mod;
	var adjRow = Math.floor( adjCol/2);
	this.x = col;
	this.y = row - adjRow;
	this.z = (this.x*-1)-this.y; // ensure that x + y + z is always true....
	this.col = col;
	this.row = row;

	this.getDistance = function( cube2 ){
		var dX = Math.abs( this.x - cube2.x );
		var dY = Math.abs( this.y - cube2.y );
		var dZ = Math.abs( this.z - cube2.z );
		return (dX + dY + dZ)/2;
	};//end function...

	this.reverseEngineer = function( x, y, z ){
		// z isn't needed...
		var col = x;
		var mod = col%2; // 0 if even, 1 if odd...
		var adjCol = col - mod ;
		var adjRow = Math.floor( adjCol/2);
		var row = y + Math.floor( (col-mod)/2 );
		var pt = new Point( col, row );
		//console.log( pt );
		return pt;
	};

	this.getLosPairs = function( cube ){
		// CHECK the path between this and cube for Line of Sight paths that go between two hexes (and return those pairs of hexes)...
		// DO NOT PASS IN ANY x VALUE THAT IS NEGATIVE - ALGORITHM NEEDS TO BE TWEAKED FOR NEGATIVE COORDS...
		// if array is empty, there is no LOS issue where the LOS passes between two hexes....
		var checkLosInTheseHexes = [];

		var dX = Math.abs( this.x - cube.x );
		var dY = Math.abs( this.y - cube.y );
		var dZ = Math.abs( this.z - cube.z );

		var bigAttr = "x";
		var littleAttr1 = "y";
		var littleAttr2 = "z";
		if ( dY>dX){
			bigAttr = "y";
			littleAttr1 = "x";
		}
		else if (dZ>dX){
			bigAttr = "z";
			littleAttr2 = "x";
		}
		var dir = -1;
		var steps = (this[bigAttr]-cube[bigAttr])/2;
		if( steps<0){
			dir = 1;
		}
		steps = Math.abs(steps);

		var numArray = [ dX, dY, dZ ];
		numArray = numArray.sort();
		if (numArray[0]==numArray[1] && numArray[2]/2==numArray[0] ){

			for (var x=1; x<=steps; x++){
				var bigStep = x*2*dir;
				var smStep = bigStep/2;
				var smStep2 = smStep - 1*dir;
				//console.log( "bigStep: " + bigStep + " smStep " + smStep + " smStep2: " + smStep2 );
				var obj = {x:null, y:null, z:null};

				obj[bigAttr] = this[bigAttr] + bigStep - 1*dir;
				obj[littleAttr1] = this[littleAttr1] - smStep2;
				obj[littleAttr2] = this[littleAttr2] - smStep;
				var pt1 = _that.reverseEngineer( obj.x, obj.y, obj.z );
				// NOW REVERSE THE littleAttributes....
				obj[littleAttr1] = this[littleAttr1] - smStep;
				obj[littleAttr2] = this[littleAttr2] - smStep2;
				var pt2 = _that.reverseEngineer( obj.x, obj.y, obj.z );
				// ADD THE PAIR TO THE RETURN COLLECTION....
				var pairOfHexes = [pt1, pt2];
				checkLosInTheseHexes.push( pairOfHexes );
				// NOW FIGURE OUT THE MIDDLE HEX...
				if (x<steps){
					obj[bigAttr] = this[bigAttr] + bigStep;
					obj[littleAttr1] = this[littleAttr1] - smStep;
					obj[littleAttr2] = this[littleAttr2] - smStep;
					var ptMid = _that.reverseEngineer( obj.x, obj.y, obj.z );
					// ADD THE MIDDLE HEX TO THE RETURN COLLECTION....
					checkLosInTheseHexes.push( [ptMid] );
				}
			}
		}
		// checkLosInTheseHexes will be empty if LOS does not pass between hexes... Use another method to determine hexes LOS passes through...
		//console.log( checkLosInTheseHexes);
		return checkLosInTheseHexes; // array of points which are the coords of all hexes that need to be checked for LOS...
	};//end function...

	this.reverseEngineer( this.x, this.y, this.z ); // confirm....
};//end Cube....
