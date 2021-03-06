

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

