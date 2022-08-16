/*
	TemmieDeck - file.js
	File management script
*/

tempFn_FILE = {

	// Load file API
	loadFile: function(extension, fnCallback){
		if (fnCallback){
			document.getElementById('FILE_LOADER').accept = extension;
			document.getElementById('FILE_LOADER').files = null;
			document.getElementById('FILE_LOADER').onchange = function(){
				fnCallback(document.getElementById('FILE_LOADER').files);
				document.getElementById('FILE_LOADER').accept = '';
				document.getElementById('FILE_LOADER').files = null;
			}
			TMS.triggerClick('FILE_LOADER');
		}
	},

	// Fix paths
	fixPath: function(path){
		var res = '';
		if (path !== void 0 && path !== ''){
			res = path.replace(new RegExp('\\\\', 'gi'), '/');
		}
		return res;
	},

	// Get file name
	getFileName: function(filePath){
		var res = '';
		if (filePath !== void 0){
			res = MAIN.nw.path.basename(filePath).replace(MAIN.nw.path.extname(filePath), '');
		}
		return res;
	}

}