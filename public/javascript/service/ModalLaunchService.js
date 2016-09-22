// USE THIS SERVICE TO LAUNCH ALL MODAL DIALOGS....
appModule.service("ModalLaunchService", function( $uibModal ){
  this.openLoginModal = function ( paramObj ) {
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
    
    modalInstance.result.then(
    	// OK CLICKED....
    	function (returnObj) { 
	      console.log("RETURN VALUE");
	      console.log( returnObj );
    	}, 
    	// CANCEL CLICKED....
    	function () {
      console.log('Modal dismissed at: ' + new Date());
    	}
    );// end result.then...
	};
});
