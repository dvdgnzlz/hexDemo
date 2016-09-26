// DATA MODEL FOR UNITS/COUNTERS IN THE GAME....

function Unit( cData, CounterDataService ){
    var _that = this;
    var _rendering = null; // SVG for this object...
    var _myRenderFunction = null;

    this.getCounterData = function(){
        return cData;
    };

    this.setRenderFunction=function( renderFn ){
        _myRenderFunction = renderFn;
        _that.render();//render myself....
    };

    this.render = function(){
        if (_myRenderFunction){
            _myRenderFunction(_that);
        }
    };

    this.isSelected = function(){
        return cData.isSelected;
    };
    this.select = function( bIsSelected, bWasServerEvent ){
        //var newlyUnselectedCounters = [];
        console.log( "Unit.select " + bIsSelected );
        if (bIsSelected == false ){
            cData.isSelected = false;
        }
        else {
            cData.isSelected = true;
            //newlyUnselectedCounters = CounterDataService.selectCounter( cData, bWasServerEvent );
            CounterDataService.unselectAllOtherUnits( cData, bWasServerEvent );
        }
        if (!bWasServerEvent){
            CounterDataService.unitPropertyHasChanged( "selected", cData );
        }
        _that.render();
        //return newlyUnselectedCounters;
    }
    this.isMoving = function( bIsMoving ){
        // RETURN STATUS OF isMoving ATTRIBUTE...
        if (bIsMoving==true || bIsMoving==false){
            cData.isMoving = bIsMoving;
            //_that.render();
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
    this.setLocation = function( point, bWasServerEvent ){
        if (!point){
            cData.hexX = null;
            cData.hexY = null;
        }
        cData.hexX = point.x;
        cData.hexY = point.y;
        if (!bWasServerEvent){
            CounterDataService.unitPropertyHasChanged( "location", cData );
        }
        _that.render();
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

