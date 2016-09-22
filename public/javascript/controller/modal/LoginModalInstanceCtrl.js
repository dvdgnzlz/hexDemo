appModule.controller('LoginModalInstanceCtrl', function( $uibModalInstance, params, $timeout ){

	console.log( "params" );
	console.log( params );
  var $ctrl = this;
  $ctrl.params = params;

  var focusField = function(){
  	$('#oLoginUserName').focus();
  };
  $timeout( focusField, 500 );
  $ctrl.ok = function () {
    $uibModalInstance.close( params );
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});