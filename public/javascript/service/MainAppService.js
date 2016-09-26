
appModule.service('MainAppService', function( SvgService, HexService, $timeout, $http, $window, $rootScope ) {
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


	// ROOTSCOPE EVENTS TRACKED AND CLEANED UP HERE....
  var _cleanUpFnArray = [];
  var _cleanMeUp_AppIsClosingFn = $rootScope.$on('app_is_closing', function(){
      // DO ALL CLEANUP HERE....
      for (var x=0;x<_cleanUpFnArray.length; x++){
      	_cleanUpFnArray[x](); // call the function....
      }
      _cleanMeUp_AppIsClosingFn();
  });

  this.listenForRootScopeMsg=function( msgName, callback ){
  	var cleanUpFn = $rootScope.$on( msgName, callback );
  	_cleanUpFnArray.push( cleanUpFn ); // add the function to the list that will get cleaned when the app closes....
  }


});