
appModule.service('MapRoutingService', function( CounterDataService, GameStateService, TerrainService, HexService, MapDataService ){
    // USE AN ARRAY OF MAP TO DETERMINE MP COSTS, ETC...
    // costObj = { x:x, y:y, totalCostToEnter:MP_COST_FOR_TERRAIN_AND_HEXSIDE, startingHex:BOOL, mpLeft:NUMBER, fromHex{x:x, y:y}, isTraffic:BOOL, isStopEngagment:{}, enemyZoc:{}, supportAvZoc:{}, realAvZoc:{}....}
    var _that = this;

    var _getBlankRouteArray = function(){
        // create array with dimensions of entire map...
        var arr = new Array( GameStateService.getGameSizeInHexes().x );
         for (var x=0;x<arr.length; x++){
            arr[x] = new Array( GameStateService.getGameSizeInHexes().y );
            for (var y=0; y<arr[x].length; y++){
                arr[x][y] = {"x":x, "y":y, "cost":999, movementAllowance:0 };
            }
        }
        return arr;       
    };

    this.getMovementCostArray = function( unit, absHexStartPt){

    // TEST THIS FUNCTION HERE...
    _that.testMSRTraceRoute( new Point(0,1), new Point(absHexStartPt.x,absHexStartPt.y));  

        var startX = absHexStartPt.x;
        var startY = absHexStartPt.y;

        var movementType = unit.getMovementType();
        console.log( movementType );
        var movementAllowance = 14;

        var costArr = _getBlankRouteArray();
        var neigborCoordsArr = HexService.getNeighborCoords( absHexStartPt );
        var origCostObj = costArr[startX][startY];
        origCostObj.startingHex = true; // MARK WHICH IS STARTING HEX...
        origCostObj.cost = 0;
        origCostObj.movementAllowance = movementAllowance;
        console.log( origCostObj );


        var zocArr = _that.getZOCArrayForFaction( "GERMAN" );

        // AV UNITS MUST STOP IN AV ZOC
        // AV UNITS MUST ENGAGE REAL AV IN ZOC
        // AV MAY ENGAGE SUPPORT AV, BUT CAN'T LIFT STOP UNLESS ALL AV IS GONE. [6.0i]

        // TRUCK UNITS MUST STOP IN AN ENGAGEMENT ZONE [6.1c]
        // HQ CAN NOT MOVE INTO ENG. ZONE
        // MSR CAN NOT PASS THROUGH ENG. ZONE
        for (var n=0; n<neigborCoordsArr.length; n++){
            var nX = neigborCoordsArr[n].x;
            var nY = neigborCoordsArr[n].y;


            var costObj = costArr[ nX ][ nY ]; //write results here...
            //get map data....
            var terrainCost = TerrainService.getBaseTerrainCost( movementType, neigborCoordsArr[n] );
            var terrainType = MapDataService.getTerrainTypesForHex( nX, nY );
            costObj.terrainType = terrainType;

            var zocData = zocArr[ nX ][ nY ];
            var isEZOC = zocData.enemyZOC;
            costObj.enemyZOC = isEZOC;
            if( isEZOC && (movementType=="LEG" || movementType=="TRUCK")){
                costObj.stop = true;
            }


            if (terrainCost=="PROHIB"){
                costObj.cost = 999;
                costObj.movementAllowance = 0;
                costObj.prohibTerrain = true;
            }
            if (terrainCost=="STOP"){
                costObj.stop = true;
                costObj.cost = terrainCost;//USE REMAINING MOVEMENT POINTS TO MOVE HERE....
                costObj.movementAllowance = 0;
            }
            if (terrainCost=="ALL"){

            }
            if (terrainCost<costObj.cost ){
                costObj.cost = terrainCost;
                costObj.movementAllowance = origCostObj.movementAllowance-terrainCost;
            }
            console.log( costObj );
        }
    };



    // TEST FUNCTION - SEE IF WE CAN ROUTE FROM TRACE SUPPLY HEX TO COMBAT TRAINS....
    // DON'T WORRY ABOUT ZOC FOR NOW, ONLY THE ROADS....
    this.testMSRTraceRoute = function( startCoords, endCoords ){
        // RETURNS A LIST OF OBJECTS {x:X, y:Y, routeLength:INTEGER} THAT ROUTES FROM END COORDS TO START COORDS ALONG PRIMARY AND SECONDARY ROADS....
        console.log( "TESTING MSR ROUTE");
        var finalRouteArray = _getBlankRouteArray();
        var startObj = finalRouteArray[startCoords.x][startCoords.y];
        // MARK AS BEGINNING OF TRACE
        startObj.routeLength = 0;
        startObj.routeOK = true; // USE THIS PROPERTY TO SHOW ROUTE CAN PASS THROUGH THIS HEX...

        var foundValidRoute = false;
        var finalRouteList = [];//store a list of all the routeObjects that trace from destination to source....

        var _createFinalRouteArray = function( destRouteObj ){
            finalRouteList.push( destRouteObj );
            if (destRouteObj.mainSupplyRouteFrom ){
                var prevRouteObj = finalRouteArray[destRouteObj.mainSupplyRouteFrom.x][destRouteObj.mainSupplyRouteFrom.y];
                _createFinalRouteArray( prevRouteObj );
            }
        };

        var _iterateMSRTrace = function( routeObjArr, curRouteLength ){ //srcRouteObj is the hex we're coming from, routeObjArr are the hexes to check...
            if (foundValidRoute) return;
            var newRouteLength = curRouteLength + 1;
            for (var x=0; x<routeObjArr.length; x++){
                var routeObj = routeObjArr[x];
                // PERFORM CHECK FOR EZOC AND ENGAGEMENT ZONES HERE....
                // IF OK, MARK HEX AND GOOD AND GET NEIGHBORS...
                routeObj.routeOk = true;
                routeObj.routeLength = newRouteLength;
                delete routeObj.cost;
                delete routeObj.movementAllowance;
                if (routeObj.x==endCoords.x && routeObj.y==endCoords.y){
                    // WE FOUND A VALID ROUTE...
                    foundValidRoute = true;
                    _createFinalRouteArray( routeObj );
                }
                var hexesToCheck = _getNeighborsConnectedByPrimaryOrSecondaryRoads( routeObj );
                _iterateMSRTrace( hexesToCheck, newRouteLength );
            }
        };

        var _getNeighborsConnectedByPrimaryOrSecondaryRoads = function( srcHexObj ){
            var returnArr = [];
            var neigborCoordsArr = HexService.getNeighborCoords( new Point(srcHexObj.x, srcHexObj.y) );
            var primaryRoadSides = MapDataService.getPrimaryRoadSides(srcHexObj.x, srcHexObj.y);
            var secondaryRoadSides = MapDataService.getSecondaryRoadSides(srcHexObj.x, srcHexObj.y);
            for (var x=0; x<6; x++){
                var doesSideHavePrimaryOrSecondaryRoad = false;
                if ( primaryRoadSides.indexOf(  x )>-1) doesSideHavePrimaryOrSecondaryRoad = true;
                if (secondaryRoadSides.indexOf( x )>-1) doesSideHavePrimaryOrSecondaryRoad = true;
                if( doesSideHavePrimaryOrSecondaryRoad ){
                    var neigborCoords = neigborCoordsArr[x];
                    var routeRow = finalRouteArray[neigborCoords.x];
                    if (!routeRow) break;
                    var routeObj = finalRouteArray[neigborCoords.x][neigborCoords.y];
                    if (routeObj && routeObj.routeOk==undefined){ //only process hexes that have not yet been processed.... 
                        routeObj.mainSupplyRouteFrom={x: srcHexObj.x, y:srcHexObj.y };
                        returnArr.push( routeObj );// push the neighbor with a road leading into it....
                    }
                }//end if....
            }// end for x....
            return returnArr;
        };//end function....
        var hexesToCheck = _getNeighborsConnectedByPrimaryOrSecondaryRoads( startObj );
        _iterateMSRTrace( hexesToCheck, 0 );

        console.log( finalRouteList );
        return finalRouteList;
    };



    this.getZOCArrayForFaction = function( faction ){
        // GET ALL ZOC HEXES ON THE MAP....
        // RETURN 2d ARRAY OF OBJECTS WHERE EACH OBJECT HAS: {x:X, y:Y, enemyZOC:BOOL, enemyCounter:BOOL }
        // LEG OR TRUCK MA MUST STOP IN EZOC....
        // HQ CAN NEVER MOVE INTO EZOC...
        // UNITS MAY LEAVE EZOC, BUT MAY NOT GO FROM ONE EZOC TO ANOTHER...
        //console.log( "HERE");
        var zocArr = _getBlankRouteArray();
        for (var x=0;x<zocArr.length; x++){
            for (var y=0; y<zocArr[x].length; y++){
                var dataObj = zocArr[x][y];
                var counterIds = MapDataService.getCountersInHex( x, y );
                for (var ci=0; ci<counterIds.length; ci++){
                    var id = counterIds[ci];
                    var unit = CounterDataService.getUnit( id );
                    var isUnitInFaction = unit.getFaction()==faction;
                    if (isUnitInFaction){
                        console.log( unit );
                        console.log( id + " " + isUnitInFaction  );
                        dataObj.enemyCounterId = id;
                        dataObj.enemyCounter = true;
                        console.log( dataObj );
                        if (unit.hasZoneOfControl()){
                            dataObj.enemyZOC = true;
                            var neigborCoords = HexService.getNeighborCoords( new Point( x, y) );
                            for (var n=0;n<neigborCoords.length;n++){
                                var obj = zocArr[ neigborCoords[n].x ][ neigborCoords[n].y ];
                                obj.enemyZOC = true;
                                //console.log( obj );
                            }
                        }
                    }
                }
            }
        }
        return zocArr;
    };//end function....
});



