


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




