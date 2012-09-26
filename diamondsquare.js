/*
	DiamondSquare!
	http://github.com/cgiffard/DiamondSquare
	
*/

(function(glob) {
	
	function DiamondSquare(data,width,height,roughness) {
		if (width * height !== data.length)
			throw Error("Data length mismatch.");
		
		this.dataStore	= data && data.length >= 4 ? data : [0,0,0,0];
		this.height		= height > 1 ? height : 2;
		this.width		= width > 1 ? width : 2;
		this.roughness	= roughness;
		this.iteration	= 1;
	}
	
	DiamondSquare.prototype.iterate = function() {
		var tmpDiamondingArray = [], finalArray = [], x, y,
			tmpXDoubledGrid = [], tmpDoubledGrid = [];
		
		// Double and interpolate the grid.
		
		// Double the width of each row
		for (var row = 0; row < this.height; row ++) {
			tmpXDoubledGrid.push(this.interpolateRow(row));
		}
		
		// Now add additional rows by interpolating vertically
		for (y = 0; y < tmpXDoubledGrid.length -1; y++) {
			tmpDoubledGrid.push(tmpXDoubledGrid[y]);
			tmpDoubledGrid.push(
				this.interpolateRowsVertically(
						tmpXDoubledGrid[y],
						tmpXDoubledGrid[y+1]));
		}
		
		// And add the last row back in...
		tmpDoubledGrid.push(tmpXDoubledGrid[tmpXDoubledGrid.length-1]);
		
		// Now comes the diamond part of the equation.
		// Calculate for roughness!
		for (y = 0; y < tmpDoubledGrid.length; y++) {
			if (y % 2) {
				var prevRow = tmpDoubledGrid[y-1],
					nextRow = tmpDoubledGrid[y-1],
					square = [];
				tmpDiamondingArray = tmpDoubledGrid[y];
				for (x = 0; x < tmpDiamondingArray.length; x++) {
					if (x % 2) {
						square = [
							prevRow[x],
							tmpDiamondingArray[x-1],
							tmpDiamondingArray[x+1],
							nextRow[x] ];
						
						var sqMax = Math.max.apply(Math,square),
							sqMin = Math.min.apply(Math,square),
							sqDif = sqMax - sqMin,
							interpolatedMedian = sqMin + sqDif/2;
						
						var rough = ((sqDif / this.iteration) * this.roughness) * (Math.random()-0.5),
							newHeight = interpolatedMedian + rough;
						
						tmpDiamondingArray[x] = newHeight;
					}
				}
				
				finalArray = finalArray.concat(tmpDiamondingArray);
			} else {
				finalArray = finalArray.concat(tmpDoubledGrid[y]);
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
	
	DiamondSquare.prototype.interpolateRowsVertically = function(r1,r2) {
		var mixRow = [];
		for (var rowPointer = 0; rowPointer < r1.length; rowPointer ++) {
			mixRow.push(this.interpolate(r1[rowPointer],r2[rowPointer]));
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
	
	glob.DiamondSquare = DiamondSquare;
	
})(this);