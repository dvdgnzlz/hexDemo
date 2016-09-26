// MANAGE REQUESTS TO THE SERVER HERE....
appModule.service("HttpService", function( $uibModal, $http){


	this.getUserAccountInfo = function( userName, callback ){
    //console.log( "ProblemDurationService:_fnLoadProblemDurations");
    var config={
      method: "GET",
      url: '/UserAccount/' ,
      params: {userName: userName }
    }; 
    $http( config ).success(function(response) {
       console.log( JSON.stringify( response ) );
       callback( response );
    }).error(function(err, err2, err3){
      console.log('ERORR!');
      console.log(err);
      callback( {error: err } );
    }); 		
	}//end function...


  this.updateCounterData = function( gameId, counterData ){
    var config={
      method: "POST",
      url: '/UpdateCounter/' ,
      data: {gameId: gameId, counterData: counterData }
    }; 
    $http( config ).success(function(response) {
      console.log( "/UpdateCounter called....");
       console.log( JSON.stringify( response ) );
       //callback( response );
    }).error(function(err, err2, err3){
      console.log('ERORR!');
      console.log(err);
      //callback( {error: err } );
    }); 
  };//end function...



  this.getCounterDataForGame = function( gameId, callback ){
    var config={
      method: "GET",
      url: '/CounterDataForGame/' ,
      params: {gameId: gameId }
    }; 
    $http( config ).success(function(response) {
      console.log( "/CounterDataForGame returned....");
      //console.log( JSON.stringify( response ) );
      if (callback) callback( response );
    }).error(function(err, err2, err3){
      console.log('ERORR!');
      console.log(err);
      callback( {error: err } );
    }); 
  };//end function...

});//end HttpService....
