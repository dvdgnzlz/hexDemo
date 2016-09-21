



appModule.service('HexService', function( GameStateService, SvgService, MapDataService ) {
    console.log("HexService");
    var MainAppService = null;
    var _that = this;
    var HexService = this;

    //var hexGroupSvg = SvgService.svg.g();
    var hexGroupSvg = Snap("#oHexMap");
    var gHexSvgArray = [];
    var _unitDisplay = Snap('#oUnitDisplay');
    var mapOffset = GameStateService.getMapOffset();
    var hexSize = GameStateService.getHexSize();
    var bFlatTop = GameStateService.getIsFlatTopHexes();
    var bOddLayout = GameStateService.isOddLayoutHexes();
    var yScale = GameStateService.getMapScaleFactorY(); 

    var _hexColWidth = 0;//what is the width of one column of hexes?
    var _hexRowHeight = 0; //what is the heigth of one row of hexes?
    var _shiftColumns = -1;  // how many columns has the window scrolled over?
    var _shiftRows = 0; // how many rows has the window scrolled up?

    var _hexMapTranformPosition = GameStateService.getMapOffset();  //POINT OBJECT...

    this.setMainAppService = function( mainAppService ){
        MainAppService = mainAppService;
    };

    this.getScrollPos = function(){
        // return info about where the map has scorlled to...
        return new Point( _shiftColumns, _shiftRows );
    };

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
            arr.push(new Point(point.x + 1, point.y - 1 + vy));
            arr.push(new Point(point.x + 1 + vx, point.y + 0 + vy));
            arr.push(new Point(point.x + 0 + vx, point.y + 1));     
            arr.push(new Point(point.x - 1, point.y -1 + vy ));
            arr.push(new Point(point.x - 1, point.y + 0 + vy));
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

    this.getHexMapTransformPos = function(){
        return _hexMapTranformPosition;
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
        _hexRowHeight = height;
        var width = Math.sqrt(3)/2 * height;
        _hexColWidth = width;
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
        _hexColWidth = width;
        var hDist = width * 3 / 4;
        var height = Math.sqrt(3)/2 * width;
        _hexRowHeight = height;

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

    var getHexSvgIdByLocalCoords = function( localX, localY ){
        var id = "#hexSvg_" + localX + "_" + localY;
        return id;
    };

    var getHexSvgById = function( hexSvgId ){
        var hex = hexGroupSvg.select( hexSvgId );
        return hex;
    };
    var getHexSvgByAbsCoords = function(absX, absY){
        var scrollColumnsX = _that.getScrollPos().x + 1;// HOW MAY COLUMNS OF HEXES SHIFTED HORIZ
        var scrollColumnsY = _that.getScrollPos().y + 1;// HOW MANY ROWS OF HEXES SHIFTED DOWN?
        var localX = absX - scrollColumnsX*4 + 0;// TAKE ABSOLUTE HEX COORDINATE AND SHIFT BY AMOUNT OF MAP TRANSFORM TO GET LOCAL HEX COORDS
        var localY = absY - scrollColumnsY + 1;// TAKE ABSOLUTE HEX COORDINATE AND SHIFT BY AMOUNT OF MAP TRANSFORM TO GET LOCAL HEX COORDS
        var id = getHexSvgIdByLocalCoords( localX, localY );
        var hex = getHexSvgById( id ); 
        //console.log( hex );  
        return hex;     
    };


    this.hexHoverIn = function( evt, x, y ){
        //console.log( evt.target.dataset );
        var hexSvg = evt.target;
        //console.log(this);
        this.addClass("hilightHex");

    };
    this.hoverOut = function( evt ){
        this.removeClass("hilightHex");
        this.addClass("defaultHex");
    };

    this.click = function( evt ){
        //console.log(this);
        var parent = this.parent();
        var elemArr = [];
        var x = parseInt(this.data("hexSvgX"));
        var y = parseInt(this.data("hexSvgY"));
        //console.log( "Clicked on: " + x + ", " + y);
        _that.convertHexCoordsToMapCoords( x, y );// ONLY WRITES TO CONSOLE....
        var coords = _that.getNeighborCoords( new Point(x,y) );
        for (var z=0; z<coords.length; z++){
            var id = getHexSvgIdByLocalCoords( coords[z].x, coords[z].y);
            var found = getHexSvgById( id );
            elemArr.push(found);                    
        }

        var hilightElem = function(elem){
            if (!elem) return;
        //    elem.addClass( "hilightHex");
            //elem.animate( {class: "defaultHex"}, 800);
            //elem.attr({opacity:1, "fill-opacity":0.3});
            //elem.animate({opacity:0, "fill-opacity":0}, 800);
        };
        for (var z=0; z<elemArr.length; z++){
            //console.log( elemArr[z])
            hilightElem( elemArr[z]);
        }

        // var absCoords = _that.convertHexCoordsToAbsCoords( x, y );
        // MapDataService.setHexAsForest( absCoords.x, absCoords.y );
        // refreshHexDisplay();
    };

    var _hexDblClick = function(evt){
        var x = parseInt(this.data("hexSvgX"));
        var y = parseInt(this.data("hexSvgY"));
        var absCoords = _that.convertHexCoordsToAbsCoords( x, y );
        MapDataService.setHexAsForest( absCoords.x, absCoords.y );
        refreshHexDisplay();
    };

    this.convertHexCoordsToAbsCoords = function( hexX, hexY ){
        var x = hexX + (_shiftColumns + 1)*4;
        var y = hexY + _shiftRows ;
        return new Point( x, y );    
    };

    this.convertHexCoordsToMapCoords = function( hexX, hexY ){
        // LAST BLITZKREIG....
        var mapId = 1;
        var x = hexX + _shiftColumns + 1;
        if (x>62){
            x-=62;
            mapId += 2;
        }
        var y = hexY + _shiftRows ;
        if (y>=35){
            y-=34;
            mapId += 1;
        }
        y=35-y;
        console.log("MAP [" + mapId + "] " + x + "." + y + " ... " + hexX  );
    };

    this.onWinScrollBegin = function(){
        //console.log( "BGIN");
        _unitDisplay.stop();
        //_unitDisplay.animate({"xxopacity":0 }, 10); // HIDE DISPLAY...
    };


    this.onWinScrollEnd = function( newOffsetLeft, newOffsetTop ){
        //console.log( "PX DOWN: " + newOffsetTop);
        //console.log( "ROW HT " + _hexRowHeight  );
        var mapOffset = GameStateService.getMapOffset();
        var shiftFactors =  Math.floor(newOffsetLeft/(_hexColWidth*3));
        //shiftFactors is the number of columns to jump over....
        _shiftColumns = shiftFactors - 1 ;
        var vShiftFactors = Math.floor( newOffsetTop/(_hexRowHeight*1));
        _shiftRows = vShiftFactors - 1;
        //console.log( "SHIFT ROWS IS NOW: " + _shiftRows );
        //console.log( "ROWS TO SHIFT DOWN: " + _shiftRows  );

        // var hShiftPx = newOffsetLeft - (shiftFactors*_hexColWidth*3);
        // var vShiftPx = newOffsetTop - (_shiftRows*_hexRowHeight*1);
        var hShiftPx = mapOffset.x + (shiftFactors*_hexColWidth*3);
        var vShiftPx =  mapOffset.y + (_shiftRows*_hexRowHeight*1);  
        _hexMapTranformPosition = new Point( hShiftPx, vShiftPx);      
        //console.log("vShiftPx = " + vShiftPx );
        // NUDGE THE HEX MAP TO LINE UP WITH THE NEW SCROLL POS....
        hexGroupSvg.transform( 'T' + hShiftPx + "," + vShiftPx); //shift all hexes over by this amount....

        refreshHexDisplay();

        // *********************************
        // DEAL WITH THE UNIT DISPLAY PANEL HERE FOR NOW....
        var udx = newOffsetLeft + MainAppService.winWidth - 200;
        var udy = newOffsetTop + 200 ;
        _unitDisplay.stop();
        //_unitDisplay.transform( 'T' + udx + "," + udy);
        _unitDisplay.animate({"xxopacity":1, "transform":"translate(" + udx + "," + udy + ")"}, 1200, mina.easeinout); // SHOW DISPLAY...
    };

    var refreshHexDisplay = function(){
        // THE WINDOW HAS SHIFTED, SO READ THE CLASS INFO FOR EACH HEX AND UPDATE ACCORDINGLY...
        var mapInfoSvg = SvgService.svg.select("#oMapInfo");
        mapInfoSvg.selectAll(".primaryRoad").remove();//REMOVE OLD ROADS...    

        mapOffset = _that.getHexMapTransformPos(); 

        for (var x=0; x<gHexSvgArray.length; x++){
            var hexSvg = gHexSvgArray[x];
            var localX = hexSvg.data("hexSvgX");
            var localY = hexSvg.data("hexSvgY");
            var hexAbsPoint = _that.getAbsolutePositionFromHexSvg( Snap(hexSvg) );
            var absX = hexAbsPoint.x;
            var absY = hexAbsPoint.y;
            
            // APPLY CLASS NAMES TO SVG...
            hexSvg.node.className.baseVal="";//strip all class descriptors from object...
            var classNames = MapDataService.getHexClassNames( absX, absY );
            for (var c=0; c<classNames.length; c++){
                var className = classNames[c];
                hexSvg.addClass( className );
            }

            // SHOW ROADS...
            //hexSvg.select(".primaryRoad").remove();//REMOVE OLD ROADS...
            var primaryRoadArr = MapDataService.getPrimaryRoadSides( absX, absY );

            if (primaryRoadArr.length>0)
                console.log(  primaryRoadArr );

            var bbox = hexSvg.getBBox();    
            var hexCtrPt = HexService.getHexCenterPoint( hexAbsPoint.x, hexAbsPoint.y );

            for (var pr=0; pr<primaryRoadArr.length; pr++){
                sideIndex = primaryRoadArr[pr];

                var g = mapInfoSvg.g();
                g.addClass( "primaryRoad");
                mapInfoSvg.add( g );
                //g.attr({transform:"translation(" +  hexCtrPt.x + "," +  _hexMapTranformPosition.y + ")"}); // <-WORKS....
                g.attr({transform:"translation(" +  hexCtrPt.x + "," +  hexCtrPt.y + ")"});

                var roadSvg = g.text(0, 0, "ROAD");
                g.add(roadSvg);
                roadSvg.addClass( "primaryRoad");
                var textX = Math.round( Math.sin( 60*sideIndex * Math.PI/180) * (hexSize*0.75) ) ;
                var textY = Math.round( Math.cos(60*sideIndex * Math.PI/180) * -1*(hexSize*0.75) );
                //console.log( sideIndex + " " + textY);
                var xform = "translate(" + textX + "," + textY + "), rotate(0)";
                console.log( xform );

                var circle = g.circle(0, 0, 7);
                circle.attr({transform: xform, stroke:"black", "stroke-width":0.8, fill:"white", opacity:0.7});

                //roadSvg.attr({transform: xform, stroke:"black", "stroke-width":0.3, fill:"white", "font-size":14, opacity:1, "stroke-opacity":1, "text-anchor":"middle", "dominant-baseline":"mathematical"});
                //hexSvg.add( roadSvg );
                //console.log( roadSvg );
            }
        }
    };

    this.setHexClass = function( absX, absY, className ){
        var hexSvg = getHexSvgByAbsCoords( absX, absY );
        if (hexSvg){
        //console.log( hexSvg );
        hexSvg.addClass( className );
        }
    };
    this.removeHexClass = function( absX, absY, className ){
        var hexSvg = getHexSvgByAbsCoords( absX, absY );
        if (hexSvg){
            hexSvg.removeClass( className );
        }
    };
    this.removeAllHexClasses = function( absX, absY ){
        var hexSvg = getHexSvgByAbsCoords( absX, absY );
        if (hexSvg){
            hexSvg.node.className.baseVal="";//strip all class descriptors from object...
        }
    };

    this.getHexCenterPoint=function( absX, absY ){
        // RETURN BOUNDING BOX (IN ABSOLUTE COORDS) FOR THE HEX DEFINED BY ABSOLUTE COORDS absX AND absY....
        var mapOffset = GameStateService.getMapOffset();
        mapOffset = _that.getHexMapTransformPos();// HOW FAR IS THE HEX MAP ORIGIN SHIFTED OVER? (NEEDS TO BE ADDED TO THE HEX POSITION)...
        var hex = getHexSvgByAbsCoords( absX, absY );
        if (hex){
            var bbox = hex.getBBox();
            var x = bbox.cx + mapOffset.x;
            var y = bbox.cy + mapOffset.y;
            return new Point( x,y);
        }
        return null;// didn't find it...
    };

    // GET THE X, Y ABS POSITION OF THIS SVG HEX....
    this.getAbsolutePositionFromHexSvg = function( hexSvg ){
        var scrollColumnsX = _that.getScrollPos().x + 1;
        var scrollColumnsY = _that.getScrollPos().y;
        //console.log( "scrollColumnsY: " + scrollColumnsY );
        var absX = hexSvg.data("hexSvgX") + scrollColumnsX*4; // absolute x coordinate...
        var absY = hexSvg.data("hexSvgY") + scrollColumnsY ;  // absolute y coordinate....   
        return new Point(absX, absY);     
    };


    var hexSize = GameStateService.getHexSize();
    var mapHexDim = GameStateService.getMapSizeInHexes();
    for (var x=0; x<mapHexDim.x; x++){
        for (var y=0; y< mapHexDim.y; y++){
            var coords = HexService.getCornerArray( new Point(hexSize * 2 , hexSize * 2 ), new Point(x, y) );
            var hexSvg = hexGroupSvg.polyline( coords );
            hexSvg.data("hexSvgX", x );//local hex coords...
            hexSvg.data("hexSvgY", y );//local hex coords....
            hexSvg.attr({"id": "hexSvg_" + x + "_" + y });
            //hexSvg.addClass("defaultHex");
            var classNames = MapDataService.getHexClassNames( x, y );
            for (var c=0; c<classNames.length; c++){
                var className = classNames[c];
                hexSvg.addClass( className );
            }
            //hexSvg.hover( HexService.hexHoverIn, HexService.hoverOut );
            hexSvg.click( HexService.click );
            hexSvg.dblclick( _hexDblClick );
            gHexSvgArray.push( hexSvg );
        }
    }
});// end HexService....






















