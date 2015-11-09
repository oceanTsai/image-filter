/** 
 	The MIT License (MIT)

	Copyright (c) 2015 Ocean

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE. 
 */
(function(window, document){
	
	//--------------------------
	//  
	//-------------------------- 
	var ImageFilter = (function(window, document){
		MOSAIC_TYPE = { CIRCEL : 'circel',  RECTANGLE :'rectangle'};
		//-- private scope --
		var negative = function(image, picType){
			var canvas = document.createElement("canvas");
			    canvas.width = image.width;
			    canvas.height = image.height;
			//clone image
			var context = canvas.getContext("2d");
				context.drawImage(image, 0, 0);
			//get image binrary data
			var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
        	var data = imgData.data;
	        //主要公式
	        for (var i=0, dataSize=imgData.data.length; i < dataSize ; i=i+4) {
	                    imgData.data[i]   = 255 - imgData.data[i];   //R
	                    imgData.data[i+1] = 255 - imgData.data[i+1]; //G
	                    imgData.data[i+2] = 255 - imgData.data[i+2]; //B                 
	        }
	        context.putImageData(imgData, 0, 0);
	        var dataURL = canvas.toDataURL("image/"+picType);
	        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
		};

		var gray = function(image, picType){
			var canvas = document.createElement("canvas");
			    canvas.width = image.width;
			    canvas.height = image.height;
			//clone image
			var context = canvas.getContext("2d");
				context.drawImage(image, 0, 0);
			//get image binrary data
			var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
        	var data = imgData.data;
	        //主要公式
	         for (var i=0, dataSize=imgData.data.length; i < dataSize ; i=i+4) {
                    var r = data[i] ;
                    var g = data[i + 1];
                    var b = data[i + 2];
                    //灰階主要計算公式
                    /*
                    data[i] = (r * 0.272) + (g * 0.534) + (b * 0.131);
                    data[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
                    data[i + 2] = (r * 0.393) + (g * 0.769) + (b * 0.189);
                    */
                    //TODO: 之後將參數調整成 api 參數
                    data[i] = ((r * 0.272) + (g * 0.534) + (b * 0.131)) / 1.5   | 0;
                    data[i + 1] = ((r * 0.349) + (g * 0.686) + (b * 0.168))/1.5 | 0;
                    data[i + 2] = ((r * 0.393) + (g * 0.769) + (b * 0.189))/1.5 | 0;
                    /*
                    data[i] = ((r * 0.272) + (g * 0.534) + (b * 0.131)) / 2;
                    data[i + 1] = ((r * 0.349) + (g * 0.686) + (b * 0.168))/2;
                    data[i + 2] = ((r * 0.393) + (g * 0.769) + (b * 0.189))/2;
                    */
        	}
	        context.putImageData(imgData, 0, 0);
	        var dataURL = canvas.toDataURL("image/"+picType);
	        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
		};

		
		var circelMosaic = function(image, picType){
			var canvas = document.createElement("canvas");
			    canvas.width = image.width;
			    canvas.height = image.height;
			var context = canvas.getContext("2d");
	        //context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
	        context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);  
	        var imageData = context.getImageData(0, 0, canvas.width, canvas.height); 
	        var pixels = imageData.data; 
	        context.clearRect(0, 0, canvas.width, canvas.height); 
	        var numTileRows = 20; 
	        var numTileCols = 20; 
	        var tileWidth = imageData.width/numTileCols; 
	        var tileHeight = imageData.height/numTileRows; 
	        for (var r = 0; r < numTileRows; r++) { 
	                for (var c = 0; c < numTileCols; c++) { 
	                     var x = (c*tileWidth)+(tileWidth/2); 
	                     var y = (r*tileHeight)+(tileHeight/2);                     
	                     var pos = (Math.floor(y)*(imageData.width*4))+(Math.floor(x)*4); 
	                     var red = pixels[pos]; 
	                     var green = pixels[pos+1]; 
	                     var blue = pixels[pos+2]; 
	                    context.fillStyle = "rgb("+red+", "+green+", "+blue+")"; 
	                    //繪製方式換成圓
	                    context.beginPath(); 
	                    context.arc(x, y, tileWidth/2, 0, Math.PI*2, false); 
	                    context.closePath(); 
	                    context.fill(); 
	                }; 
			};
			var dataURL = canvas.toDataURL("image/"+picType);
	        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
		};

		var rectangleMosaic = function(image, picType){
			var canvas = document.createElement("canvas");
			    canvas.width = image.width;
			    canvas.height = image.height;
			var context = canvas.getContext("2d");
	        //context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
	        context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);  
	        var imageData = context.getImageData(0, 0, canvas.width, canvas.height); 
	        var pixels = imageData.data; 

	        context.clearRect(0, 0, canvas.width, canvas.height); 
	        
	        //馬賽克磚塊數量
	        var numTileRows = 50; 
	        var numTileCols = 50; 

	        //每一塊馬賽克磚的長寬
	        var tileWidth = imageData.width/numTileCols; 
	        var tileHeight = imageData.height/numTileRows; 
	        //馬賽克主要演算邏輯
	        for (var r = 0; r < numTileRows; r++) { 
	                for (var c = 0; c < numTileCols; c++) { 
	                    //顏色取樣點,該取樣點的周圍九宮格,將會與此點設成同色
	                    var x = (c*tileWidth)+(tileWidth/2); 
	                    var y = (r*tileHeight)+(tileHeight/2);                     
	                    var pos = (Math.floor(y)*(imageData.width*4))+(Math.floor(x)*4); 
	                     
	                    //取得顏色
	                    var red = pixels[pos]; 
	                    var green = pixels[pos+1]; 
	                    var blue = pixels[pos+2]; 
	                     //重新填滿色塊
	                    context.fillStyle = "rgb("+red+", "+green+", "+blue+")"; 
	                    context.fillRect(x-(tileWidth/2), y-(tileHeight/2), tileWidth, tileHeight); 
	                }; 
	        }; 
	        var dataURL = canvas.toDataURL("image/"+picType);
	        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
		};

		var mosaic = function(image, picType, mosaitType){
			switch(mosaitType){
				case MOSAIC_TYPE.CIRCEL : 
					return circelMosaic(image, picType);
					break;
				case MOSAIC_TYPE.RECTANGLE:
					return rectangleMosaic(image, picType);
					break;
			}
			
		};

		//-- public scope --
		return module = {
			MOSAIC_TYPE : MOSAIC_TYPE,
			negativeBase64 : negative,
			grayBase64 : gray,
			mosaicBase64 : mosaic
		};
	})(window, document);
		
			
	if(!window.ImageFilter){		
		window.ImageFilter = ImageFilter;
	}
	
	if(typeof(module)!= "undefined"){
		module.exports = ImageFilter;
	}
}).call(this, window, document);