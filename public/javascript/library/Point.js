

function Point( x, y ){
	this.x = x;
	this.y = y;
	this.isEqualTo = function(point){
		return (this.x==point.x && this.y==point.y);
	};
}//end Point....

//======================


