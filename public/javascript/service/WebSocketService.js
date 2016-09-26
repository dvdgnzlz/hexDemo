appModule.service('WebSocketService', function( $rootScope ) {
	console.log( 'WebSocketService');
	var _isConnected = false;
	var _socketId = "";

	var socket = io();
	//var socket = io("http://localhost:3001");
	//var socket = io('http://localhost:3001/my-namespace', { path: '/myapp/socket.io'});



	this.sendMessage = function( msg, data, callback ){
		if (_isConnected){
			socket.emit( msg, data );
			if (callback){
				callback();
			}
		}
	};


	socket.on('user_list', function( arr ){
		console.log("Server sent user list:")
		console.log( arr );
	});

	socket.on('connect', function(){
		_isConnected = true;
		console.log( "Connected...");
		_socketId = socket.io.engine.id;
		console.log( "My new socket id is: " + _socketId);
		$rootScope.$emit("web_socket_connected");
	});

	socket.on('disconnect', function () {
		_isConnected = false;
	  console.log('Disconnected');
	  $rootScope.$emit("web_socket_disconnected");
	});   


	socket.on('server_message', function(msg){
		console.log( "MESSAGE FROM WebSocket.... server_message" );
		console.log( msg );
	});


	socket.on('counter_data_changed', function( dataObj ){
		console.log( "MESSAGE FROM WebSocket.... counter_data_changed.  We need to update our counter with new info." );
		console.log( dataObj );
		$rootScope.$emit( 'counter_data_changed', dataObj );
	});



	var _cleanMeUp_AppIsClosingFn = $rootScope.$on('app_is_closing', function(){
		// DO ALL CLEANUP HERE....
		socket.emit("app_is_closing", null);
		_cleanMeUp_AppIsClosingFn();
	});


}); 