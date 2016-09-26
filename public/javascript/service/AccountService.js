
// TRACK USER ACCOUNT INFORMATION HERE....
appModule.service("AccountService", function( $rootScope, ModalLaunchService, HttpService, WebSocketService ){
	var _that = this;
	var _isUserLoggedIn = false;
	var _userName = "";
	var _email = "";
	var _activeGamesForUser = null;

	var _userHasLoggedIn = function(){
		$rootScope.emit("user_logged_into_client");
	};

	var _userAccountInfoCallback = function( params ){
		//  USER DATA HAS ARRIVED FROM THE SERVER...
		console.log("_userAccountInfoCallback");
		console.log( params );
		if (!params.error && params.userData  ){
			_userName = params.userData.userName;
			_email = params.userData.email;
			_activeGamesForUser = params.activeGames;
			_isUserLoggedIn = true;
			console.log("=== USER IS LOGGED IN ");
			// TELL SOCKET SERVICE WHO HAS LOGGED IN...
			WebSocketService.sendMessage( "user_login", _userName ); 
			$rootScope.$emit("user_logged_into_client");// OK TO GRAB DATA FROM SERVER NOW....
		}
		else {
			// PROBLEM LOGGING IN....
			console.log("PROBLEM LOGGING IN");
			_getUserAccountInfo();
		}
	};


	// LAUNCH LOG IN MODAL DIALOG....
	var _getUserAccountInfo = function(){
		var _loginModalCallback = function( params ){
			console.log( "RETURN FROM DIALOG" );
			console.log( params );
			if ( !params ) return; // no data (user canceled)....
			var userName = params.userName;
			if (userName.trim().length>0){
				// GET USER INFO FROM SERVER....
				HttpService.getUserAccountInfo( userName, _userAccountInfoCallback );
			}
		};
		var modalParams = {userName:"dvdgnzlz"};
  	ModalLaunchService.openLoginModal( modalParams, _loginModalCallback );
	};





	var _cleanMeUp_WebSocketConnectedFn = $rootScope.$on('web_socket_connected', function(){
		// WE JUST GOT A CONNECTION WITH THE SERVER.  LOG IN.
		if (!_isUserLoggedIn){
			_getUserAccountInfo();
		}
		else {
			// RESTORE ASSOCIATION WITH CURRENT USER ON THE SERVER....
			WebSocketService.sendMessage( "user_login", _userName ); 
		}
	});

	var _cleanMeUp_AppIsClosingFn = $rootScope.$on('app_is_closing', function(){
		// DO ALL CLEANUP HERE....
		socket.emit("app_is_closing", null);
		_cleanMeUp_AppIsClosingFn();
		_cleanMeUp_WebSocketConnectedFn();
	});

});

