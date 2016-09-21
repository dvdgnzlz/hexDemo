var appModule = angular.module('App', [ 'ui.bootstrap' ]);
var s = null;		






appModule.service('WebSocketService', function( ) {
	console.log( 'WebSocketService');
	var socket = io();
	//var socket = io("http://localhost:3001");
	//var socket = io('http://localhost:3001/my-namespace', { path: '/myapp/socket.io'});
	this.sendMessage = function( msg, data ){
		socket.emit( msg, data );
	}

	socket.on('server_message', function(msg){
		console.log( "MESSAGE FROM WebSocket.... server_message" );
		console.log( msg );
	});


});





appModule.service('MainAppService', function( SvgService, HexService, $timeout, $http, $window ) {
	//console.log("MainAppService");
	var _that = this;
	var _top = 0;
	var _left = 0;
	this.winHeight = 0;
	this.winWidth = 0;
	// LISTEN TO THE STATE OF THE BROWSER WINDOW
	// NOTIFY APP OF CHANGES TO WINDOW SIZE, SHUT DOWN, ETC...
	var onWinResize = function(){
		_that.winHeight = $( $window ).height();
		_that.winWidth = $( $window ).width();
		console.log("RESIZE " + _that.winWidth + ", " + _that.winHeight);
		onWinScroll( null );
	};
	var onWinClose = function( evt ){
		// CLEAN UP WINDOW....
		$window.onresize = null;
		$($window).unbind();
	};

	var _scrollPromise = null;
	var onWinScroll = function(evt){
		// evt may be null (from onWinResize() )....
		//console.log("SCROLL");
		_top = $($window).scrollTop();
		_left = $($window).scrollLeft();
		if (_scrollPromise!=null){
			$timeout.cancel(_scrollPromise);
		}
		var _onWinScrollEnd = function(){
			//console.log( "SCROLL POS: " + _left + ", " + _top );
			SvgService.onWinScroll( _left, _top );
			HexService.onWinScrollEnd( _left, _top );
		};
		_scrollPromise = $timeout(_onWinScrollEnd, 80);
		HexService.onWinScrollBegin();
	}
	$window.onresize=onWinResize;
	//window.onbeforeunload = onWinClose;
	$($window).bind('beforeunload', onWinClose );
	$($window).bind('scroll', onWinScroll );

	//$timeout(onWinScroll, 100);
	HexService.setMainAppService(this);
	onWinResize( );
	onWinScroll();
});





appModule.service("SvgService", function( GameStateService){
	//console.log("SvgService");
	this.svg = Snap("#oSvgPanel");
	var mapSize = GameStateService.getMapPixelSize();
	//var image = this.svg.image("images/BCS-LB-Big-Map.png", 0,0, mapSize.x, mapSize.y);	
		this.svg.node.style.position = "absolute";
		//this.svg.node.style.width = 1000;
		//this.svg.node.style.height = 800;
		this.svg.attr({"width":mapSize.x, "height":mapSize.y});
	//console.log(image);
	this.onWinScroll=function( xOffset, yOffset ){// called by MainAppService when window scrolls....
		//console.log('got it ' + xOffset + ", " + yOffset );
		//image.attr( { x:xOffset*-1, y:yOffset*-1 });

		//console.log(this.svg);
		
		//this.svg.node.style.left = xOffset;
		//this.svg.node.style.top = yOffset;
		//alert(this.svg.node.clientLeft);
	};
});






appModule.service("GameStateService", function( ){
	//console.log("GameStateService");
	// wrapper for all game state code 
	var _metaData = {
		id: "LAST_BLITZKRIEG",
		title: "Last Blitzgrieg",
		counterImages: { size:60 },
		mapImages: [
			{
				url:"../../../images/BCS-LB-Big-Map.png",  // NOT USED FROM HERE - SEE /css/style.css....
				rows:20, columns:30, totalRows: 70, totalColumns: 123, hexSize: 59.664,
				flatTopHexes:true, oddLayoutHexes:true, sizeX:11380, sizeY:7385, 
				offsetX:-18, offsetY:22 , scaleY:1.00
			}
		]
	};4
	var _players = [
		{	id: "AXIS", 		title:"Axis"},
		{ id: "ALLIES", 	title: "Allies"}
	];


	this.startGame=function (){
		_currentGameState.turn = 1;
		_currentGameState.phase	= 1;
	};

	this.getCounterSize = function(){
		return _metaData.counterImages.size;
	};

	this.getMapOffset = function(){
		return new Point( _metaData.mapImages[0].offsetX, _metaData.mapImages[0].offsetY );
	}
	this.getHexSize = function(){
		return _metaData.mapImages[0].hexSize;
	}
	this.getMapSizeInHexes = function(){
		return new Point( _metaData.mapImages[0].columns, _metaData.mapImages[0].rows );
	};
	this.getGameSizeInHexes = function(){
		return new Point( _metaData.mapImages[0].totalColumns, _metaData.mapImages[0].totalRows );
	};
	this.getMapPixelSize = function(){
		return new Point( _metaData.mapImages[0].sizeX, _metaData.mapImages[0].sizeY );
	};
	this.getIsFlatTopHexes = function(){
		return _metaData.mapImages[0].flatTopHexes;
	};
	this.isOddLayoutHexes = function(){
		return _metaData.mapImages[0].oddLayoutHexes;
	};
	this.getMapScaleFactorY = function(){
		return _metaData.mapImages[0].scaleY;
	};
});



appModule.service("GameTurnService", function( ){
	var _that=this;
	// 1 PRE-TURN PHASE
	//  1.1 PLACE REINFORCEMENTS
		// ROLL FOR WEATHER
		// ROLL FOR NEW AIR POINTS
		// ROLL FOR REPLACEMENT POINTS
		// APPLY ALL AVAILABLE REPLACEMENT POINTS

	// 1.2 ASSIGNMENT PHASE
		// ASSIGN UNITS FROM/TO SUPPORT
		// ASSIGN ARTY POINTS

	// 1.3 ROLL TO SEE WHO GOES FIRST - IF NOT FIRST TURN....

	// 2) ACTIVATION PHASE
		// ALTERNATE ACTIVATING FORMATIONS

	// 3) ADMIN PHASE
		// FLIP HQ TO UNUSED SIDES

	// 4) GAME TURN END

	var _phaseArr = [
		{id:"GAME_TURN_BEGIN"}, // increment game turn....
		{id:"PRE-TURN"},
		{id:"REINFORCEMENTS"},
		{id:"WEATHER"},
		{id:"ROLL_FOR_AIR_POINTS"},
		{id:"ROLL_FOR_PREPLACEMENT_POINTS"},
		{id:"APPLY_PREPLACEMENT_POINTS"},
		{id:"ASSIGNMENT_PHASE"},
		{id:"DETERMINE_WHO_GOES_FIRST"},
		{id:"ACTIVATION_PHASE"},
		{id:"ADMIN_PHASE"},
		{id:"GAME_TURN_END"}
	];

	var _activationPhaseArr = [
		{id:"PICK_FORMATION"}, // FLIP HQ MARKER, 
		{id:"DECLARE_FATIGUE_RECOVERY_ACTION"}, // OR REGULAR ACTION.  
		{id:"MODIFY_MSR_BLOCKED_MARKER"}, // MAY IMPACT SNAFU ROLL
		{id:"DECLARE_PREPARED_DEFENSE"}, // UNLESS MSR BLOCKED...
		{id:"DETERMINE_IF_MIXED"}, // apply coordination 
		{id:"SNAFU"}, // IF FAILS ON INITIAL ACTIVATION, CAN CONVERT TO RECOVERY ACTION (REVERSE EVERYTHING DONE ABOVE).  NO SECOND ACTION IN THAT CASE
		{id:"PLACE_OBJ_MARKERS"}, 
		{id:"ACTIVITIES"}, 
		{id:"CLEAN_UP"}, //REMOVE OBJ MARKERS, TRAFFIC, TEMP SUPPORT DROPS.  IF COMBAT TRAINS NOT IN LEGAL HEX, REMOVE THEM, OR IF NOT OPTIMAL DISTANCE, FLIP TO GHOST
		{id:"FATIGUE"}, 
		{id:"ISOLATION_EFFECTS"}, 
		{id:"SECOND_ACTIVATION"}, // UNLESS FAILURE FLIP DONE ABOVE...
	];

	var _currentTurn = 0;
	var _currentPhaseIndex=0;  

	var _activeFaction = "ALLIES";  // ALLIES OR GERMAN....
	var _activeFormation = "";
	var _activeUnitId = "";
	var _activeUnitHQData = null;
	var _activeUnitCombatTrainData = null;


	var _startNewTurn = function(){
		_currentTurn ++;
		_currentPhaseIndex = 0;
	};

});




appModule.service("FormationService", function( ){
	_that = this;

	this.setActiveFormation = function( counterData ){
		// START A NEW FORMATION ACTIVATION...
	};

	this.declareFatigueRecovery = function(){
		// MUST HAVE COMBAT TRAINS IN LEGAL HEX
		// IT HAS NOT ALREADY RECOVERED THIS TURN
		// IT IS NOT ALREADY FAT-0 (can't go to fresh)...

		// DO NOT MAKE A SNAFU ROLL...

		// REMOVE COORDINATION MARKER
		// FLIP COMBAT TRAIN FROM GHOST
		// IN FATIGUE PHASE, RECUCE FAT LEVEL BY 1
		// APPLY ISOLATION NORMALLY
		// REMOVE DROPPED SUPPORT MARKERS 
	};

	this.performMsrBlockedPhase = function(){
		// IN PREP PHASE OF TURN...
		// IF COMBAT TRAINS ARE OFF MAP, APPLY MSR BLOCKED LEVEL 1 MARKER, OR INCREASE LVL 1 TO 2.
		// IF COMBAT TRAINS ARE IN LEGAL HEX, REMOVE MSR BLOCKED MARKER

		// MSR BLOCKED EFFECTS....
		// APPLY -1 DRM TO COMBAT ON ATTACK OR DEFENSE
		// APPLY DRM TO SNAFU ROLL
		// PREVENT PREPARED DEFENSE 

	};

	this.areStreamsCrossing = function(){
		// CROSSING STREAMS
		// -1 SNAFU DRM IF PATH BETWEEN HQ AND C TRAINS SHARES ANY HEX (INCLUSIVE) WITH SAME PATH OF OTHER FORMATION...
	};

	this.isCombatTrainInLegalHex = function(){
		// PRIMARY OR SECONDARY ROAD HEX (TRACK ALLOWED ON ENTRY ONLY)
		// HEX CONNECTED TO SUPPLY SOURCE USING PRIMARY OR SECONARY ROADS
		// HEX CONNECTED TO HQ VIA NON-RR ROAD HEX (TRACK OK) USING FEWEST TRUCK MP OF ROUTES AVAILABLE...
		// HEX AND ENTRIE MSR TO HQ (BUT EXCLUDING HQ) DOES NOT CONTAIN EZOC, ENG ZONES, OR ENEMY UNITS (NO NEGATION BY FRIENDLIES)
		// HEX DOES NOT BLOCK AN EXISTING ENEMY MSR...


		// C TRAINS MUST MOVE IF NOT IN LEGAL HEX
		// IF THEY CAN"T MOVE TO LEGAL HEX, REMOVE FROM MAP.
		// CAN MOVE TO ANY LEGAL HEX (FLIP TO GHOST)
		// AT END OF ACTIVATION, IF OUTSIDE OPTIMAL DISTANCE, FLIP TO GHOST
	};

	this.isCombatTrainAtOptimalDistance = function(){
		// BETWEEN 5 AND 15 HEXES (INCLUSIVE)
		// AND DISTANCE FROM C TRAIN TO SUPPLY MUST BE LESS THAN HQ TO SUPPLY (SEE IF TRACE FROM C TRAIN TO SUPPLY AND HQ TO SUPPLY SHARE ANY HEXES)
		// GRANTS BONUS TO SNAFU
		// IF NO, THEN FLIP CT TO GHOST SIDE

		// IF CTRAIN IS IN ENTRY HEX, AND HQ IS <=15 HEXES AWAY, THIS FUNCTION SHOULD RETURN TRUE
	};
});


// USE THIS SERVICE TO LAUNCH ALL MODAL DIALOGS....
appModule.service("ModalLaunchService", function( $uibModal ){
	_that = this;
	var $ctrl = this;
  $ctrl.items = ['item1', 'item2', 'item3'];
  $ctrl.openLoginModal = function ( paramObj ) {
  	//$ctrl.params = paramObj;
    var modalInstance = $uibModal.open({
      //animation: true,
      templateUrl: 'modals/LoginModal',
      controller: 'LoginModalInstanceCtrl',
      controllerAs: '$modalCtrl', // how the HTML refers to the controller....
      size: 'md',
      resolve: {
        params: function(){ return paramObj; }
      }
    });//end modalInstance definition...
    
    modalInstance.result.then(
    	// OK CLICKED....
    	function (returnObj) { 
	      console.log("RETURN VALUE");
	      console.log( returnObj );
    	}, 
    	// CANCEL CLICKED....
    	function () {
      console.log('Modal dismissed at: ' + new Date());
    	}
    );// end result.then...
	};
});



appModule.controller('LoginModalInstanceCtrl', function( $uibModalInstance, params ){

	console.log( "params" );
	console.log( params );
  var $ctrl = this;


  $ctrl.ok = function () {
    $uibModalInstance.close( params );
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});


appModule.controller('MenuController', function( MainAppService, GameStateService, SvgService, CounterService, $scope, MenuService, TerrainService ){   
	//console.log( 'MenuController ');
	$scope.menuDefs = [];
	$scope.menuPos = new Point(0,0);
	$scope.isMenuOpen = false;
	$scope.menuTitle = "";
	//$scope.$watch("$scope.menuDefs");
  $scope.toggled = function(isOpen) {
  	$scope.isMenuOpen = isOpen;
  	MenuService.setStatus( isOpen );//let the service know whether it is showing or not....
    console.log('Dropdown is now: ', $scope.isMenuOpen);
  };

	var _renderMenus = function( evt, screenPt ){
		$scope.title = MenuService.getTitle();
		$scope.menuPos = screenPt;
		$scope.menuDefs = MenuService.getMenuDefs();
		$scope.isMenuOpen = true;
		$scope.$digest();
	};
	var _hideMenus = function( ){
		$scope.isMenuOpen = false;
		$scope.$digest();
	};
	$scope.$on('SHOW_MENUS', _renderMenus );//show menus when we get the message....
	$scope.$on('HIDE_MENUS', _hideMenus );//show menus when we get the message....

});


appModule.controller('AppController', function( MainAppService, GameStateService, SvgService, CounterService, $scope, MenuService ){   
	//console.log( 'AppController ');


});