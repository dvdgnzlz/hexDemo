///////////////////////////////////////////////////////////////
// SERVER SIDE CODE CONTROLLING THE NODE/EXPRESS URL ROUTING //
module.exports = function( app ) {
  

  app.get('/', function(req, res) {
    //console.log("**************  HERE *******************");
    // Send a plain text response
    res.send('Welcome to hexDemo!');
  });



  // render an Angular partial html page using Jade templates....
  app.get('/client_partials/config/:fileName', function(req,res){
    var fileName = req.params.fileName;
     // get ip address of the user....
    var ip = req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         req.connection.socket.remoteAddress;
    var urlLocName = 'bbs_efs#';
    res.render('partials/config/' + fileName, {data: {path:urlLocName, ip: ip, firstName:"Xxx",lastName:"Xxx",userId:"Xxx"}} );
  });

  // render an Angular partial html page using Jade templates....
  app.get('/client_partials/note/:fileName', function(req,res){
    var fileName = req.params.fileName;
     // get ip address of the user....
    var ip = req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         req.connection.socket.remoteAddress;
    var urlLocName = 'bbs_efs#';
    res.render('partials/note/' + fileName, {data: {path:urlLocName, ip: ip, firstName:"Xxx",lastName:"Xxx",userId:"Xxx"}} );
  });

  
  // render an Angular partial html page using Jade templates....
  app.get('/client_partials/:fileName', function(req,res){
    var fileName = req.params.fileName;
     // get ip address of the user....
    var ip = req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         req.connection.socket.remoteAddress;
    var urlLocName = 'bbs_efs#';
    res.render('partials/' + fileName, {data: {path:urlLocName, ip: ip, firstName:"Xxx",lastName:"Xxx",userId:"XXx"}} );
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

