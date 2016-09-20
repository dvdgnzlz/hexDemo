////////////////////////////////////////////////////////////////////
// SERVER SIDE CODE CONTROLLING THE MAIN NODE/EXPRESS APPLICATION //
//xxx

var os = require('os');
var fs = require('fs');
var path = require('path');
var util = require('util');
var bodyParser = require('body-parser'); //ALLOW POST TO SUBMIT DATA IN THE BODY OF THE MESSAGE....


// Load application configuration service...
var appConfigService = require('app_config.js');
var config = appConfigService.getConfig(os);

var http = require('http');
var https = require('https');

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



http.createServer(app).listen(config.server.port, function(){
  console.log('Express server listening on port ' + config.server.port);
  config.mailOptions.subject="HexDemo app started on port " + config.server.port;
  mongoService.pingDatabase();
  //app.sendEmailMessage();
});
