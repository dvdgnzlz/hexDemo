// Initializes MainAppService, which is where most of the game init occurs....
// Associated with the <BODY> of the web page, so this $scope should connect with the entire app....
appModule.controller('AppController', function( AccountService, MainAppService, GameStateService, SvgService, CounterService, $scope, $rootScope, MenuService ){   
	//console.log( 'AppController ');


	var _windowIsClosing = function(){
		// INITIATE APP CLEAN UP HERE...
		$rootScope.$emit("app_is_closing");
	};
	window.onbeforeunload = _windowIsClosing;
});