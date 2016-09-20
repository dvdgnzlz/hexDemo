// NEEDS TO BE UPDATE TO WORK WITH HexDemo Points...





function Point( x, y ){
	this.x = x;
	this.y = y;
	this.isEqualTo = function(point){
		return (this.x==point.x && this.y==point.y);
	};
}//end Point....

//======================






function FlatTopHex( pOriginPoint, pHexCoordOffset, pHexSize, pIsOddOrientation ){
	// pOriginPoint is the origin of hex 0,0.
	// the center should be shifted based on pHexCoordOffset (expressed in map coordinates )....
	var _yScale = 1;
	var _that=this;
	this.x = pHexCoordOffset.x;
	this.y = pHexCoordOffset.y;
	this.cx = 0;
	this.cy = 0;
	this.width = 0;
	this.height = 0;
	this.cornerArr = [];
	this.cube = new Cube( pHexCoordOffset.x, pHexCoordOffset.y );

  var _initPosition = function( ){
  	// WORKS FOR FLAT TOP HEXES ONLY....
    _that.width = pHexSize * 2;
    var hDist = _that.width * 3 / 4;
    _that.height = Math.sqrt(3)/2 * _that.width;
    var x = pOriginPoint.x + hDist*pHexCoordOffset.x;
    var bShift = pHexCoordOffset.x%2==1; // is column odd number?

    var y = pOriginPoint.y + pHexCoordOffset.y * _that.height;
    
    if (bShift && pIsOddOrientation ){
        y += _that.height/2;
    }
    if (bShift && !pIsOddOrientation ){
        y -= _that.height/2;
    }
    _that.cx = x;
    _that.cy = y;
    //return new Point(x,y);
  };

  var _getHexCorner = function( i, rScaleFactor ){
    var angle_deg = 60 * (i - 2);
    //if (!bFlatTop) angle_deg += 30;
    var angle_rad = Math.PI/180 *angle_deg;
    var x = _that.cx + (pHexSize*rScaleFactor) * Math.cos(angle_rad);
    var y = _that.cy + (pHexSize*rScaleFactor) * Math.sin(angle_rad);
    x = Math.round( x*10000 )/10000;
    y = Math.round( y*10000 )/10000;
    y = y * _yScale;
    return new Point( x, y);
  };

  this.getCorners = function( rScaleFactor ){
  	// return an array of points reflecting the corners of the hex.  
  	// Can scale the size (0.5 would give a hex half the size ).
  	var cornerArr = [];
		for( var i=0; i<6; i++){
			cornerArr.push( _getHexCorner(i, rScaleFactor) );
		}
		return cornerArr;
  };

  this.getLines = function(){
  	var lineArr = [];
		for( var i=0; i<6; i++){
			var i2 = i+1;
			if (i2==6){i2=0;}
			lineArr.push( new Line( _that.cornerArr[i], _that.cornerArr[i2]) );
		}
		return lineArr;
  };


  this.doesLinePassThroughHex = function( line ){
  	for (var i=0; i<_that.lineArr.length; i++){
  		var hexLine = _that.lineArr[i];
  		var intersectPoint = hexLine.getStrictIntersection( line );	
  		if (!intersectPoint){
  			return false;
  		}
  		return true;
  	}
  };

  this.debugLines = function(line){
  	console.log("DEBUGGING THIS ONE....");
  	var debug = false;
  	if (_that.x==27 && _that.y==3){
  		debug = true;
  	}
  	var sideArr = _that.whichFacesDoesLinePassThrough( line, debug );
  	console.log("sideArr");
  	console.log( sideArr );
  };

  this.whichFacesDoesLinePassThrough = function( line, bDebug ){
  	var sideArr = [];
  	for (var i=0; i<_that.lineArr.length; i++){
  		if (bDebug){
  			console.log( "Checking the next side.... " + i);  			
  		}
  		var hexLine = _that.lineArr[i];
  		var intersectPoint = hexLine.getStrictIntersection( line, bDebug );	
  		if (bDebug){
  			//console.log( i );
  			console.log( hexLine );
  			console.log( intersectPoint );
  		}
  		if (intersectPoint!=null){
  			if (bDebug){
	  			console.log("****  FOUND INTERSECT POINT!!!!");
	  			console.log( intersectPoint );		
  			}
  			sideArr.push(i);
  		}
  		else {
  			if (bDebug){
  				console.log("  Nope, no intersect on this side.");
  				console.log("---------");
  			}
  		}
  	}  	
  		return sideArr;
  }//end function...


  this.getCubeNeighbor = function( side ){
  	var neighbors = [
  		{x:0, y:-1, z:1},
  		{x:1, y:-1, z:0},
  		{x:1, y:0, z:-1},
  		{x:0, y:1, z:-1},
  		{x:-1, y:1, z:0},
  		{x:-1, y:0, z:1}
  	];
  	var n = neighbors[side];
  	var newX = _that.cube.x + n.x;
  	var newY = _that.cube.y + n.y;
  	var newZ = _that.cube.z + n.z;
  	var nCoords = _that.cube.reverseEngineer( newX, newY, newZ );
  	return nCoords;
  };


  this.getDistance = function( destHexCoordPt ){
  	var destHex = new FlatTopHex( pOriginPoint, destHexCoordPt, pHexSize, pIsOddOrientation );
  	var distance = _that.cube.getDistance( destHex.cube );
  	return distance;
  };


  this.getHexesInPath = function( destHexCoordPt ){
  	// return an array with all the hex coordinates between this and the destination hex...
  	// each element in the array is an array of hexes
  	// if the element has more than one coord in it, it means the line passes right along the side of both hexes...
  	//console.log( "DISTANCE");
  	//console.log( _that.getDistance( destHexCoordPt ));
  	var coordArr = [];
  	var _stepCloserToDest = function( hexToCheck, line, sideLineEnters ){
  		// adjust sideLineEnters by 3 so it represents the side we already know about....
  		console.log( "   CHECKING HEX... side=" + sideLineEnters);
  		console.log( hexToCheck );

  		var sideToIgnore = sideLineEnters - 3;
  		if (sideToIgnore<0) sideToIgnore+=6; 
  		var sidesLineExits = hexToCheck.whichFacesDoesLinePassThrough( line );
  		var indexToIgnore = sidesLineExits.indexOf( sideToIgnore );
  		if (indexToIgnore>-1){
  			sidesLineExits.splice( indexToIgnore, 1);//remove the item to ignore.
  		}
  		for (var x = 0; x<sidesLineExits.length; x++){
  			var side = sidesLineExits[x];
  			var neighborHexCoords = hexToCheck.getCubeNeighbor( side );
	  		console.log( "Sides to check");
	  		console.log( side );
  			if (neighborHexCoords){
  				var nPoint = new Point( neighborHexCoords.x, neighborHexCoords.y );
  				console.log( "   FOUND STEP IN PATH:");
  				console.log( nPoint );
  				if (destHexCoordPt.x == nPoint.x && destHexCoordPt.y==nPoint.y){
  					// WE FOUND TH DESTINATION HEX!
		  			console.log( "*** getHexesInPath(): FOUND THE DESTINATION HEX!");
		  			console.log( coordArr );
		  			return;  					
  				}
  				coordArr.push( [nPoint] ); // ADD THIS HEX TO THE LIST....
  				// haven't found it yet, so iterate....
  				var nHex = new FlatTopHex( pOriginPoint, nPoint, pHexSize, pIsOddOrientation );
  				_stepCloserToDest( nHex, line, side );// iterate closer to destination....
  			}
  		}
  	};
  	var destHex = new FlatTopHex( pOriginPoint, destHexCoordPt, pHexSize, pIsOddOrientation );
  	// second, get a line between the center of this hex, and the center of the dest hex....
  	var line = new Line( new Point( _that.cx, _that.cy), new Point(destHex.cx, destHex.cy ));
  	// third, see which side of this hex the line passes through
  	//var sides = _that.whichFacesDoesLinePassThrough( line );
  	//console.log( "===HEXES IN PATH:===")
  	//console.log( sides );
  	//var n = _that.getCubeNeighbor( sides[0] );
  	// TEST THE DEST HEX TO SEE IF OUR LOS WILL RUN BETWEEN HEXES (RETURN THOSE PAIRS)....
  	coordArr = _that.cube.getLosPairs( destHex.cube );
  	if (coordArr.length>0){ // YES, THE LOS RUNS BETWEEN HEXES.  SOME ENTRIES IN THIS ARRAY WILL BE PAIRS...
  		return coordArr;
  	}
  	// NO LOS ISSUE, SO MANUALLY TRACE THE HEXES THE LINE PASSES THROUGH....
  	_stepCloserToDest( _that, line, 999 );
  	return coordArr;
  };

	_initPosition();
	_that.cornerArr = this.getCorners( 1.0 );
	_that.lineArr = this.getLines();
	//console.log( this );

}//end FlatTopHex...



//p1: Point {x: 2207.568, y: 119.328, isEqualTo: function}
//p2: Point {x: 2237.4, y: 67.6575, isEqualTo: function}










function Line( p1, p2 ){
	var _that=this;
	this.p1=p1;
	this.p2=p2;
	this.m=NaN;// slope... Only NaN when p1 and p2 are the same point....
	this.b=NaN; // y-intercept....


	this.getStrictIntersection=function( line, bDebug ){
		var i = _that.getIntersection( line, bDebug);
		if (i==null) return null;
		if (line.m==0){
			// IF THE LINE HAS SLOPE OF 0, THERE IS NO TOLERANCE FOR THE Y-INTERCEPT, THEREFORE ROUND Y TO ENSURE NO FLOATING POINT ERRORS...
			i.y = Math.round( i.y*1000000)/1000000;
		}
		if (bDebug){
			console.log(" ---getStrictIntersection Point and line");
			console.log( i );
			console.log( line );
		}
		// defound the bounds described by line....
		var lowBoundY = Math.min( line.p1.y, line.p2.y);
		var highBoundY = Math.max( line.p1.y, line.p2.y);
		var lowBoundX = Math.min( line.p1.x, line.p2.x);
		var highBoundX = Math.max( line.p1.x, line.p2.x);

		if (bDebug){
			console.log( "   lowBoundY=" + lowBoundY );
			console.log( "   highBoundY=" + highBoundY );
			console.log( "   lowBoundX=" + lowBoundX );
			console.log( "   highBoundX=" + highBoundX );
		}
		if (i.y<lowBoundY || i.y>highBoundY) return null; // lines don't intersect within bounds...
		if (i.x<lowBoundX || i.x>highBoundX) return null;// lines don't intersect within bounds....
		
		var lowBoundY = Math.min( this.p1.y, this.p2.y);
		var highBoundY = Math.max( this.p1.y, this.p2.y);
		var lowBoundX = Math.min( this.p1.x, this.p2.x);
		var highBoundX = Math.max( this.p1.x, this.p2.x);
		if (bDebug){
			console.log( "   lowBoundY=" + lowBoundY );
			console.log( "   highBoundY=" + highBoundY );
			console.log( "   lowBoundX=" + lowBoundX );
			console.log( "   highBoundX=" + highBoundX );
		}
		if (i.y<lowBoundY || i.y>highBoundY) return null; // lines don't intersect within bounds...
		if (i.x<lowBoundX || i.x>highBoundX) return null;// lines don't intersect within bounds....
		return i; // the intersection is within bounds....	
	};


	this.initialize=function(){
		var numerator = _that.p2.y-_that.p1.y;
		var denominator = _that.p2.x-_that.p1.x;
		_that.m = numerator/denominator;
		
		var slope = _that.m;
		if (!isNaN(slope)){
			if (slope==Number.POSITIVE_INFINITY)
				slope = Number.MAX_VALUE;
			if (slope==Number.NEGATIVE_INFINITY)
				slope = Number.MIN_VALUE;
				
			// calculate the y-intercept b....
			_that.b=_that.p1.y-(_that.m*_that.p1.x);
		}	
	};



	this.getIntersection=function( line, bDebug ){
		var m1 = _that.m;
		var m2 = line.m;
		var b1 = _that.b;
		var b2 = line.b;
		
		var y = NaN;
		var x = NaN;
		
		
		if (m1==m2)
			return null; // RETURN NULL IF LINES ARE PARALLEL....
		
		if (m1==Number.POSITIVE_INFINITY || m1==Number.NEGATIVE_INFINITY){
			// if '_that' line has slope of infinity, then y will never change, thus x is the same too....
			if (m2!=Number.POSITIVE_INFINITY && m2!=Number.NEGATIVE_INFINITY){
				x = _that.p1.x;
				// use the slope of the other line to solve for x
				// y=mx+b...mx=y-b....x=(y-b)/m....
				y = m2*x + b2; // (y-b2)/m2;
				return new Point( x,y);
			}
			else {
				return null; // both lines have slopes with versions of infinity....
			}
		}
		if (m2==Number.POSITIVE_INFINITY || m2==Number.NEGATIVE_INFINITY){
			// if 'line' line has slope of infinity, then y will never change, thus x is the same too....
			if (m1!=Number.POSITIVE_INFINITY && m1!=Number.NEGATIVE_INFINITY){
				x = line.p1.x;
				// use the slope of the other line to solve for x
				// y=mx+b...mx=y-b....x=(y-b)/m....
				y = m1*x + b1; // (y-b2)/m2;
				return new Point( x,y);
			}
			else {
				return null; // both lines have slopes with versions of infinity....
			}
		}
		
	 var x_num = b2-b1;
	 var x_denom = m1-m2;
	 x = x_num/x_denom;

	 
	 y = m1 * x + b1;  // y=m1 x + b1;
	 if (bDebug){
	 	console.log( "x=" + x);
	 	console.log( "y=" + y);
	 	console.log( "x_num=" + x_num);
	 	console.log( "x_denom=" + x_denom);
	 	console.log( "b2=" + b2);
	 	console.log( "b1=" + b1);
	 	console.log( "that.b=" + _that.b);
	 	console.log( "m2=" + m2);
	 }
	 var pt = new Point( x,y);
	 return pt;
	}; //end Line.getIntersection....

	this.initialize();	
};//end line



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

var c1 = new Cube( 5,0 );
var c2 = new Cube( 1,0 );
//var c2 = new Cube( 6,-3 );
c1.getLosPairs( c2 );
 console.log( c1 );
 console.log( c2 );
