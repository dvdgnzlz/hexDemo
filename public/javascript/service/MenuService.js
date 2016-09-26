



appModule.service('MenuService', function( $rootScope, $timeout ){
    console.log("MenuService");
    // RESPONSIBLE FOR HOLDING THE DATA MODEL OF ALL MENUS TO BE RENDERED BY THE UI....
    var _that = this;
    var _menuDefArr = [];
    var _title = "";
    var _isOpen = false;
    var _context = null;

    this.isOpenToContext = function( context ){
        if (context==_context){
            return _isOpen;
        }
        return false;
    }
    this.setStatus = function( isOpen ){
        _isOpen = isOpen;
    };
    this.getMenuDefs = function(){
        return _menuDefArr;
    };
    this.getTitle = function(){
        return _title;
    };
    this.clearMenus = function(){
        console.log( "MenuService.clearMenus...");
        _menuDefArr = [];
        $rootScope.$broadcast("HIDE_MENUS" );
    };
    this.renderMenus = function( title, x, y, context ){
        console.log( "MenuService.renderMenus...");
        if (context==_context && _isOpen){
            console.log( "Not rendering due to same context");
            _that.clearMenus();
            return;
        }
        _context = context;
        _title = title;
        // IF WE DON'T PUT THIS ON A DELAY, THE MENU IMMEDIATELY HIDES (THIS SEEMS TO LET THE HIDE MESSAGE GO FIRST)....
        $timeout( function(){
            $rootScope.$broadcast("SHOW_MENUS", new Point(x,y) );
        },1);
        //$rootScope.$broadcast("SHOW_MENUS", new Point(x,y) );
    };
    this.addMenu = function( title, func ){
        console.log( "MenuService.addMenu " + title );
        _menuDefArr.push( {"title":title, "onClickFn":func } );
    };  

    // var func = function(){ alert('hi'); };
    // this.addMenu( "First", func );
    // this.addMenu( "Second", func );
});


