
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
