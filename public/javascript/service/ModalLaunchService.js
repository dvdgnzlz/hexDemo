// USE THIS SERVICE TO LAUNCH ALL MODAL DIALOGS....
appModule.service("ModalLaunchService", function( $uibModal ){


  var _genericOkCb = function( callback ){
    var _genericOk = function( returnObj ){
      console.log("MODAL OK");
      //console.log( returnObj );
      if(callback){
        callback( returnObj );
      }
    };
    return _genericOk; // return a function within a closure that tracks its callback fn...
  };
  

  var _genericCancelCb = function( callback ){
    var _genericCancel = function( ){
      console.log('MODAL CANCEL');
      if (callback){
        callback( null ); //cancel....
      }
    };
    return _genericCancel; // return a function within a closure that tracks its callback fn...
  };


  this.openLoginModal = function ( paramObj, callback ) {
    var modalInstance = $uibModal.open({
      //animation: true,
      templateUrl: 'modals/LoginModal',
      controller: 'LoginModalInstanceCtrl',
      controllerAs: '$modalCtrl', // how the HTML refers to the controller.... 
      size: 'md',
      backdrop:'static', // prevent closing by clicking on background.
      resolve: {
        params: function(){ return paramObj; }
      }
    });//end modalInstance definition...
    modalInstance.result.then( _genericOkCb(callback), _genericCancelCb(callback) );
  };//end function...


});//end Service...
