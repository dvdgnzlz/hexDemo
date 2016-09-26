
appModule.service('CounterDataService', function( $rootScope, HttpService, WebSocketService ) {
    var _that = this;
    // SET UP COUNTERS FOR THE GAME....
    var _counterDataArr = [];
    var _unitsById = {}; // store value under key of id....
    // _counterDataArr.push( { id:"CTR_UNIT_29_ARM", faction: "ALLIES", country:"US", class:"US_COUNTER", logoId:"oArmorLogo",
    //     label:"23 Hus", formation:"2 Arm", maxSteps:6, 
    //     curSteps: 6, unitType:"Armor", side:0,
    //     sides:[
    //         {assault:true, AV:5, AR: 4, RNG:2, MA:16, moveType:"TACTICAL"}
    //     ],
    //     hexX:4, hexY: 3 } );
    // _counterDataArr.push( { id:"CTR_UNIT_30_ARM", faction: "ALLIES", country:"UK", class:"UK_COUNTER", logoId:"oInfantryLogo", xxxisSelected:true,
    //     label:"II/753", formation:"29 Arm", maxSteps:6, 
    //     curSteps: 6, unitType:"Armor", side:0,
    //     sides:[
    //         {assault:true, AV:3, AR: 4, RNG:2, MA:14, moveType:"TACTICAL"}
    //     ],
    //     hexX:5, hexY: 3 } );
    // // HQ 
    // _counterDataArr.push( { id:"CTR_HQ_2_ARM", faction: "ALLIES", country:"US", class:"US_COUNTER", logoId:"oHQLogo",
    //     label:"HQ", formation:"2 Arm", maxSteps:0, 
    //     curSteps: 0, unitType:"HQ", side:0,
    //     sides:[
    //         {assault:false, CR:5, MA:14, moveType:"TRUCK"}
    //     ],
    //     hexX:2, hexY: 3} );   
    // // COMBAT TRAIN
    // _counterDataArr.push( { id:"CTR_TRAIN_2_ARM", faction: "ALLIES", country:"US", class:"US_COUNTER", logoId:"oTrainLogo",
    //     label:"TRAIN", formation:"2 Arm", maxSteps:0, 
    //     curSteps: 0, unitType:"COMBAT_TRAIN", side:0,
    //     sides:[
    //         {ghost:false},{ghost:true}
    //     ],
    //     hexX:1, hexY: 1} );  
    // _counterDataArr.push( { id:"CTR_UNIT_HOLZ", faction: "GERMAN", country:"GE", class:"GE_COUNTER", 
    //     label:"Holz", formation:"29 Arm", maxSteps:6, 
    //     curSteps: 5, unitType:"Armor", side:0,
    //     sides:[
    //         {assault:false, AV:2, AR: 4, RNG:2, MA:14, moveType:"TACTICAL"}
    //     ],
    //     hexX:5, hexY: 5} );    

    // _counterDataArr.push( { id:"CTR_UNIT_32_ARM", faction: "ALLIES", country:"US", class:"US_COUNTER", logoId:"oArmInfLogo",
    //     label:"3/67", formation:"2 Arm", maxSteps:6, 
    //     curSteps: 6, unitType:"Armor", side:0,
    //     sides:[
    //         {assault:false, AV:5, AR: 4, RNG:2, MA:14, moveType:"TACTICAL"}
    //     ],
    //     hexX:3, hexY: 3} );   


    var _initializeUnits = function(){
        for( var x=0; x<_counterDataArr.length; x++){
            var cd = _counterDataArr[x];
            var unit = new Unit( cd, _that );
            _unitsById[cd.id] = unit; // store each object by id for easy retrieval...
        }
        $rootScope.$emit("counter_data_has_loaded");
    };



    this.unitPropertyHasChanged = function( propertyThatChanged, counterData ){
        console.log( "CounterDataService.unitPropertyHasChanged " + propertyThatChanged + " " + counterData.id );
        // called by unit whenever properties change...
        // notifiy server that unit data has changed...
        var gameId = "LB_001";
        //HttpService.updateCounterData( gameId, counterData );
        var dataObj = {gameId: gameId, counterData: counterData, changedProperty: propertyThatChanged };
        var test = function(){
            console.log("THE SERVER HAS STORED THE DATA");
        }
        WebSocketService.sendMessage( "counter_data_changed", dataObj, test);
    };



    this.getUnit = function( unitId ){
        var unit = _unitsById[unitId];
        if (!unit) return null;
        return unit;
    };

    // RETURN ARRAY OF UNIT IDs....
    this.getAllUnitsOnMap=function(){
        var unitArr = [];
        for (var x=0; x<_counterDataArr.length; x++){
            var cd = _counterDataArr[x];
            if (cd.hexX!=null){
                unitArr.push( _that.getUnit(cd.id) ); 
            }
        }
        return unitArr;
    };


    // this.doesUnitBelongToFaction = function( unitId, faction ){
    //     var cd = _that.getCounterById( unitId );
    //     if (!cd) return false;
    //     return cd.faction==faction;
    // };


    this.doesUnitHaveZOC = function( unitId ){
        var cd = _that.getCounterById( unitId );
        if (cd.unitType!="HQ"){
            return true;
        }
        return false;
    }

    this.getCounterMoveType = function( counterData ){
        var dataObj = counterData;
        if (counterData.side != undefined ){
            dataObj = counterData.sides[counterData.side];
        }
        return dataObj.moveType;
    };


    this.getCounterById = function( unitId ){
        //return _getCounterById( counterId );
        var unit = _unitsById[ unitId ];
        if (!unit){
            return null;
        }
        return unit.getCounterData();
    };



    var _getSelectedCounters = function(){
        // RETURN ARRAY OF ALL COUNTERS CURRENTLY SELECTED....
        var returnArr = [];
        for (var x=0; x<_counterDataArr.length; x++){
            var cData = _counterDataArr[x];
            if (cData.isSelected) returnArr.push(cData);
        }
        return returnArr;
    };

    this.unselectCounter = function( counterData ){
        //counterData.isSelected = false;
    };

    this.unselectAllOtherUnits = function( counterData, bWasServerEvent ){
        // deselect any counters besides the current that have lost the selection
        var curSelectedCounters = _getSelectedCounters();
        for (var x=0; x<curSelectedCounters.length; x++){
            var cd = curSelectedCounters[x];
            if (cd!=counterData){
                //cd.isSelected = false;
                var unit = _that.getUnit( cd.id );
                unit.select( false, bWasServerEvent );//only need to share which unit was selected and clients can figure out which ones are not...
                //lostSelectionArr.push( _that.getUnit( cd.id ) );
            }
        }

    };

    var _getUnitsInFormation = function( formationId ){
        var formationCounters = [];
        for (var x=0; x<_counterDataArr.length; x++){
            var cd = _counterDataArr[x];
            if (cd.formation==formationId){
                formationCounters.push( cd );
            }
        }//end for...
        return formationCounters;
    };

    var _onNewCounterDataFromServer = function( serverObj ){
        if ( !serverObj) return;
        if (serverObj.error || !serverObj.resultArr ){
            // HANDLE ERROR...
        }
        else {
            _counterDataArr = serverObj.resultArr[0].counters;
            _initializeUnits();
        }
    };

    // RESPOND WHEN USER LOGS IN TO SERVER BY FETCHING COUNTER DATA....
    var _cleanMeUp_UserLoggedInFn = $rootScope.$on('user_logged_into_client', function(){
        // GET COUNTER DATA FOR GAME....
        var gameId = "LB_001";
        HttpService.getCounterDataForGame( gameId, _onNewCounterDataFromServer );
    });

    var _cleanMeUp_AppIsClosingFn = $rootScope.$on('app_is_closing', function(){
        // DO ALL CLEANUP HERE....
        _cleanMeUp_AppIsClosingFn();
        _cleanMeUp_UserLoggedInFn();
    });

});//end CounterService...
