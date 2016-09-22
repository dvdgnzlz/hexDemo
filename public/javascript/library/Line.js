
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

