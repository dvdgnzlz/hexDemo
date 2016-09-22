

appModule.controller('MenuController', function( MainAppService, GameStateService, SvgService, CounterService, $scope, MenuService, TerrainService ){   
	//console.log( 'MenuController ');
	$scope.menuDefs = [];
	$scope.menuPos = new Point(0,0);
	$scope.isMenuOpen = false;
	$scope.menuTitle = "";
	//$scope.$watch("$scope.menuDefs");
  $scope.toggled = function(isOpen) {
  	$scope.isMenuOpen = isOpen;
  	MenuService.setStatus( isOpen );//let the service know whether it is showing or not....
    console.log('Dropdown is now: ', $scope.isMenuOpen);
  };

	var _renderMenus = function( evt, screenPt ){
		$scope.title = MenuService.getTitle();
		$scope.menuPos = screenPt;
		$scope.menuDefs = MenuService.getMenuDefs();
		$scope.isMenuOpen = true;
		$scope.$digest();
	};
	var _hideMenus = function( ){
		$scope.isMenuOpen = false;
		$scope.$digest();
	};
	$scope.$on('SHOW_MENUS', _renderMenus );//show menus when we get the message....
	$scope.$on('HIDE_MENUS', _hideMenus );//show menus when we get the message....

});