/*
	TemmieDeck - main.js
	Main script
*/

// Main const
const MAIN = {

	info: {
		appVersion: '1.0.0'
	},

	// nw.js modules
	nw: {
		fs: require('fs'),
		path: require('path')
	},

	// Modules
	gui: tempFn_GUI,
	file: tempFn_FILE,
	player: tempFn_PLAYER,
	keyboard: tempFn_KEYBOARD,
	settings: tempFn_SETTINGS,

	// Start App
	init: function(){

		// Main label
		const appLabel = 'TemmieDeck - Version ' + this.info.appVersion;

		// Log app name
		console.info(appLabel);
		document.title = appLabel;

		// Load settings
		this.settings.load();

		// Render GUI
		this.gui.renderBootData();

		// Bind audio volume
		this.player.bindVolume();

		// Start custom loop interval
		this.player.effects.customLoop.startInterval();

		// Init keyboard
		this.keyboard.init();

	},

	// WIP function
	WIP: function(){
		window.alert('This is WIP!');
	}

}

// Delete all other modules
delete tempFn_GUI;
delete tempFn_FILE;
delete tempFn_PLAYER;
delete tempFn_KEYBOARD;
delete tempFn_SETTINGS;

// Start app
window.onload = MAIN.init();