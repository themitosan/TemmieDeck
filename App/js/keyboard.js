/*
	TemmieDeck - keyboard.js
	Main script for keyboard handling
*/

tempFn_KEYBOARD = {

	// Super Keys
	superKeys: {
		ctrlLeft: !1,
		ctrlRight: !1,
		shiftLeft: !1,
		shitRight: !1
	},

	// Initialize key
	init: function(){

		// Disable super keys
		document.onkeyup = function(kp){
			MAIN.keyboard.handleSuperKeys(kp, !1);
		}

		// Disable super keys
		document.onkeydown = function(kp){
			MAIN.keyboard.handleSuperKeys(kp, !0);
		}

		// Common keypress
		document.onkeypress = function(kp){
			MAIN.keyboard.handleKbData(kp);
		}

	},

	// Disable keyboard on focus
	disableKbFocus: function(){
		document.getElementById('AUDIO_PLAYER_ENABLE_CONTROLS').checked = !1;
	},

	// Enable keyboard on blur
	enableKbFocus: function(){
		document.getElementById('AUDIO_PLAYER_ENABLE_CONTROLS').checked = !0;
	},

	// Handle super keys
	handleSuperKeys: function(kp, status){

		// Variables
		const kType = kp.code,
			enableControls = document.getElementById('AUDIO_PLAYER_ENABLE_CONTROLS').checked;

		// console.info(kp);

		// if controls are enabled
		if (enableControls === !0){

			switch (kType){

				// Left Control
				case 'ControlLeft':
					MAIN.keyboard.superKeys.ctrlLeft = status;
					break;

				// Right Control
				case 'ControlRight':
					MAIN.keyboard.superKeys.ctrlRight = status;
					break;

				// Right Shift
				case 'ShiftRight':
					MAIN.keyboard.superKeys.shitRight = status;
					break;

				// Left Shift
				case 'ShiftLeft':
					MAIN.keyboard.superKeys.shiftLeft = status;
					break;

			}

		}

	},

	// Handle common keyboard press data
	handleKbData: function(kp){

		const kType = kp.code,
			enableControls = document.getElementById('AUDIO_PLAYER_ENABLE_CONTROLS').checked,
			checkConditions = [
				enableControls === !0,
				MAIN.keyboard.superKeys.shiftLeft === !0,
				MAIN.keyboard.superKeys.ctrlLeft === !1
			];
			
		// console.info(kp);

		// If controls are enabled
		if (checkConditions.indexOf(!1) === -1){

			switch (kType){
	
				// 0
				case 'Digit0':
					MAIN.player.effects.customLoop.isTransitionLoop = !1;
					MAIN.player.play(0);
					break;
	
				// 1
				case 'Digit1':
					MAIN.player.effects.customLoop.isTransitionLoop = !1;
					MAIN.player.play(1);
					break;
	
				// 2
				case 'Digit2':
					MAIN.player.effects.customLoop.isTransitionLoop = !1;
					MAIN.player.play(2);
					break;
	
				// 3
				case 'Digit3':
					MAIN.player.effects.customLoop.isTransitionLoop = !1;
					MAIN.player.play(3);
					break;
	
				// 4
				case 'Digit4':
					MAIN.player.effects.customLoop.isTransitionLoop = !1;
					MAIN.player.play(4);
					break;
	
				// 5
				case 'Digit5':
					MAIN.player.effects.customLoop.isTransitionLoop = !1;
					MAIN.player.play(5);
					break;
	
				// 6
				case 'Digit6':
					MAIN.player.effects.customLoop.isTransitionLoop = !1;
					MAIN.player.play(6);
					break;
	
				// 7
				case 'Digit7':
					MAIN.player.effects.customLoop.isTransitionLoop = !1;
					MAIN.player.play(7);
					break;
	
				// 8
				case 'Digit8':
					MAIN.player.effects.customLoop.isTransitionLoop = !1;
					MAIN.player.play(8);
					break;
	
				// 9
				case 'Digit9':
					MAIN.player.effects.customLoop.isTransitionLoop = !1;
					MAIN.player.play(9);
					break;
	
				// Mute Players
				case 'KeyM': {
					MAIN.gui.toggleCheckBox('AUDIO_PLAYER_MUTE');
					MAIN.player.checkMuted();
				}

				// Decrease Volume
				case 'KeyQ': {
					MAIN.player.updateVolume(0);
					break;
				}

				// Increase Volume
				case 'KeyW': {
					MAIN.player.updateVolume(1);
					break;
				}

			}

		}
	}

}