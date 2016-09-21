

appModule.service('MapDataService', function( GameStateService ){
    // REPRESENT A MAP IN ABSOLUTE COORDINATES (0 represents top/left)...
    // each hex has an id in the format "hex_x_y"...
    var _that = this;
    var _mapRawData = [
        // {mapLabel:"A_0_34", primaryRoad:[2,5], rail:[2,5]},
        // {mapLabel:"A_0_32", terrain:["FOREST"], classList:["hilightHex"] },
                // {mapLabel:"A_0_30", secondaryRoad:[1,2] }
        {"mapLabel":"A_0_34","primaryRoad":[2,5],"rail":[2,5],"classList":["defaultHex"]},
        {"mapLabel":"A_0_32","terrain":["WOODS"],"classList":["woodsHex"]},
        {"mapLabel":"A_0_30","secondaryRoad":[1,2],"classList":["defaultHex"]},
        {"mapLabel":"A_2_32","primaryRoad":[2,5],"secondaryRoad":[1,3],"classList":["defaultHex"]},

        {"mapLabel":"A_3_32","primaryRoad":[2,5],"classList":["defaultHex"]},
        {"mapLabel":"A_4_31","primaryRoad":[3,5],"classList":["defaultHex"]},
        {"mapLabel":"A_4_30","primaryRoad":[0,2],"classList":["defaultHex"]},
        {"mapLabel":"A_0_27","classList":["defaultHex","rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_0_26","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_0_24","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_0_21","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_0_18","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_0_17","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_0_16","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_0_13","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_0_12","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_0_11","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_0_8","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_0_2","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"B_0_23","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_1_34","primaryRoad":[3,5],"railRoad":[2,5],"classList":["defaultHex"]},
        {"mapLabel":"A_1_33","terrain":["WOODS"], "primaryRoad":[0,2], "classList":["woodsHex"]},
        {"mapLabel":"A_1_28","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_1_27","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_1_25","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_1_22","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_1_19","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_1_18","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_1_17","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_1_16","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_1_14","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_1_13","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_1_12","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_1_11","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_1_9","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_1_8","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"B_1_23","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_2_27","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_2_25","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_2_24","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_2_22","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_2_21","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_2_19","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_2_16","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_2_14","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_2_12","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_2_11","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_2_9","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_2_8","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_2_5","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"B_2_21","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"B_2_20","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"B_2_19","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_3_28","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_3_27","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_3_26","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_3_25","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_3_23","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_3_22","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_3_21","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_3_20","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_3_17","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_3_16","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_3_14","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_3_13","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_3_12","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_3_11","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_3_10","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_3_9","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_3_6","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"B_3_34","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"B_3_20","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_4_27","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_4_26","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_4_25","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_4_24","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_4_23","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_4_22","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_4_21","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_4_20","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_4_19","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_4_18","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_4_17","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_4_16","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_4_14","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_4_13","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_4_12","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_4_11","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_4_10","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_4_9","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_4_8","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_4_6","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_5_31","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_5_30", "primaryRoad":[2, 5], "classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_5_29","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_5_28","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_5_27","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_5_26","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_5_25","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_5_24","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_5_23","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_5_20","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_5_19","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_5_18","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_5_17","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_5_16","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_5_14","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_5_13","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_5_12","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_5_11","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_5_10","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_5_9","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_5_6","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_5_5","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_6_33","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_6_32","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_6_31","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_6_30","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_6_29","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_6_27","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_6_26","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_6_25","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_6_24","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_6_23","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_6_22","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_6_20","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_6_19","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_6_18","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_6_17","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_6_16","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_6_15","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_6_14","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_6_13","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_6_12","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_6_11","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_6_10","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_6_9","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_6_8","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_6_6","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_6_5","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_7_30","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_7_29","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_7_28","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_7_27","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_7_26","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_7_25","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_7_24","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_7_23","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_7_21","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_7_20","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_7_19","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_7_18","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_7_17","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_7_16","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_7_15","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_7_14","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_7_12","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_7_10","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_7_9","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_7_6","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"B_7_22","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"B_7_21","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_8_30","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_8_29","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_8_28","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_8_27","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_8_26","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_8_25","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_8_24","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_8_23","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_8_21","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_8_20","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_8_19","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_8_18","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_8_17","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_8_16","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_8_15","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_8_14","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_8_13","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_8_9","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_8_8","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_8_5","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_8_4","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"B_8_21","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"B_8_20","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_9_30","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_9_29","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_9_28","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_9_25","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_9_24","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_9_23","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_9_22","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_9_21","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_9_20","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_9_19","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_9_18","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_9_16","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_9_15","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_9_14","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_9_13","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_9_9","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_9_8","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_9_7","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_9_6","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_9_5","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"B_9_21","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_10_33","terrain":["WOODS"],"classList":["woodsHex"]},
        {"mapLabel":"A_10_30","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_10_29","primaryRoad":[1,3], "classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_10_28","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_10_27","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_10_26","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_10_25","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_10_24","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_10_23","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_10_22","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_10_21","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_10_20","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_10_12","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_10_11","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_10_10","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_10_8","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_10_7","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_10_6","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_11_28","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_11_27","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_11_25","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_11_23","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_11_22","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_11_21","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_11_12","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_11_11","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_11_10","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_11_9","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_12_30","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_12_28","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_12_27","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_12_26","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_12_25","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_12_9","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_12_8","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"B_12_21","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_13_31","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_13_29","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_13_28","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_13_27","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_13_22","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_14_32","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_14_31","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_14_30","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_14_29","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_14_28","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_14_27","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_14_26","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_14_24","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_14_19","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_15_34","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_15_32","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_15_31","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_15_30","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_15_29","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_15_28","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_15_25","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_16_32","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_16_31","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_16_30","classList":["rollingHex"],"terrain":["ROLLING"]},
        {"mapLabel":"A_16_29","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_16_28","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_16_25","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_17_34","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_17_32","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_17_31","classList":["slopeHex"],"terrain":["SLOPE"]},
        {"mapLabel":"A_17_30","classList":["forestHex"],"terrain":["FOREST"]},
        {"mapLabel":"A_17_19","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_18_34","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_18_33","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_20_34","classList":["woodsHex"],"terrain":["WOODS"]},
        {"mapLabel":"A_21_35","classList":["woodsHex"],"terrain":["WOODS"]}

    ];
    var _mapColumnsRows2dArray = new Array( GameStateService.getGameSizeInHexes().x );

    var _initService = function(){
        for (var x=0;x<_mapColumnsRows2dArray.length; x++){
            _mapColumnsRows2dArray[x] = new Array( GameStateService.getGameSizeInHexes().y );
            for (var y=0; y<_mapColumnsRows2dArray[x].length; y++){
                //var id = _convertCoordsToId( x, y );
                var mapLabel = _convertCoordsToMapHexLabel( x, y );
                _mapColumnsRows2dArray[x][y] = {"mapLabel":mapLabel, "x":x, "y":y, "counterArray":[], "classList":["defaultHex"] };
            }
        }

        // LOAD _mapRawData AND ADD x, y COORDS....
        for (var x=0; x<_mapRawData.length; x++){
            var mapHexData = _mapRawData[x];
            var mapHexLabel = mapHexData.mapLabel;
            var absCoords = _convertMapHexLabelToCoords( mapHexLabel );
            mapHexData.x = absCoords.x;
            mapHexData.y = absCoords.y;
            if (!mapHexData.classList){
                mapHexData.classList=["defaultHex"];//include the default class of "defaultHex" if no class otherwise defined....
            }
            mapHexData.counterArray=[];//add empty counterId array...
            _mapColumnsRows2dArray[mapHexData.x][mapHexData.y] = mapHexData;
        }
        //_dumpDataToConsole();
    };

    var _dumpDataToConsole = function(){
        var arr = [];
        for (var x=0;x<_mapColumnsRows2dArray.length; x++){
            for (var y=0; y<_mapColumnsRows2dArray[x].length; y++){
                var data = _mapColumnsRows2dArray[x][y];
                var toShow = false;
                if (data.terrain ) toShow=true;
                if (data.primaryRoad) toShow = true;
                if (data.secondaryRoad) toShow = true;
                if (toShow){
                    var clone = $.extend(true, {}, data );
                    delete clone.counterArray;
                    //delete clone.classList;
                    delete clone.x;
                    delete clone.y;
                    arr.push( clone );
                }
            }
        } 
        var CR = '\r';
        var output = "[";
        for (var x=0; x<arr.length; x++){
            output += JSON.stringify( arr[x] );
            if (x<(arr.length-1)){
                output+="," + CR;
            }
        }       
        output += "]" + CR + CR;
        console.log( output );
        window.prompt("Copy to clipboard: Ctrl+C", output);
    };


    var _convertMapHexLabelToCoords = function( hexLabel ){
        var strArr = hexLabel.split("_");
        var mapLetter = strArr[0];
        var absX = parseInt( strArr[1]);
        var absY = parseInt( strArr[2]);
        absY = 35-absY;
        if (mapLetter =="B" || mapLetter=="D"){
            absY += 34;
        }
        if (mapLetter =="C" || mapLetter=="D"){
            absX += 62;
        }
        return new Point( absX, absY );
    };

    var _convertCoordsToMapHexLabel = function(absX, absY ){
        var mapLetters = ["A", "B", "C", "D"];
        var letterIndex = 0;//"A"...
        if (absY>34){
            letterIndex++; // map B or D...
            absY-=34;
        }
        if (absX>62){
            letterIndex+=2; // map C or D...
            absX-=62;
        }
        absY = 35-absY;
        return mapLetters[ letterIndex ] + "_" + absX + "_" + absY;
    };

    // var mapLabel = _convertCoordsToMapHexLabel( 1, 35 );
    // var coords = _convertMapHexLabelToCoords( mapLabel );
    // console.log( mapLabel + " " + coords.x + ", " + coords.y );

    var _convertCoordsToId = function( absX, absY ){
        // given coordinates, return a valid hex id....
        return "hex_" + absX + "_" + absY;
    };

    var _convertIdToPoint = function( hexId ){
        // expected format of hexId = "hex_x_y"....
        var strArr = hexId.split("_");
        var x = parseInt(strArr[1]);
        var y = parseInt(strArr[2]);
        return new Point(x,y);
    };


    var _getMapDataByPosition = function( absX, absY ){
        if (GameStateService.getGameSizeInHexes().x>absX && GameStateService.getGameSizeInHexes().y>absY && absX>-1 && absY>-1 ){
            return _mapColumnsRows2dArray[absX][absY];
        }
        return null;
    };


    var _getMapDataByHexId = function(hexId){
        var coordPt = _convertIdToPoint( hexId );
        return _getMapDataByPosition( coordPt.x, coordPt.y );  
    }

    var _isCounterInHex = function( counterId, hexInfo ){
        if (hexInfo.counterArray ){
            for (var x=0; x<hexInfo.counterArray.length; x++){
                var cntId = hexInfo.counterArray[x];
                if (cntId === counterId ) return true;
            }
        }
        return false;
    };

    var _getCounterIndexInHex = function( counterId, hexInfo ){
        if (hexInfo.counterArray ){
            for (var x=0; x<hexInfo.counterArray.length; x++){
                var cntId = hexInfo.counterArray[x];
                if (cntId === counterId ) return x;
            }
        }
        return -1;
    };

    this.addCounterToHex = function( counterId, absX, absY ){
        var hexInfo = _getMapDataByPosition( absX, absY );
        if (hexInfo && hexInfo.counterArray && !_isCounterInHex(counterId, hexInfo) ){
            hexInfo.counterArray.push( counterId );
            //console.log("CONFIRM HEX NOW HAS THE UNIT....");
            //console.log( hexInfo ); //should show the counter....
            return hexInfo.id;
        }
    };

    this.removeCounterFromHex = function( counterId, absX, absY ){
        var hexInfo = _getMapDataByPosition( absX, absY );
        //console.log( hexInfo );
        if (hexInfo && hexInfo.counterArray && _isCounterInHex(counterId, hexInfo) ){
            var index = _getCounterIndexInHex( counterId, hexInfo );
            hexInfo.counterArray.splice( index, 1 );//remove the counter id from the counter list...
            //console.log("CONFIRM UNIT IS GONE FROM HEX...");
            //console.log(hexInfo);
        }
        else{
            console.log( "UNABLE TO FIND " + counterId + " IN " + absX + ", " +absY );
        }
    };

    this.getIndexOfCounterInHex = function( counterId, absX, absY ){
        var hexInfo = _getMapDataByPosition(absX, absY);
        return _getCounterIndexInHex( counterId, hexInfo );
    };

    this.getCountersInHex = function( absX, absY ){
        var hexInfo = _getMapDataByPosition(absX, absY);
        return hexInfo.counterArray;       
    }

    this.hexHasClass = function( absX, absY, className ){
        var hexData = _getMapDataByPosition(absX, absY);
        var classPos = -1;
        var hexData = _mapColumnsRows2dArray[absX][absY];
        if (hexData && hexData.classList ){
            for (var x=0;x<hexData.classList.length; x++){
                var cn = hexData.classList[x];
                if (cn==className) classPos = x;
            }
        }
        if (classPos>-1){
            return true;
        }
        return false;
    };
    this.addHexClass = function( absX, absY, className, bRemoveAllOthers ){
        if (bRemoveAllOthers){
            _that.clearHexClasses( absX, absY );
        }
        var hexData = _getMapDataByPosition(absX, absY);
        if (hexData && !_that.hexHasClass( absX, absY, className )){
            hexData.classList.push( className );
        }
    };
    this.removeHexClass = function( absX, absY, className ){
        var classPos = -1;
        var hexData = _getMapDataByPosition(absX, absY);
        if (hexData ){
            for (var x=0;x<hexData.classList.length; x++){
                var cn = hexData.classList[x];
                if (cn==className) classPos = x;
            }
        }
        if (classPos>-1){
            hexData.classList.splice(classPos,1);//remove found item....
        }
    };  
    this.clearHexClasses = function( absX, absY ){
        var hexData = _getMapDataByPosition(absX, absY);
        if (hexData){
            hexData.classList=[];
        }
    };  
    this.getHexClassNames = function( absX, absY ){
        var returnArr = [];
        var hexData = _getMapDataByPosition(absX, absY);
        if (hexData && hexData.classList ){
            returnArr = hexData.classList;
        }
        //console.log( absX + ", " + absY + " " + returnArr.length);
        return returnArr;
    };   

    this.getTerrainTypesForHex = function( absX, absY ){
        var hexData = _getMapDataByPosition( absX, absY );
        if (!hexData){
            return "PROHIB";
        }
        else if (!hexData.terrain){
            return "OPEN"; // RETURN OPEN TERRAIN BY DEFAULT IF TERRAIN NOT DEFINED....
        }
        else {
            return hexData.terrain[0];
        }
    };

    this.getTerrainTypesForHexSide = function( absX, absY, sideIndex ){
        var returnArr = [];
        var hexData = _getMapDataByPosition( absX, absY );
        var _isSideIncluded = function( sideArr ){
            if (!sideArr || !sideArr.length ) return false;
            for (var x=0;x<sideArr.length;x++){
                if (sideArr[x]==sideIndex ) return true;
            }
            return false;
        }
        if (!hexData) return ["PROHIB"];

        if (_isSideIncluded( hexData.primaryRoad )){
            returnArr.push("PRIMARY_ROAD");
        }
        if (_isSideIncluded( hexData.secondaryRoad )){
            returnArr.push("SECONDARY_ROAD");
        }
        return returnArr;
    };


    this.getPrimaryRoadSides=function( absX, absY ){
        var hexData = _getMapDataByPosition( absX, absY );
        if (hexData && hexData.primaryRoad) return hexData.primaryRoad;
        return []; // no primary roads for this hex...
    };
    this.getSecondaryRoadSides=function( absX, absY ){
        var hexData = _getMapDataByPosition( absX, absY );
        if (hexData && hexData.secondaryRoad) return hexData.secondaryRoad;
        return []; // no primary roads for this hex...
    };
    this.getTrackRoadSides=function( absX, absY ){
        var hexData = _getMapDataByPosition( absX, absY );
        if (hexData && hexData.track) return hexData.track;
        return []; // no primary roads for this hex...
    };
    this.getRailRoadSides=function( absX, absY ){
        var hexData = _getMapDataByPosition( absX, absY );
        if (hexData && hexData.railRoad) return hexData.railRoad;
        return []; // no primary roads for this hex...
    };


    this.setHexAsForest = function( absX, absY ){
        var hexId = _convertCoordsToMapHexLabel( absX, absY );
        var result = window.prompt( hexId + ": W,F,H,M,C P,S,R D").toUpperCase();

        var _getSideArr = function( str ){
            var sideArr = [];
            for (var x=1; x<str.length; x++){
                var ch = str[x];
                var i = parseInt( ch );
                if (i.toString() == ch ){
                    sideArr.push( i );
                }
            }
            return sideArr;
        }
        if (result.length<1) return;
        if (result[0]=="W"){
            _that.addHexClass( absX, absY, "woodsHex", true);
            var mapData = _mapColumnsRows2dArray[absX][absY];
            //if (!mapData.terrain) mapData.terrain = [];
            mapData.terrain=["WOODS"];
        }
        if (result[0]=="F"){
            _that.addHexClass( absX, absY, "forestHex", true);
            var mapData = _mapColumnsRows2dArray[absX][absY];
            //if (!mapData.terrain) mapData.terrain = [];
            mapData.terrain=["FOREST"];
        }
        if (result[0]=="H"){
            _that.addHexClass( absX, absY, "rollingHex", true );
            var mapData = _mapColumnsRows2dArray[absX][absY];
            //if (!mapData.terrain) mapData.terrain = [];
            mapData.terrain=["ROLLING"];
        }
        if (result[0]=="M"){
            _that.addHexClass( absX, absY, "slopeHex", true);
            var mapData = _mapColumnsRows2dArray[absX][absY];
            //if (!mapData.terrain) mapData.terrain = [];
            mapData.terrain=["SLOPE"];
        }
        if (result[0]=="C"){
            _that.addHexClass( absX, absY, "defaultHex", true);
            var mapData = _mapColumnsRows2dArray[absX][absY];
            //if (!mapData.terrain) mapData.terrain = [];
            delete mapData.terrain;
        }        
        if (result[0]=="P"){
            var mapData = _mapColumnsRows2dArray[absX][absY];
            mapData.primaryRoad=_getSideArr( result );
        }        
        if (result[0]=="S"){
            var mapData = _mapColumnsRows2dArray[absX][absY];
            mapData.secondaryRoad=_getSideArr( result );
        } 
        if (result[0]=="R"){
            var mapData = _mapColumnsRows2dArray[absX][absY];
            mapData.railRoad=_getSideArr( result );
        }         
        if (result[0]=="D"){
            _dumpDataToConsole();
        }
    };



    _initService();
    
});
