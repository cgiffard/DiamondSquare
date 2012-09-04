function DiamondSquare(data,width,height,roughness) {
	if (width * height !== data.length)
		throw Error("Data length mismatch.");
	
	this.dataStore	= data && data.length >= 4 ? data : [0,0,0,0];
	this.height		= height > 1 ? height : 2;
	this.width		= width > 1 ? width : 2;
	this.roughness	= roughness <= 1 ? roughness : 0.1;
	this.iteration	= 1;
}

DiamondSquare.prototype.iterate = function() {
	var tmpDiamondingArray = [], finalArray = [], x, y, r1, r2, ri;
	
	for (x = 0; x < this.width - 1; x ++) {
		for (y = 0; y < this.height - 1; y ++) {
			var square = this.getSquare(x,y),
				sqMax = Math.max.apply(Math,square),
				sqMin = Math.min.apply(Math,square),
				sqDif = sqMax - sqMin,
				interpolatedMedian = sqMin + sqDif/2;
			
			if (isNaN(interpolatedMedian)) interpolatedMedian = sqMin;
			
			var rough = (sqDif * this.roughness) * (Math.random()-0.5),
				newHeight = interpolatedMedian + rough;
			
			tmpDiamondingArray.push(newHeight);
		}
	}
	
	for (y = 0; y < this.height; y ++) {
		r1 = this.interpolateRow(y);
		
		if (this.rowExists(y+1)) {
			r2 = this.interpolateRow(y+1);
			ri = this.interpolateRowsVertically(r1,r2,tmpDiamondingArray);
			finalArray = finalArray.concat(r1,ri);
		} else {
			finalArray = finalArray.concat(r1);
		}
		
		
	}
	
	// Save our new width, height, and iteration
	this.width = (this.width*2) -1;
	this.height = (this.height*2) -1;
	this.iteration ++;
	
	this.dataStore = finalArray;
};

DiamondSquare.prototype.getSquare = function(x,y) {
	var cursor = (y * this.width) + x,
		firstRow = this.dataStore.slice(cursor,cursor+2),
		secondRow = this.dataStore.slice(cursor+this.width,cursor+this.width+2);
	
	return firstRow.concat(secondRow);
};

DiamondSquare.prototype.rowExists = function(y) {
	if (this.dataStore.length > y * this.width) return true;
	return false;
};

DiamondSquare.prototype.interpolateRow = function(y) {
	var cursor = 0, row = [], val1 = 0, val2 = 0;
	
	// Interpolate real row...
	for (x = 0; x < this.width - 1; x ++) {
		cursor = (y * this.width) + x;
		val1 = this.dataStore[cursor];
		val2 = this.dataStore[cursor+1];
		vali = this.interpolate(val1,val2);
		
		row.push(val1,vali);
		
		if (x === this.width-2) row.push(val2);
	}
	
	return row;
};

DiamondSquare.prototype.interpolateRowsVertically = function(r1,r2,diamond) {
	var mixRow = [];
	for (var rowPointer = 0; rowPointer < r1.length; rowPointer ++) {
		
		if (diamond && rowPointer%2) {
			mixRow.push(diamond[((rowPointer+1)/2)-1]);
		} else {
			mixRow.push(this.interpolate(r1[rowPointer],r2[rowPointer]));
		}
	}
	
	return mixRow;
};

DiamondSquare.prototype.interpolate = function(val1,val2) {
	var max = Math.max(val1,val2), min = Math.min(val1,val2),
		result = max !== min ? ((max-min)/2) + min : min;
	return !isNaN(result) ? result : min;
};

DiamondSquare.prototype.max = function() {
	return Math.max.apply(Math,this.dataStore);
};

DiamondSquare.prototype.min = function() {
	return Math.min.apply(Math,this.dataStore);
};

window.DiamondSquare = DiamondSquare;