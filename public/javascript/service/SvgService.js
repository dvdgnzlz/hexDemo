
appModule.service("SvgService", function( GameStateService){
	//console.log("SvgService");
	this.svg = Snap("#oSvgPanel");
	var mapSize = GameStateService.getMapPixelSize();
	//var image = this.svg.image("images/BCS-LB-Big-Map.png", 0,0, mapSize.x, mapSize.y);	
		this.svg.node.style.position = "absolute";
		//this.svg.node.style.width = 1000;
		//this.svg.node.style.height = 800;
		this.svg.attr({"width":mapSize.x, "height":mapSize.y});
	//console.log(image);
	this.onWinScroll=function( xOffset, yOffset ){// called by MainAppService when window scrolls....
		//console.log('got it ' + xOffset + ", " + yOffset );
		//image.attr( { x:xOffset*-1, y:yOffset*-1 });

		//console.log(this.svg);
		
		//this.svg.node.style.left = xOffset;
		//this.svg.node.style.top = yOffset;
		//alert(this.svg.node.clientLeft);
	};
});