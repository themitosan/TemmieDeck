/*
	TemmieDeck - effects.js
	Main script for volume and audio effects
*/

tempFn_EFFECTS = {

	// Effects status
	status: {
		fadeInRunning: !1,
		fadeOutRunning: !1,

		fadeInTimeout: null,
		fadeOuTimeout: null
	},

	// Fade In volume
	fadeIn: function(options){

		if (this.status.fadeInRunning === !1){

			// Lock fade
			this.status.fadeInRunning = !0;

			// Update visual cue
			if (this.customLoop.isTransitionLoop === !0){
				TMS.addClass('ICON_LOOP_TRANSITION', 'DIV_ICON_ON_OFF_ACTIVE');
			} else {
				TMS.addClass('ICON_TRANSITION_FADE_IN', 'DIV_ICON_ON_OFF_ACTIVE');
			}

			// Get current player
			var trackId = options.track,
				getPlayerData = MAIN.player.getCurrentPlayer();
	
			if (options === void 0){
				trackId = 0;
			}

			// Get fade data
			var fadeInVolume = 0.5,
				fadeTime = parseInt(MAIN.settings.data.fadeIn);
			
			// Get loop transition 
			if (this.customLoop.isTransitionLoop === !0){
				fadeTime = MAIN.settings.data.tracks[trackId].customLoop.transition;
			}

			// Fix fade being zero
			if (fadeTime < 1){
				fadeTime = 1;
			}
	
			// Check if custom volume is enabled
			if (MAIN.settings.data.tracks[trackId].customVolume.enabled === !0){	
				fadeInVolume = MAIN.settings.data.tracks[trackId].customVolume.volume;
			}
	
			// Process fade in
			$('#AUDIO_VOLUME_' + getPlayerData.currentPlayer).animate({value: fadeInVolume}, {duration: fadeTime, queue: !1});

			// Release fade
			this.status.fadeInTimeout = setTimeout(function(){

				// Release
				MAIN.player.effects.status.fadeInRunning = !1;
				
				// Update visual cue
				TMS.removeClass('ICON_LOOP_TRANSITION', 'DIV_ICON_ON_OFF_ACTIVE');
				TMS.removeClass('ICON_TRANSITION_FADE_IN', 'DIV_ICON_ON_OFF_ACTIVE');
				
				// Clear timeout
				clearTimeout(MAIN.player.effects.status.fadeInTimeout);
			
			}, parseInt(fadeTime + 10));
		}

	},

	// Fade Out volume
	fadeOut: function(options){

		if (this.status.fadeOutRunning === !1){

			// Lock fade
			this.status.fadeOutRunning = !0;

			// Update visual cue
			if (this.customLoop.isTransitionLoop === !1){
				TMS.addClass('ICON_TRANSITION_FADE_OUT', 'DIV_ICON_ON_OFF_ACTIVE');
			}

			// Get current player & fade time
			var trackId = options.track,
				getPlayerData = MAIN.player.getCurrentPlayer(),
				fadeTime = parseInt(MAIN.settings.data.fadeOut);

			// Fix
			if (options === void 0){
				trackId = 0;
			}
			
			// Get loop transition 
			if (this.customLoop.isTransitionLoop === !0){
				fadeTime = MAIN.settings.data.tracks[trackId].customLoop.transition;
			}

			// Fix fade being zero
			if (fadeTime < 1){
				fadeTime = 1;
			}
	
			// Process fade out
			$('#AUDIO_VOLUME_' + getPlayerData.nextPlayer).animate({value: 0}, {duration: (fadeTime + 1), queue: !1});

			// Release fade
			this.status.fadeOuTimeout = setTimeout(function(){

				// Release
				MAIN.player.effects.status.fadeOutRunning = !1;

				// Update visual cue
				TMS.removeClass('ICON_LOOP_TRANSITION', 'DIV_ICON_ON_OFF_ACTIVE');
				TMS.removeClass('ICON_TRANSITION_FADE_OUT', 'DIV_ICON_ON_OFF_ACTIVE');

				clearTimeout(MAIN.player.effects.status.fadeOuTimeout);

			}, parseInt(fadeTime + 10));

		}

	},
	
	/*
		Custom loop
	*/
	customLoop: {

		// Interval variable
		customLoopInterval: null,

		// Loop Transition
		isTransitionLoop: !1,

		// Start interval function
		startInterval: function(){
	
			// Log
			console.info('Starting Loop interval...');

			// Set Interval
			this.customLoopInterval = setInterval(function(){
	
				// Get custom loop active
				const customLoopEnabled = document.getElementById('ENABLE_AUDIO_CUSTOM_LOOP').checked;
				
				// Execute check if active
				if (customLoopEnabled === !0){
	
					// Variables
					var cTrack = MAIN.player.data.currentTrack,
						cPlayerId = MAIN.player.getCurrentPlayer(),
						cPlayer = document.getElementById('AUDIO_PLAYER_' + cPlayerId.currentPlayer),
						currentTime = cPlayer.currentTime,
						loopEnd = MAIN.settings.data.tracks[cTrack].customLoop.loopEnd,
						loopStart = MAIN.settings.data.tracks[cTrack].customLoop.loopStart;
	
					// console.info(currentTime + ' - ' + loopEnd);

					// Make transition
					if (currentTime === loopEnd || currentTime > loopEnd){

						// Play the same track again and set next player timestamp
						MAIN.player.effects.customLoop.isTransitionLoop = !0;
						MAIN.player.play(cTrack);
						setTimeout(function(){
							document.getElementById('AUDIO_PLAYER_' + cPlayerId.nextPlayer).currentTime = loopStart;
						}, 80);

					}
	
				}
	
			}, 10);
	
		},

		// Update transition time
		updateTransition: function(){

			// Convert data
			const cTrack = MAIN.player.data.currentTrack,
				transitionTime = parseInt(document.getElementById('TRACK_REPEAT_TRANSITION').value);

			// Set data on current track
			MAIN.settings.data.tracks[MAIN.player.data.currentTrack].customLoop.transition = transitionTime;

			// Save settings
			this.saveSettings();

		},

		// Get current time
		getCurrentTime: function(mode){

			// Variables
			var cTrack = MAIN.player.data.currentTrack,
				cPlayerId = MAIN.player.getCurrentPlayer(),
				cPlayer = document.getElementById('AUDIO_PLAYER_' + cPlayerId.currentPlayer),
				currentTime = cPlayer.currentTime;

			// Check mode
			switch (mode){

				// Return at
				case 0: 
					document.getElementById('TRACK_REPEAT_START').value = currentTime;
					MAIN.settings.data.tracks[cTrack].customLoop.loopStart = currentTime;
					break;

				// Trigger at
				case 1:
					document.getElementById('TRACK_REPEAT_END').value = currentTime;
					MAIN.settings.data.tracks[cTrack].customLoop.loopEnd = currentTime;
					break;

			}

			// Disable loop
			MAIN.settings.data.tracks[cTrack].customLoop.enabled = !1;			

			// Save settings
			this.saveSettings();

		},

		// Set Loop active
		setActive: function(){
			
			// Variables
			const cTrack = MAIN.player.data.currentTrack;
			
			// Set loop active
			MAIN.settings.data.tracks[cTrack].customLoop.enabled = JSON.parse(document.getElementById('ENABLE_AUDIO_CUSTOM_LOOP').checked);
		
			// Save settings
			this.saveSettings();

			// Update Track data
			MAIN.gui.updateTrackInfo();

		},

		// Test loop effect
		testEffect: function(){

			// Variables
			var cTrack = MAIN.player.data.currentTrack,
				cPlayer = MAIN.player.data.currentPlayer,
				triggerTime = MAIN.settings.data.tracks[cTrack].customLoop.loopEnd,
				testLoopTime = parseFloat(triggerTime - 2);

			// Enable custom loop
			MAIN.settings.data.tracks[cTrack].customLoop.enabled = !0;

			// Set time
			document.getElementById('AUDIO_PLAYER_' + cPlayer).currentTime = testLoopTime;

			// Save settings
			this.saveSettings();

		},

		// Save settings
		saveSettings: function(){

			// Variables
			const cTrack = MAIN.player.data.currentTrack;
 
			MAIN.settings.data.tracks[cTrack].customLoop.loopStart = parseFloat(document.getElementById('TRACK_REPEAT_START').value);
			MAIN.settings.data.tracks[cTrack].customLoop.loopEnd = parseFloat(document.getElementById('TRACK_REPEAT_END').value);

			// Save settings
			MAIN.settings.save({renderTrackData: !1});

			// Render current track
			MAIN.gui.renderTrackData(cTrack);

		}

	},

	/*
		Audio transition data
	*/
	audioTransition: {
		
		// Update fade master
		updateMaster: function(){

			// Get master value
			const masterValue = parseInt(document.getElementById('AUDIO_SETTINGS_TRANSITION_MASTER').value);

			// Set Values
			document.getElementById('AUDIO_SETTINGS_TRANSITION_FADE_IN').value = masterValue;
			document.getElementById('AUDIO_SETTINGS_TRANSITION_FADE_OUT').value = masterValue;

			// Set Variables
			MAIN.settings.data.fadeIn = masterValue;
			MAIN.settings.data.fadeOut = masterValue;
			MAIN.gui.tempData.transitionFadeMaster = masterValue;

			// Update labels
			document.getElementById('AUDIO_LABEL_TRANSITION_MASTER').innerHTML = masterValue;
			document.getElementById('AUDIO_LABEL_TRANSITION_FADE_IN').innerHTML = masterValue;
			document.getElementById('AUDIO_LABEL_TRANSITION_FADE_OUT').innerHTML = masterValue;

			// Save
			MAIN.settings.save();

		},

		// Update fade in
		updateFadeIn: function(){
			
			// Variable
			const fadeValue = parseInt(document.getElementById('AUDIO_SETTINGS_TRANSITION_FADE_IN').value);

			// Update Fade Data
			MAIN.settings.data.fadeIn = fadeValue;
			document.getElementById('AUDIO_LABEL_TRANSITION_FADE_IN').innerHTML = fadeValue;
		
			// Save settings
			MAIN.settings.save();

		},

		// Update fade out
		updateFadeOut: function(){
			
			// Variable
			const fadeValue = parseInt(document.getElementById('AUDIO_SETTINGS_TRANSITION_FADE_OUT').value);

			// Update Fade Data
			MAIN.settings.data.fadeOut = fadeValue;
			document.getElementById('AUDIO_LABEL_TRANSITION_FADE_OUT').innerHTML = fadeValue;
		
			// Save settings
			MAIN.settings.save();

		}

	}

}