// DATA MODEL FOR UNITS/COUNTERS IN THE GAME....

function Unit( cData, CounterDataService ){
    var _rendering = null; // SVG for this object...
    this.getCounterData = function(){
        return cData;
    };

    this.isSelected = function(){
        return cData.isSelected;
    };
    this.select = function( bIsSelected ){
        if (bIsSelected == false ){
            cData.isSelected = false;
            return [];
        }
        else {
            cData.isSelected = true;
            var newlyUnselectedCounters = CounterDataService.selectCounter( cData );
            return newlyUnselectedCounters;
        }
    }
    this.isMoving = function( bIsMoving ){
        // RETURN STATUS OF isMoving ATTRIBUTE...
        if (bIsMoving==true || bIsMoving==false){
            cData.isMoving = bIsMoving;
        }
        return cData.isMoving;
    };
    this.setRendering = function( rendering ){
        _rendering = rendering;
    };
    this.getRendering = function(){
        return _rendering;
    };
    this.getId = function(){
        return cData.id;
    };
    this.getFaction = function(){
        return cData.faction;
    };
    this.getCountry = function(){
        return cData.country;
    };
    this.getClass = function(){
        return cData.class;
    };
    this.getLogoId = function(){
        return cData.logoId;
    };
    this.getLabel = function(){
        return cData.label;
    };
    this.getFormation = function(){
        return cData.formation;
    };
    this.getMaxSteps = function(){
        return cData.maxSteps;
    }
    this.getCurrentSteps = function(){
        return cData.curSteps;
    };
    this.getUnitType = function(){
        return cData.unitType;
    };
    this.getLocation = function(){
        if (cData.hexX==null) return null;
        return new Point( cData.hexX, cData.hexY );
    };
    this.setLocation = function( point ){
        if (!point){
            cData.hexX = null;
            cData.hexY = null;
        }
        cData.hexX = point.x;
        cData.hexY = point.y;
    };
    this.isAssaultUnit = function(){
        var side = cData.sides[ cData.side ];
        return side.assault;
    };
    this.getArmorValue = function(){
        var side = cData.sides[ cData.side ];
        return side.AV;
    };
    this.getActionRating = function(){
        var side = cData.sides[ cData.side ];
        return side.AR;
    };
    this.getRange = function(){
        var side = cData.sides[ cData.side ];
        return side.RNG;
    };
    this.getMovementAllowance = function(){
        var side = cData.sides[ cData.side ];
        return side.MA;
    };
    this.getMovementType = function(){
        var side = cData.sides[ cData.side ];
        return side.moveType;
    };
    this.hasZoneOfControl = function(){
        if (cData.unitType!="HQ"){
            return true;
        }
        return false;
    }
};


appModule.service('CounterDataService', function() {
    var _that = this;
    // SET UP COUNTERS FOR THE GAME....
    var _counterDataArr = [];
    var _counterDataObj = {}; // store value under key of id....
    _counterDataArr.push( { id:"CTR_UNIT_29_ARM", faction: "ALLIES", country:"US", class:"US_COUNTER", logoId:"oArmorLogo",
        label:"23 Hus", formation:"2 Arm", maxSteps:6, 
        curSteps: 6, unitType:"Armor", side:0,
        sides:[
            {assault:true, AV:5, AR: 4, RNG:2, MA:16, moveType:"TACTICAL"}
        ],
        hexX:4, hexY: 3 } );
    _counterDataArr.push( { id:"CTR_UNIT_30_ARM", faction: "ALLIES", country:"UK", class:"UK_COUNTER", logoId:"oInfantryLogo", xxxisSelected:true,
        label:"II/753", formation:"29 Arm", maxSteps:6, 
        curSteps: 6, unitType:"Armor", side:0,
        sides:[
            {assault:true, AV:3, AR: 4, RNG:2, MA:14, moveType:"TACTICAL"}
        ],
        hexX:5, hexY: 3 } );
    // HQ 
    _counterDataArr.push( { id:"CTR_HQ_2_ARM", faction: "ALLIES", country:"US", class:"US_COUNTER", logoId:"oHQLogo",
        label:"HQ", formation:"2 Arm", maxSteps:0, 
        curSteps: 0, unitType:"HQ", side:0,
        sides:[
            {assault:false, CR:5, MA:14, moveType:"TRUCK"}
        ],
        hexX:2, hexY: 3} );   
    // COMBAT TRAIN
    _counterDataArr.push( { id:"CTR_TRAIN_2_ARM", faction: "ALLIES", country:"US", class:"US_COUNTER", logoId:"oTrainLogo",
        label:"TRAIN", formation:"2 Arm", maxSteps:0, 
        curSteps: 0, unitType:"COMBAT_TRAIN", side:0,
        sides:[
            {ghost:false},{ghost:true}
        ],
        hexX:1, hexY: 1} );  
    _counterDataArr.push( { id:"CTR_UNIT_HOLZ", faction: "GERMAN", country:"GE", class:"GE_COUNTER", 
        label:"Holz", formation:"29 Arm", maxSteps:6, 
        curSteps: 5, unitType:"Armor", side:0,
        sides:[
            {assault:false, AV:2, AR: 4, RNG:2, MA:14, moveType:"TACTICAL"}
        ],
        hexX:5, hexY: 5} );    

    _counterDataArr.push( { id:"CTR_UNIT_32_ARM", faction: "ALLIES", country:"US", class:"US_COUNTER", logoId:"oArmInfLogo",
        label:"3/67", formation:"2 Arm", maxSteps:6, 
        curSteps: 6, unitType:"Armor", side:0,
        sides:[
            {assault:false, AV:5, AR: 4, RNG:2, MA:14, moveType:"TACTICAL"}
        ],
        hexX:3, hexY: 3} );   

    for( var x=0; x<_counterDataArr.length; x++){
        var cd = _counterDataArr[x];
        var unit = new Unit( cd, _that );
        _counterDataObj[cd.id] = unit; // store each object by id for easy retrieval...
    }


    this.getUnit = function( unitId ){
        var unit = _counterDataObj[unitId];
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
        var unit = _counterDataObj[ unitId ];
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
        counterData.isSelected = false;
    };

    this.selectCounter = function( counterData ){
        // make this counter selected
        // return any counters that lost the selection
        var lostSelectionArr = [];
        var curSelectedCounters = _getSelectedCounters();
        for (var x=0; x<curSelectedCounters.length; x++){
            var cd = curSelectedCounters[x];
            if (cd!=counterData){
                cd.isSelected = false;
                lostSelectionArr.push( _that.getUnit( cd.id ) );
            }
        }
        counterData.isSelected = true;
        return lostSelectionArr;
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


});//end CounterService...
