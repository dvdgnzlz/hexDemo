
appModule.service('TerrainService', function( MapDataService ){
    // LOOKUP MOVEMENT COST FOR A HEX GIVEN THE MOVEMENT TYPE OF THE UNIT INVOLVED....
    var _terrainData = {};
    _terrainData.OPEN = {"LEG":1, "TACTICAL":2, "TACTICAL_FROZEN":1, "TRUCK":2 };

    // THE FOLLOWING OVERRIDE THE HEX/HEXSIDE COST 
    _terrainData.PRIMARY_ROAD = {"LEG":0.5, "TACTICAL":0.5, "TRUCK":0.25 };
    _terrainData.SECONDARY_ROAD = {"LEG":0.5, "TACTICAL":0.5, "TRUCK":0.5 };
    _terrainData.TRACK =  {"LEG":0.5, "TACTICAL":1, "TRUCK":1 };
    _terrainData.RR =     {"LEG":1, "TACTICAL":2, "TRUCK":2 };

    _terrainData.WOODS =  {"LEG":1, "TACTICAL":"STOP", "TRUCK":"STOP", "COMBAT_TERRAIN":true, "BLOCKS_LOS":true };
    _terrainData.FOREST = {"LEG":2, "TACTICAL":"STOP", "TRUCK":"STOP", "COMBAT_TERRAIN":true, "BLOCKS_LOS":true };
    _terrainData.MARSH =  {"LEG":"ALL", "TACTICAL":"PROHIB", "TRUCK":"PROHIB", "COMBAT_TERRAIN":true };
    _terrainData.ROLLING ={"LEG":1, "TACTICAL":3, "TACTICAL_FROZEN":2, "TRUCK":4, "TRUCK_FROZEN":3, "COMBAT_TERRAIN":true, "BLOCKS_LOS":true };
    _terrainData.SLOPE =  {"LEG":1, "TACTICAL":"PROHIB", "TRUCK":"PROHIB", "COMBAT_TERRAIN":true, "BLOCKS_LOS":true };
    
    _terrainData.POINT_OF_INTEREST =  {"LEG":"OT", "TACTICAL":"OT", "TRUCK":"OT" };
    _terrainData.VILLAGE =  {"LEG":"OT", "TACTICAL":"OT", "TRUCK":"OT", "COMBAT_TERRAIN":true, "BLOCKS_LOS":true };
    _terrainData.CITY =  {"LEG":"OT", "TACTICAL":"OT", "TRUCK":"OT", "COMBAT_TERRAIN":true, "BLOCKS_LOS":true, "SITUATIONAL_TERRAIN":true};
    // THE FOLLOWING HEXSIDE EFFECTS ARE ADDITIVE TO ABOVE...
    _terrainData.FORD_HEXSIDE =  {"LEG":1, "TACTICAL":2, "TRUCK":3, "COMBAT_TERRAIN":true, "BLOCKS_LOS":false, "SITUATIONAL_TERRAIN":false};
    _terrainData.MAJOR_RIVER_HEXSIDE =  {"LEG":"ALL", "TACTICAL":"PROHIB", "TRUCK":"PROHIB", "COMBAT_TERRAIN":true, "BLOCKS_LOS":false, "SITUATIONAL_TERRAIN":true};
    _terrainData.RIVER_HEXSIDE =        {"LEG":2,     "TACTICAL":"PROHIB", "TRUCK":"PROHIB", "COMBAT_TERRAIN":true, "BLOCKS_LOS":false, "SITUATIONAL_TERRAIN":true};
    _terrainData.STREAM_HEXSIDE =       {"LEG":1, "TACTICAL":1, "TRUCK":4, "COMBAT_TERRAIN":true, "BLOCKS_LOS":false, "SITUATIONAL_TERRAIN":false};
    
    _terrainData.WEST_WALL_ALLIED =   {"LEG":"STOP", "TACTICAL":"STOP", "TRUCK":"STOP"};
    _terrainData.WEST_WALL_GE =       {"LEG":"OT", "TACTICAL":"OT", "TRUCK":"OT", "COMBAT_TERRAIN":true, "BLOCKS_LOS":false, "SITUATIONAL_TERRAIN":true};

    this.getBaseTerrainCost = function( movementType, destHexPt ){
        // RETURNS MP (number), or "STOP", or "PROBHIB", or "OT"
        var terrainType = MapDataService.getTerrainTypesForHex( destHexPt.x, destHexPt.y );
        //console.log(terrainType);
        var terrainData = _terrainData[terrainType];
        return (terrainData[movementType]);

        return "PROHIB"; // IF WE CANT FIND THE HEX, PREVENT MOVEMENT....
    };



    this.getRoadCost = function( moveType, destHexPt, sideIndex ){
        // moveType = "LEG", "TACTICAL", or "TRUCK"....
        // returns null if no road cost....
        var sides = MapDataService.getTerrainTypesForHexSide( destHexPt.x, destHexPt.y, sideIndex );
        if (sides.indexOf( "PRIMARY_ROAD" )>-1){
            return _terrainData.PRIMARY_ROAD[ moveType ];
        }
        if (sides.indexOf( "SECONDARY_ROAD" )>-1){
            return _terrainData.SECONDARY_ROAD[ moveType ];
        }
        if (sides.indexOf( "TRACK" )>-1){
            return _terrainData.TRACK[ moveType ];
        }
        if (sides.indexOf( "RR" )>-1){
            return _terrainData.RR[ moveType ];
        }
        return null;
    };

});
