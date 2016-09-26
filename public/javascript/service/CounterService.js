
// HANDLE THE SVG RENDERING AND USER INTERACTION FOR GAME COUNTERS/UNITS....

appModule.service('CounterService', function( $timeout, WebSocketService, MainAppService, CounterDataService, HexService, SvgService, GameStateService, MapDataService, MenuService, MapRoutingService ) {
    var _that = this;
    var _s = SvgService.svg;
    var _counterLayer = Snap('#oCounterDisplayLayer');
    var _subLayer = Snap('#oSubLayer');
    var baseCounterSvg = Snap("#oCounterBase");

    baseCounterSvg.attr( {width:GameStateService.getCounterSize(), height:GameStateService.getCounterSize() } );

    var _unitArr = CounterDataService.getAllUnitsOnMap();

    var onCounterMove = function( x, y, x1, y1, evt ){
        // this = the counter moving....
        if (Math.abs(x)<15 && Math.abs(y)<15){
            return;  // wait for the mouse to move a bit...
        }
        var counterSvg = this;
        var counterId = counterSvg.data("counterId");
        var unit = CounterDataService.getUnit( counterId );

        var targetSvg = evt.target;
        var hexID = targetSvg.id;
        var newHexAbsPoint = null;

        MenuService.clearMenus();
        if (unit && !unit.isMoving() ){
            unit.isMoving(true);
        }//end if...
        if (hexID.substr(0,7)=="hexSvg_") {
            newHexAbsPoint = HexService.getAbsolutePositionFromHexSvg( Snap(targetSvg) );
        }//if.
        else if ( Snap(targetSvg).node.parentElement.id.substr(0,3)=="CTR" ){
            var counterId = Snap(Snap(targetSvg).node.parentElement).data("counterId");
            var targetUnit = CounterDataService.getUnit( counterId );
            newHexAbsPoint = targetUnit.getLocation();
        }//else
        else {
            return; // if the counter is dropped on something other than hex, fail for now....
        }//else
        var oldAbsPoint = unit.getLocation();
        var hexPt = HexService.getHexCenterPoint( newHexAbsPoint.x, newHexAbsPoint.y );
        var unit = CounterDataService.getUnit( unit.getId() );
        var svgRendering = unit.getRendering();
        if ( svgRendering ){
            svgRendering.remove();
            unit.setRendering( null );
        }//if
        if ( oldAbsPoint.isEqualTo( newHexAbsPoint )) {
            // THE COUNTER WAS DROPPED IN THE SAME HEX...
            return;
        }//if
        var rect = _subLayer.rect( hexPt.x - 40, hexPt.y - 40, 80, 80, 15, 15 );
        unit.setRendering( rect );
        rect.attr({ opacity:0.3, fill:'green'});
    };

        // var onCounterMove = function(x, y, x1, y1, evt){
        //     // this = the counter moving....
        //     if (Math.abs(x)<15 && Math.abs(y)<15){
        //         return;  // wait for the mouse to move a bit...
        //     }
        //     var counterSvg = this;
        //     var counterId = counterSvg.data("counterId");
        //     var unit = CounterDataService.getUnit( counterId );

        //     var targetSvg = evt.target;
        //     var hexID = targetSvg.id;
        //     var newHexAbsPoint = null;

        //     MenuService.clearMenus();

        //     if (unit && !unit.isMoving() ){
        //         unit.isMoving(true);
        //     }//end if...

        //     if (hexID.substr(0,7)=="hexSvg_") {
        //         newHexAbsPoint = HexService.getAbsolutePositionFromHexSvg( Snap(targetSvg) );
        //     }//if.
        //     else if ( Snap(targetSvg).node.parentElement.id.substr(0,3)=="CTR" ){
        //         var counterId = Snap(Snap(targetSvg).node.parentElement).data("counterId");
        //         var targetUnit = CounterDataService.getUnit( counterId );
        //         newHexAbsPoint = targetUnit.getLocation();
        //     }//else
        //     else {
        //         return; // if the counter is dropped on something other than hex, fail for now....
        //     }//else
        //     var oldAbsPoint = unit.getLocation();
        //     var hexPt = HexService.getHexCenterPoint( newHexAbsPoint.x, newHexAbsPoint.y );
        //     var unit = CounterDataService.getUnit( unit.getId() );
        //     var svgRendering = unit.getRendering();
        //     if ( svgRendering ){
        //         svgRendering.remove();
        //         unit.setRendering( null );
        //     }//if
        //     if ( oldAbsPoint.isEqualTo( newHexAbsPoint )) {
        //         // THE COUNTER WAS DROPPED IN THE SAME HEX...
        //         return;
        //     }//if
        //     var rect = _subLayer.rect( hexPt.x - 40, hexPt.y - 40, 80, 80, 15, 15 );
        //     unit.setRendering( rect );
        //     rect.attr({ opacity:0.3, fill:'green'});
        // };  
         

    var onCounterStartMove = function(x){
        // this = the counter moving....
        //console.log("MOVE START");
        var unit = CounterDataService.getUnit( this.data("counterId") );
        // if (unit && !unit.isMoving() ){
        // }
    };

    var renderCountersInHex = function( absX, absY ){
        var counterIdArr = MapDataService.getCountersInHex( absX, absY );
        for (var x=0; x<counterIdArr.length; x++){
            var counterId = counterIdArr[x];
            var unit = CounterDataService.getUnit( counterId );
            //_that.renderCounter( unit );
            unit.render();
        }
    };

    var moveCounter = function( unit, fromAbsPoint, toAbsPoint, bWasServerEvent ){// bWasServerEvent=came from server event...
        //REMOVE COUNTER FROM OLD HEX...
        MapDataService.removeCounterFromHex( unit.getId(), fromAbsPoint.x, fromAbsPoint.y );
        renderCountersInHex( fromAbsPoint.x, fromAbsPoint.y);//refresh old hex...
        // ADD COUNTER TO NEW HEX...
        unit.setLocation( toAbsPoint, bWasServerEvent );
        var hexId = MapDataService.addCounterToHex( unit.getId(), toAbsPoint.x, toAbsPoint.y );
        renderCountersInHex( toAbsPoint.x, toAbsPoint.y);
    };


    var onCounterEndMove = function( evt ){
        // this = the counter moving....
        //console.log('END MOVE');
        var counterSvg = this;
        var counterId = counterSvg.data("counterId");
        var unit = CounterDataService.getUnit( counterId );

        unit.isMoving( false );

        var targetSvg = evt.target;
        var hexID = targetSvg.id;
        var newHexAbsPoint = null;
        if (hexID.substr(0,7)=="hexSvg_") {
            newHexAbsPoint = HexService.getAbsolutePositionFromHexSvg( Snap(targetSvg) );
        }
        else if ( Snap(targetSvg).node.parentElement.id.substr(0,3)=="CTR" ){
            var counterId = Snap(Snap(targetSvg).node.parentElement).data("counterId");
            var targetCounterData = _getCounterById( counterId );
            //console.log( targetCounterData );
            newHexAbsPoint = new Point( targetCounterData.hexX, targetCounterData.hexY );
        }
        else {
            //_that.renderCounter( unit );
            return; // if the counter is dropped on something other than hex, fail for now....
        }

        var oldAbsPoint = unit.getLocation();
        if ( oldAbsPoint.isEqualTo( newHexAbsPoint )) {
            //_that.renderCounter( unit );
            return;
        }
        moveCounter( unit, oldAbsPoint, newHexAbsPoint, false ); // move from old pos to new...
    };

    var _removeCounterSvg = function( unit ){
        var id = unit.getId();
        var svg = _s.select("#" + id );
        if (svg){
            svg.remove();
        }
    };

    this.getCounterById = function( counterId ){
        return CounterDataService.getCounterById( counterId );
    };

    var _getCounterById = function( pCounterId ){
        return _that.getCounterById( pCounterId );
    };



    var _selectCounter = function( unit, bWasServerEvent ){
        // make this counter selected
        //var unitsThatLostSelection = unit.select( true, bWasServerEvent );
        unit.select( true, bWasServerEvent );
        // for (var x=0; x<unitsThatLostSelection.length; x++){
        //     //_that.renderCounter( unitsThatLostSelection[x]);
        // }
        //_that.renderCounter( unit );

        var costArr = MapRoutingService.getMovementCostArray( unit, unit.getLocation() );
        };

        var _deactivateUnit = function( unit, bWasServerEvent ){
        unit.select( false, bWasServerEvent );
        //_that.renderCounter( unit );
    };



    var _getUnitsInFormation = function( formationId ){
        // var formationCounters = [];
        // for (var x=0; x<_counterDataArr.length; x++){
        //     var cd = _counterDataArr[x];
        //     if (cd.formation==formationId){
        //         formationCounters.push( cd );
        //     }
        // }//end for...
        // return formationCounters;
    };

    var _hilightFormationHexes = function( formationId ){
        // //console.log("HIGHLIGHTING FORMATION " + formationId  );
        // //get all units in formation...
        // var unitsInFormation = _getUnitsInFormation( formationId );
        // for (var x=0; x<unitsInFormation.length; x++){
        //     var cd = unitsInFormation[x];
        //     var absX = cd.hexX;
        //     var absY = cd.hexY;
        //     HexService.setHexClass( absX, absY, "hilightHex");
        // }
    };




    var _onClickUnit = function( unit, menuX, menuY ){
        console.log( "CounterService._onClickUnit " + unit.getId() );
        MenuService.clearMenus();
        if (MenuService.isOpenToContext( unit )){
            console.log("Not rendering menus, as this unit is already selected");
            return;
        }
        if ( unit.isSelected() ){
            MenuService.addMenu( "End activation", function($event){
                //$event.stopPropagation();
                _deactivateUnit( unit, false );
           });
        }
        else {
            MenuService.addMenu( "Activate unit", function($event){
                //$event.stopPropagation();
                _selectCounter(unit, false ); // let the message select the unit...
            });
        }
        MenuService.renderMenus( "Options for " + unit.getLabel() + ":", menuX, menuY, unit );
    };


    this.renderCounter = function( unit ){     
        console.log( "CounterService.renderCounter " + unit.getId() );   
        _removeCounterSvg( unit );
        var unitPos = unit.getLocation();

        // SEE IF UNIT HAS OTHER COUNTERS STACKED BENEATH IT...
        var whichPositionAmI = MapDataService.getIndexOfCounterInHex( unit.getId(), unitPos.x, unitPos.y );
        if (whichPositionAmI<0) whichPositionAmI=0;
        //console.log( hex );
        var hexPt = HexService.getHexCenterPoint( unitPos.x, unitPos.y );
        if (hexPt){
            var counterSize = GameStateService.getCounterSize();//half the counter size...
            // CREATE RECTANGLE FOR COUNTER....
            var rectX = hexPt.x-counterSize/2 + 12*whichPositionAmI;
            var rectY = hexPt.y-counterSize/2 - 12*whichPositionAmI;
            //var counterSnap = _s.rect( rectX, rectY, counterSize, counterSize, 5, 5);
            var counterSnap = _counterLayer.g();//create the counter as a group of elements....
            var counterBevel = _s.use('#oCounterBevel');//the first element is the counter image
            counterSnap.attr({id:unit.getId(), cursor: "pointer" , "transform":"translate(" + rectX + "," + rectY + ")"});
            // REMOVE OLD RENDERING....
            var rendering = unit.getRendering();
            if (rendering){
                rendering.remove();
                unit.setRendering( null );
            }
            if (unit.isMoving() ){
                counterSnap.attr({opacity:0.5});
            }
            //_counterLayer.append( counterSnap );
            if (unit.isSelected() && !unit.isMoving() ){
                var radius = 2;
                var halo = _counterLayer.rect( rectX-radius/2, rectY-radius/2, counterSize+radius, counterSize+radius, radius, radius);
                //var f = _s.filter( Snap.filter.shadow( 5, 5, 6, "red", 0.5 ));//<-- WORKS IN FIREFOX, NOT SAFARI...
                var f = _s.filter( Snap.filter.blur( 0.00001 ));
                //console.log(f);
                halo.attr({ x:-radius/2, y:-radius/2, fill:"white", "stroke":"yellow", "stroke-width":10, "fill-opacity":0, "stroke-opacity":1, filter:f});
                halo.appendTo( counterSnap );
            }
            counterSnap.add( counterBevel );
            if (unit.getLabel()){
                var labelSvg = _counterLayer.text( -3*counterSize/6-2, 12, unit.getLabel());
                labelSvg.attr({ fill:"black", "font-size":9, "font-family":"Arial", "text-anchor":"begin", "transform":"rotate(270)" });
                labelSvg.appendTo( counterSnap );
            }

            if (unit.getArmorValue()){
                var labelSvg = _counterLayer.text( 23, counterSize*.88, unit.getArmorValue());
                labelSvg.attr({ fill:"#B00", "font-size":20, "paint-order":"stroke", "stroke-width":2, "stroke":"white", "font-family":"Arial", "text-anchor":"end", "font-weight":"bold" });
                labelSvg.appendTo( counterSnap );                
            }
            if (unit.getActionRating()){
                var labelSvg = _counterLayer.text( 30, counterSize*.7, unit.getActionRating());
                labelSvg.attr({ fill:"black", "font-size":13, "paint-order":"stroke", "stroke-width":1.5, "stroke":"white", "font-family":"Arial", "text-anchor":"middle", "font-weight":"bold" });
                labelSvg.appendTo( counterSnap );                
            }
            if (unit.getRange()){
                var labelSvg = _counterLayer.text( 30, counterSize*.9, unit.getRange());
                labelSvg.attr({ fill:"black", "font-size":13, "paint-order":"stroke", "stroke-width":1.5, "stroke":"white", "font-family":"Arial", "text-anchor":"middle", "font-weight":"bold" });
                labelSvg.appendTo( counterSnap );                
            }
            if (unit.getMovementAllowance()){
                var labelSvg = _counterLayer.text( 36, counterSize*.88, unit.getMovementAllowance());
                labelSvg.attr({ fill:"black", "font-size":20, "paint-order":"stroke", "stroke-width":2, "stroke":"white", "font-family":"Arial", "text-anchor":"begin", "font-weight":"bold" });
                labelSvg.appendTo( counterSnap );                
            }
            if (unit.getLogoId()){
                var logoSvg = _s.use("#" + unit.getLogoId() );
                counterSnap.add( logoSvg );
                logoSvg.attr({ x:19, y:13 });
            }
            // ADD CSS STYLING...
            counterSnap.addClass("counter");
            counterSnap.addClass(unit.getClass() );
            //counterSnap.data("index", counter.index );//mark the unit with the ordinal index of _counterDataArr....
            counterSnap.data("counterId", unit.getId() );

            counterSnap.mouseup( function(){_onClickUnit(unit, rectX + counterSize + 10, rectY + 12);} );
            counterSnap.drag(onCounterMove, onCounterStartMove, onCounterEndMove );// make dragable...
            return true;
        }//end if...
        else {
            return false;
        }
    };//end fn...  


        // var _cleanMeUp_onCounterDataChangedFn = $rootScope.$on('counter_data_changed', function( evt, dataObj ){
        //     // ANOTHER CLIENT HAS MODIFIED A COUNTER.  GET THEM IN SYNC....
        //     var cd = dataObj.counterData;
        //     var unitId = cd.id;
        //     var unit = CounterDataService.getUnit( unitId );
        //     var propertyChanged = dataObj.changedProperty;
        //     if (propertyChanged==="location"){
        //         var oldLoc = unit.getLocation();
        //         var newLoc = new Point( cd.hexX, cd.hexY );
        //         moveCounter( unit, oldLoc, newLoc, true );
        //     }
        //     else if (propertyChanged==="selected"){
        //         var isSelected = cd.isSelected;
        //         if (isSelected){
        //             _selectCounter( unit, true );
        //         }
        //         else {
        //             _deactivateUnit( unit, true );
        //         }
        //     }
        // });

    var _onCounterDataChangedFn = function( evt, dataObj ){
        // ANOTHER CLIENT HAS MODIFIED A COUNTER.  GET THEM IN SYNC....
        var cd = dataObj.counterData;
        var unitId = cd.id;
        var unit = CounterDataService.getUnit( unitId );
        var propertyChanged = dataObj.changedProperty;
        if (propertyChanged==="location"){
            var oldLoc = unit.getLocation();
            var newLoc = new Point( cd.hexX, cd.hexY );
            moveCounter( unit, oldLoc, newLoc, true );
        }
        else if (propertyChanged==="selected"){
            var isSelected = cd.isSelected;
            if (isSelected){
                _selectCounter( unit, true );
            }
            else {
                _deactivateUnit( unit, true );
            }
        }
    };

    // RESPOND WHEN COUNTER DATA HAS LOADED BY DOING INITIAL RENDERING OF UNITS....
    var _CounterDataLoadedFn = function(){
        // DO INITIAL RENDERING OF UNITS...
        _unitArr = CounterDataService.getAllUnitsOnMap();
        for (var x=0; x<_unitArr.length; x++){
            var unit = _unitArr[x];
            var unitId =  unit.getId();
            unit.setRenderFunction( _that.renderCounter );
            var hexId = MapDataService.addCounterToHex( unit.getId(), unit.getLocation().x, unit.getLocation().y );
        }
    };

    // LISTEN TO ROOTSCOPE IN A WAY THAT CLEANS UP AFTER ITSELF....
    MainAppService.listenForRootScopeMsg( 'counter_data_changed', _onCounterDataChangedFn );
    MainAppService.listenForRootScopeMsg( 'counter_data_has_loaded', _CounterDataLoadedFn );



});//end CounterService...
