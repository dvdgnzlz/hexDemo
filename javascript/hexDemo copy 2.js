        var Point = function( x, y ){
        	this.x = x;
        	this.y = y;
        };//end Point....


        var HexLib = function ( hexSize, bFlatTop, bOddLayout, yScale ){
        	var _that = this;

        	this.getNeighborCoords = function( point ){
        		var arr = [];
        		var vx = 0;
        		var vy = 0;
        		if (!bOddLayout){
        			vx = -1;
        		}
        		if (point.x%2===1){
        			vy = 1;
        		} 
        		if (bFlatTop && bOddLayout){
	        		arr.push(new Point(point.x + 0 + vx, point.y - 1 )); //above
	        		arr.push(new Point(point.x - 1, point.y -1 + vy ));
	        		arr.push(new Point(point.x + 1, point.y - 1 + vy));
	        		arr.push(new Point(point.x - 1, point.y + 0 + vy));
	        		arr.push(new Point(point.x + 1 + vx, point.y + 0 + vy));
	        		arr.push(new Point(point.x + 0 + vx, point.y + 1));     
	        		return arr;   			
        		}
        		if (bFlatTop && !bOddLayout){
	        		arr.push(new Point(point.x + 0, point.y - 1)); //above
	        		arr.push(new Point(point.x - 1 , point.y + 0 - vy));
	        		arr.push(new Point(point.x + 1, point.y - 0 - vy));
	        		arr.push(new Point(point.x - 1, point.y + 1 - vy));
	        		arr.push(new Point(point.x + 1 , point.y + 1 - vy));
	        		arr.push(new Point(point.x + 1 + vx, point.y + 1));     
	        		return arr;   			
        		}
        		if (point.y%2==1){
	        		arr.push(new Point(point.x + 0 + vx, point.y - 1));
	        		arr.push(new Point(point.x + 1 + vx, point.y - 1));
	        		arr.push(new Point(point.x - 1, point.y + 0));
	        		arr.push(new Point(point.x + 1, point.y + 0));
	        		arr.push(new Point(point.x + 0 + vx, point.y + 1));
	        		arr.push(new Point(point.x + 1 + vx, point.y + 1));
        		}
        		else {
	        		arr.push(new Point(point.x - 1 - vx, point.y - 1));
	        		arr.push(new Point(point.x + 0 - vx, point.y - 1));
	        		arr.push(new Point(point.x - 1, point.y + 0));
	        		arr.push(new Point(point.x + 1, point.y + 0));
	        		arr.push(new Point(point.x - 1 - vx, point.y + 1));
	        		arr.push(new Point(point.x + 0 - vx, point.y + 1));
        		}
        		return arr;
        	};
        	var getHexCorner = function( centerPoint, i ){
        		var angle_deg = 60 * i;
        		if (!bFlatTop) angle_deg += 30;
        		var angle_rad = Math.PI/180 *angle_deg;
        		var x = centerPoint.x + (hexSize-hexSize*0.02) * Math.cos(angle_rad);
        		var y = centerPoint.y + (hexSize-1) * Math.sin(angle_rad);
        		y = y * yScale;
        		return new Point(x,y);
        	};

        	this.getCornerArray = function( centerPoint, axialOffset ){
        		var arr = [];
        		var shiftedCenter = calcCenterOffset( centerPoint, axialOffset );
        		for (var i=0; i<=6; i++){
        			var point = getHexCorner( shiftedCenter, i );
        			arr.push([point.x, point.y]);
        		}
        		return arr;
        	};

        	var calcCenterOffset = function( centerPoint, axialOffset ){
        		if (bFlatTop){
        			return calcCenterOffsetFlatTop( centerPoint, axialOffset );
        		}
        		// calculate offset for pointy top...
                var height = hexSize * 2;
                var width = Math.sqrt(3)/2 * height;
                var v1 = Math.sqrt(3)/2 * hexSize;
                var v2 = height * 3 / 4;
                
                var x = centerPoint.x + width*axialOffset.x;
                var bShift = axialOffset.y%2==1; // is row odd number?
                if (bShift && bOddLayout ){
                	x += width/2;
                }
                if (bShift && !bOddLayout ){
                	x -= width/2;
                }
                var y = centerPoint.y + axialOffset.y * v2;
            		return new Point(x,y);
            	};

            	var calcCenterOffsetFlatTop = function( centerPoint, axialOffset ){
                var width = hexSize * 2;
                var hDist = width * 3 / 4;
                var height = Math.sqrt(3)/2 * width;

                // var height = hexSize * 2;
                // var width = Math.sqrt(3)/2 * height;
                // var v1 = Math.sqrt(3)/2 * hexSize;

                var x = centerPoint.x + hDist*axialOffset.x;
                var bShift = axialOffset.x%2==1; // is column odd number?

                var y = centerPoint.y + axialOffset.y * height;
                
                if (bShift && bOddLayout ){
                 	y += height/2;
                }
                if (bShift && !bOddLayout ){
                 	y -= height/2;
                }
            
        		return new Point(x,y);
        	};
        }//end HexLib...

        var Counters = function(){
            var _that = this;
        	var counters = [];
        	counters.push( { id:"CTR_UNIT_29_ARM", faction: "ALLIES", country:"UK", 
        		label:"23 Hus", formation:"29 Arm", maxSteps:6, 
        		curSteps: 6, unitType:"Armor", assault:true, 
        		AV:3, TQ: 4, RNG:2, MA:14, hexX:2, hexY: 3 } );
            counters.push( { id:"CTR_UNIT_30_ARM", faction: "ALLIES", country:"UK", 
                label:"23 Hus xxx", formation:"29 Arm", maxSteps:6, 
                curSteps: 6, unitType:"Armor", assault:true, 
                AV:3, TQ: 4, RNG:2, MA:14, hexX:3, hexY: 3 } );
        	this.getCounters = function(){
        		return counters;
        	};
            var onCounterMove = function(){
                console.log("MOVE");
            };        
            var onCounterStartMove = function(){
                console.log("MOVE START");
            };
            var onCounterEndMove = function( evt ){
                console.log("MOVE END");
                console.log(this);
                var hexSVG = evt.target;
                var hexID = hexSVG.id;
                console.log( hexID );
                if (hexID.substr(0,3)!="hex") return;
                var snapHex = s.select("#" + hexID );
                var hexX = snapHex.data("x");
                var hexY = snapHex.data("y");
                var counter = counters[0];
                counter.hexX=hexX; // UPDATE COUNTER INFO WITH NEW HEX...
                counter.hexY=hexY;
                _that.renderCounter( counter );
                this.remove();
            };
            var testOnDragOver = function(){
                console.log("DRAG OVER");
                console.log(this);
            };

            this.renderCounter = function( counter, hexGroup){
                //hexGroup.node.onmousemove=testOnDragOver;
                // get hex of counter...
                //console.log(hexGroup.node);
                var x = counter.hexX;
                var y = counter.hexY;
                var id = "#hex" + x + "_" + y;
                var hex = s.select( id );
                if (hex){
                    var bbox = hex.getBBox();
                    console.log( bbox );
                    var counterSize = 30;
                    var counterSnap = s.rect( bbox.cx-counterSize, bbox.cy-counterSize, counterSize*2, counterSize*2, 5, 5);
                    counterSnap.attr({
                        "fill":"#C97",
                        "stroke-width": 1,
                        "stroke":"black",
                        "opacity":0.9,
                        "id":counter.id
                    });
                    counterSnap.drag(onCounterMove, onCounterStartMove, onCounterEndMove );
                }//end if...

            };//end fn...
        };
