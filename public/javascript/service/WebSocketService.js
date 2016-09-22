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