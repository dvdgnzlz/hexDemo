////////////////////////////////////////////////////////////////////
// SERVER SIDE CODE CONTROLLING THE MAIN NODE/EXPRESS APPLICATION //
// HEX DEMO APP *****************

var os = require('os');
var fs = require('fs');
var path = require('path');
var util = require('util');
var bodyParser = require('body-parser'); //ALLOW POST TO SUBMIT DATA IN THE BODY OF THE MESSAGE....


// Load application configuration service...
var appConfigService = require('app_config.js');
var config = appConfigService.getConfig(os);

var http = require('http');
// var io = require('socket.io')(http); // enable web sockets...


// io.on('connection', function(socket){
//   console.log('a user connected');
// });






 


var https = require('https');
var compression = require('compression');  // TEST 
var express = require('express');   
var request = require("request");//makes http requests easier...
var DOMParser = require('xmldom').DOMParser; // work with xml strings as DOM objects....
//SOURCE FOR xml2js: ======  https://github.com/Leonidas-from-XIV/node-xml2js
var xml2js = require('xml2js'); //take an xml string and convert straight to JSON....

var nodemailer = require( 'nodemailer'); // provide email support.  See www.nodemailer.com....
var emailTransporter = nodemailer.createTransport(config.mailServer);//set up email server (use GMail)....


var dbClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;  

var app = express();
//app.use(compression()); // TEST


function shouldCompress(req, res) {
  // BY DEFAULT, ONLY TEXT-BASED FILES ARE COMPRESSED.  NO NEED TO FILTER JPGs, PNGs, ETC.
  console.log("============ NEW CHECK ==============");
  console.log( req.url );
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
};
app.use(compression({filter: shouldCompress}));


app.config = config; // let the modules have access to the contents of app_config.js file....
app.systemAlertArray = [];
//Here we are configuring express to use body-parser as middle-ware.


//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

// SOURCE FOR connect-busboy: =====  //https://github.com/mscdex/connect-busboy
var busboy = require('connect-busboy'); // Handle uploading multipart files to server....
app.use(busboy({	limits: {	fileSize: 1 * 1024 * 1024 } }));//constrain text uploads to 1meg for now....


app.requestModule = request; //attach modules to app to expose them to other modules....
app.DOMParserModule = DOMParser; //expose to other modules...
app.XmlToJsonModule = xml2js; //expose to other modules...
app.http = http;



app.use(express.static('./public'));//a place for static content....

// Get Jade up and running, and point it to the views directory....
app.set('view engine', 'jade');
app.set('views', './views');



app.sendEmailMessage = function( mailOptions, callback ){
  if (!mailOptions){
    mailOptions = config.mailOptions;
  }
  // SEND EMAIL MESSAGE TO BLACKBIRD....
  // SEE app.config.mailOptions for the mailOptions template....

  // SHOULD WE RECORD THE MESSAGE IN THE LOG COLLECTION?
  // NOTE:  CAN LOG MESSAGES EVEN IF mailOptions IS INVALID (ie, we don't want email sent)...


  // if (app.config.mailOptions.logMessage==true){
  //   var logRecord=mailOptions;
  //   logRecord.event = app.config.mailOptions.logEventName;// DEFAULT IS "BBS_EMAIL_MSG"...
  //   logRecord.accountId = "12345";
  //   // USE THE replyTo FIELD TO DERIVE THE userName FOR THE LOG ENTRY...
  //   if (mailOptions.replyTo){
  //     logRecord.userName = mailOptions.replyTo;
  //     if (mailOptions.replyTo.length>10){ // limit to first 10 characters...
  //       logRecord.userName = mailOptions.replyTo.substr(0,10);
  //     }
  //   }
  //   app.MongoService.writeLogRecord( logRecord );  
  // }
  // SEND THE EMAIL MESSAGE....
  if (mailOptions && mailOptions.to && mailOptions.from ){
    // IF mailOptions IS VALID, SEND MAIL....
    emailTransporter.sendMail(mailOptions, function(error,info){
      if (error){
        console.log( "EMAIL ERROR");
        console.log( error );
        //callback( error, info );
      }
      else {
        console.log("EMAIL SENT");
        //callback( error, info );
      }  
    });   

  }
  else {
    // mailOptions is not valid...
    callback( {"error":"INVALID MAIL OPTIONS"}, {});
  }

}






// // Load services to operate with mongo database...
var mongoService = require('mongo_service.js');
app.MongoService = mongoService; //expose to other modules...
mongoService.setModuleDependencies( config, dbClient, fs, xml2js, ObjectID );

// Look to the routes.js file for the server-side routing that is taking place ....
var routes = require('./routes')( app );



var server = http.createServer(app).listen(config.server.port, function(){
  console.log('Express server listening on port ' + config.server.port);
  config.mailOptions.subject="HexDemo app started on port " + config.server.port;
  mongoService.pingDatabase();
  //app.sendEmailMessage();
});



var io  = require('socket.io')(http, { path: '/myapp/socket.io'}).listen(server);
//var io = require('socket.io')(server, { path: '/sockets' }).listen(server);

// io.of('/my-namespace').on('connection', function(socket){
//     console.log('a user connected with id %s', socket.id);

//     socket.on('my-message', function (data) {
//         io.of('my-namespace').emit('my-message', data);
//         // or socket.emit(...)
//         console.log('broadcasting my-message', data);
//     });
// });

var _allSockets = []; 

var sendCurrentUsers = function(){
  var arr = [];
  for (var x=0; x<_allSockets.length; x++){
    var s = _allSockets[x];
    var un = s.userName;
    arr.push( {'userName':un, 'id':s.id });
  }
  console.log( "==== USER LIST ====");
  console.log( arr );
  io.emit( 'user_list', arr );
};
   


io.on('connection', function(socket){
    console.log('a user connected with id %s', socket.id);
    socket.userName = "";
    _allSockets.push( socket );
    io.emit('server_message', socket.id );
    for (var x=0; x<_allSockets.length; x++){
      console.log( _allSockets[x].id );
    }


    socket.on('disconnect', function( data ){
      console.log('user disconnected');
      var index = _allSockets.indexOf( socket );
      _allSockets.splice( index, 1);//remove socket...
      var msg = "There are " + _allSockets.length + " users left online.";
      console.log( msg );
      io.emit( 'server_message', msg );
      sendCurrentUsers();
    });

    socket.on('user_login', function (data) {
        console.log('user_login recieved....', data);
        socket.userName = data;
        // SEND THE LIST OF USERS LOGGED IN....
        sendCurrentUsers();
    });

    // socket.on('game_state_change', function (data) {
    //     io.emit('game_state_change', data);
    //     console.log('broadcasting my-message', data);
    // });

    // THIS IS THE MAIN SERVER-SIDE EVENT FOR CHANGES TO GAME COUNTERS....
    socket.on('counter_data_changed', function( dataObj ){
      var cd = dataObj.counterData;
      var property = dataObj.changedProperty;
      var gameId = dataObj.gameId;

      console.log( 'counter_data_changed');
      console.log( property + " of " + cd.id );
      var dbCallback=function( result ){
        // PASS THE DATA ALONG TO OTHER CLIENTS....
        console.log("COUNTER DATA SAVED IN MONGO..." + cd.id );
        socket.broadcast.emit('counter_data_changed', dataObj );
      }
      // STORE THE UPDATED COUNTER DATA TO THE DATABASE...
      app.MongoService.updateCounterData( gameId, cd, dbCallback );
    });


    socket.on('app_is_closing', function (data) {
        console.log('app_is_closing');
    });
// // sending to sender-client only
// socket.emit('message', "this is a test");

// // sending to all clients, include sender
// io.emit('message', "this is a test");

// // sending to all clients except sender
// socket.broadcast.emit('message', "this is a test");

// // sending to all clients in 'game' room(channel) except sender
// socket.broadcast.to('game').emit('message', 'nice game');

// // sending to all clients in 'game' room(channel), include sender
// io.in('game').emit('message', 'cool game');

// // sending to sender client, only if they are in 'game' room(channel)
// socket.to('game').emit('message', 'enjoy the game');

// // sending to all clients in namespace 'myNamespace', include sender
// io.of('myNamespace').emit('message', 'gg');

// // sending to individual socketid
// socket.broadcast.to(socketid).emit('message', 'for your eyes only');
});
