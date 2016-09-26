///////////////////////////////////////////////////////////////
// SERVER SIDE CODE CONTROLLING THE NODE/EXPRESS URL ROUTING //
module.exports = function( app ) {
  

  app.get('/', function(req, res) {
    //console.log("**************  HERE *******************");
    // Send a plain text response
    res.send('Welcome to hexDemo!');
  });


  app.get('/UserAccount', function(req, res ){
    console.log( "/UserAccount");
    var userName = req.param('userName');
    var queryResults_01 = null;
    var queryResults_02 = null;
    var error = false;
    //console.log( userName );
    var checkIfFinished = function(){
      if (error) return; // error results already sent...
      if (queryResults_01!==null && queryResults_02!==null){
        // WE ARE DONE WITH BOTH QUERIES....
        var result = { error:null, userData: queryResults_01.resultArr[0], activeGames: [] };
        result.activeGames = queryResults_02.resultArr;
        res.json( result );
      }
    };
    var callback_02 = function( results ){
      console.log( "callback_02" );
      //console.log( results );
      queryResults_02 = results;
      if (results.error && !error ){
        error = true;
        res.json(results);
      }
      checkIfFinished();
    }
    var callback_01 = function( results ){
      console.log( "callback_01" );
      //console.log( results );
      queryResults_01 = results;
      if (results.error && !error ){
        error = true;
        res.json(results);
      }
      checkIfFinished();
    }
    app.MongoService.getUserAccountInfo( userName, callback_01 );
    app.MongoService.getActiveGamesByUser( userName, callback_02 );
  });




  app.get('/CounterDataForGame', function(req, res ){
    console.log( "/CounterDataForGame");
    var gameId = req.param('gameId');
    //console.log( gameId );
    var callback = function( results ){
      //console.log( results );
      res.json(results);
    }
    app.MongoService.getCounterDataForGame( gameId, callback );
  });



  app.post('/UpdateCounter', function(req, res ){
    console.log( "/UpdateCounter");
    var params = req.body;
    var gameId = params.gameId;
    var counterObj = params.counterData;
    //console.log( gameId );
    //console.log( counterObj );
    //res.json({});
    var callback = function( results ){
      //console.log( results );
      res.json(results);
    }
    app.MongoService.updateCounterData( gameId, counterObj, callback );
  });

  // // render an Angular partial html page using Jade templates....
  // app.get('/client_partials/config/:fileName', function(req,res){
  //   var fileName = req.params.fileName;
  //    // get ip address of the user....
  //   var ip = req.headers['x-forwarded-for'] || 
  //        req.connection.remoteAddress || 
  //        req.socket.remoteAddress ||
  //        req.connection.socket.remoteAddress;
  //   var urlLocName = 'bbs_efs#';
  //   res.render('partials/config/' + fileName, {data: {path:urlLocName, ip: ip, firstName:"Xxx",lastName:"Xxx",userId:"Xxx"}} );
  // });

  // // render an Angular partial html page using Jade templates....
  // app.get('/client_partials/note/:fileName', function(req,res){
  //   var fileName = req.params.fileName;
  //    // get ip address of the user....
  //   var ip = req.headers['x-forwarded-for'] || 
  //        req.connection.remoteAddress || 
  //        req.socket.remoteAddress ||
  //        req.connection.socket.remoteAddress;
  //   var urlLocName = 'bbs_efs#';
  //   res.render('partials/note/' + fileName, {data: {path:urlLocName, ip: ip, firstName:"Xxx",lastName:"Xxx",userId:"Xxx"}} );
  // });

  
  // RENDER JADE PARTIALS FOR MODAL DIALOGS....
  app.get('/modals/:fileName', function(req,res){
    var fileName = req.params.fileName;
     // get ip address of the user....
    var ip = req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         req.connection.socket.remoteAddress;
    var urlLocName = 'bbs_efs#';
    res.render('modals/' + fileName, {data: {path:urlLocName, ip: ip, firstName:"Xxx",lastName:"Xxx",userId:"XXx"}} );
  });
  
  // redirect users here if their browser is not IE10+
  app.get('/redirect', function(req, res) {
    // Send a plain text response
    res.send('You are not authorized to view this page.');
  });




  // MAIN ENTRY TO THE APPLICATION....
  // USES A JADE TEMPLATE CALLED main.jade....
  app.get('/main', function(req, res) {
    // get ip address of the user....
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var urlLocName = 'main#';
    // PASS THE TIME TO THE CLIENT SO WE CAN TRACK HOW LONG THE APP TAKES TO LOAD...
    // CLIENT WILL PASS IT BACK TO SERVER WHEN GETTING USER/ACCOUNT INFO....
    var serverTime = new Date().getTime();
    var date = new Date().toISOString();
    var sysAlerts = app.systemAlertArray;
    res.render('main', {data: {serverTime: serverTime, sysAlerts:sysAlerts, path:urlLocName, ip: ip, activeViewName: "All Lists", firstName:"XXX",lastName:"XXXXX",userId:"XXXXXX"}});    
  });  
 
};

