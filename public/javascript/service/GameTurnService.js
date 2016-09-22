

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

