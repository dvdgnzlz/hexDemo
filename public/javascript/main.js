var appModule = angular.module('App', [ 'ui.bootstrap' ]);






// TRACK USER ACCOUNT INFORMATION HERE....
appModule.service("AccountService", function( $uibModal ){

});




// CALLED FROM main.jade.  Initializes MainAppService, which is where most of the game init occurs....
appModule.controller('AppController', function( MainAppService, GameStateService, SvgService, CounterService, $scope, MenuService ){   
	//console.log( 'AppController ');
});