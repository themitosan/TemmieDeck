/*
	TemmieDeck - gui.js
	GUI functions
*/

tempFn_GUI = {

	/*
		GUI Functions
	*/

	tempData: {
		volume_1: 0,
		volume_2: 0,
		loopStart: 0,
		loopEnd: 1100,
		trackName: '',
		transitionFadeIn: 1000,
		transitionFadeOut: 1000,
		transitionFadeMaster: 1000
	},

	// Render track data
	renderTrackData: function(trackId){

		// Get track data
		const trackData = MAIN.settings.data.tracks[parseInt(trackId)];

		// Update track data
		document.getElementById('TRACK_FILE_NAME_' + trackId).innerHTML = trackData.fileName;
		document.getElementById('TRACK_CUSTOM_VOLUME_' + trackId).value = trackData.customVolume.volume;
		document.getElementById('TRACK_ENABLE_CUSTOM_VOLUME_' + trackId).checked = JSON.parse(trackData.customVolume.enabled);

		// Render custom loop data
		document.getElementById('TRACK_REPEAT_END').value = trackData.customLoop.loopEnd;
		document.getElementById('TRACK_REPEAT_START').value = trackData.customLoop.loopStart;
		document.getElementById('AUDIO_LABEL_LOOP_TRANSITION').innerHTML = trackData.customLoop.transition;
		document.getElementById('TRACK_REPEAT_TRANSITION').value = parseInt(trackData.customLoop.transition);
		document.getElementById('ENABLE_AUDIO_CUSTOM_LOOP').checked = JSON.parse(trackData.customLoop.enabled);
		
	},

	// Update GUI on play
	updatePlayingTrack: function(){
	
		// Get current track
		const cTrack = MAIN.player.data.currentTrack;

		// Update playing track	
		for (var i = 0; i < 10; i++){
			TMS.removeClass('TRACK_FILE_NAME_' + i, 'TRACK_FILE_NAME_PLAY');
		}
		TMS.addClass('TRACK_FILE_NAME_' + cTrack, 'TRACK_FILE_NAME_PLAY');

		// Update track name
		var sPlayer = 1, cPlayer = MAIN.player.data.currentPlayer;
		if (cPlayer === 1){
			sPlayer = 2;
		}
		document.getElementById('AUDIO_LABEL_TRACK_NAME_' + sPlayer).title = '';
		document.getElementById('AUDIO_LABEL_TRACK_NAME_' + sPlayer).innerHTML = 'No audio playing';
		document.getElementById('AUDIO_LABEL_TRACK_NAME_' + cPlayer).title = MAIN.settings.data.tracks[cTrack].fileName;
		document.getElementById('AUDIO_LABEL_TRACK_NAME_' + cPlayer).innerHTML = this.filterTrackNameLength(MAIN.settings.data.tracks[cTrack].fileName);

		// Update track info
		this.updateTrackInfo();
		this.renderTrackData(cTrack);

	},

	// Render GUI on boot
	renderBootData: function(){

		// Render track list
		var HTML_TEMPLATE = '';
		for (var i = 0; i < 10; i++){
			const trackData = MAIN.settings.data.tracks[i];
			HTML_TEMPLATE = '<div class="TRACK_HOLDER"><div class="TRACK_SHORTCUT_ID">' + i + '</div>' + 
							'<input type="button" class="APP_BUTTON_LOAD_TRACK" onclick="MAIN.player.loadTrack(' + i + ');" value="Load File">' +
							'<div class="TRACK_FILE_NAME" id="TRACK_FILE_NAME_' + i + '">No file loaded</div>' + 
							'<input type="checkbox" title="Enable custom volume" id="TRACK_ENABLE_CUSTOM_VOLUME_' + i + '" onchange="MAIN.settings.getCustomVolume(' + i + ');">' +
							'<input type="range" min="0" title="Custom volume level" max="1" step="0.001" id="TRACK_CUSTOM_VOLUME_' + i + '" onchange="MAIN.settings.getCustomVolume(' + i + ');"></div>';

			// Append track list and render it's data
			TMS.append('DIV_TRACK_LIST', HTML_TEMPLATE);
		}

		// JS Timing bullshit
		setTimeout(function(){
			for (var i = 0; i < 10; i++){
				MAIN.gui.renderTrackData(i);
			}
		}, 100);

		// Read audio transition
		document.getElementById('AUDIO_SETTINGS_TRANSITION_FADE_IN').value = MAIN.settings.data.fadeIn;
		document.getElementById('AUDIO_SETTINGS_TRANSITION_FADE_OUT').value = MAIN.settings.data.fadeOut;

		document.getElementById('AUDIO_LABEL_TRANSITION_FADE_IN').innerHTML = MAIN.settings.data.fadeIn;
		document.getElementById('AUDIO_LABEL_TRANSITION_FADE_OUT').innerHTML = MAIN.settings.data.fadeOut;

		// Read audio loop
		document.getElementById('AUDIO_LABEL_LOOP_TRANSITION').innerHTML = MAIN.settings.data.tracks[MAIN.player.data.currentTrack].customLoop.transition;

		// Set interval to update labels
		setInterval(function(){
			MAIN.gui.updateLabels();
		}, 80);

	},

	/*
		Label functions
	*/
	updateLabels: function(){		
		// Volume levels
		for (var i = 1; i < 3; i++){
			var cVolume = document.getElementById('AUDIO_VOLUME_' + i).value;
			if (MAIN.gui.tempData['volume_' + i] !== cVolume){
				MAIN.gui.tempData['volume_' + i] = cVolume;
				document.getElementById('AUDIO_LABEL_VOLUME_' + i).innerHTML = this.parsePercentage(cVolume, 1);
			}
		}
	},

	// Update track info (top-right corner)
	updateTrackInfo: function(){

		// Get current track
		const cTrack = MAIN.player.data.currentTrack,
			customLoopEnabled = MAIN.settings.data.tracks[cTrack].customLoop.enabled.toString(),
			customVolumeEnabled = MAIN.settings.data.tracks[cTrack].customVolume.enabled.toString();

		// Current track
		document.getElementById('AUDIO_LABEL_TRACK_INFO_currentTrack').innerHTML = cTrack;

		// File size
		document.getElementById('AUDIO_LABEL_TRACK_INFO_fileSize').innerHTML = this.getFileSize(MAIN.player.data.currentFile);

		// Custom Loop active and Custom Volume
		document.getElementById('AUDIO_LABEL_LOOP_TRANSITION').innerHTML = MAIN.settings.data.tracks[MAIN.player.data.currentTrack].customLoop.transition;
		document.getElementById('AUDIO_LABEL_TRACK_INFO_customLoopEnabled').innerHTML = customLoopEnabled.toUpperCase().slice(0, 1) + customLoopEnabled.slice(1);
		document.getElementById('AUDIO_LABEL_TRACK_INFO_customVolumeEnabled').innerHTML = customVolumeEnabled.toUpperCase().slice(0, 1) + customVolumeEnabled.slice(1);

	},

	/*
		Misc functions
	*/

	// Toggle checkbox
	toggleCheckBox: function(domId){
		var state = document.getElementById(domId).checked;
		if (state === !0){
			state = !1;
		} else {
			state = !0;
		}
		document.getElementById(domId).checked = state;
	},

	// Parse percentage
	parsePercentage: function(current, maximum){
		var res = 0;
		if (current !== void 0 && maximum !== void 0){
			res = Math.floor((current / maximum) * 100);
		}
		return res;
	},

	// Filter track name length
	filterTrackNameLength: function(trackName){
		var res = trackName;
		if (trackName.length > 30){
			res = trackName.slice(0, 25) + '...';
		}
		return res;
	},

	// Get file size
	getFileSize: function(filePath, mode){
		
		var res = 0;
		if (MAIN.nw.fs.existsSync(filePath) === !0){
			
			// Get status from file
			var bytes = MAIN.nw.fs.statSync(filePath).size,
				units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

   			for (var i = 0; bytes > 1024; i++){
   			    bytes /= 1024;
   			}

			res = bytes.toFixed(1) + ' ' + units[i];

		}

		return res;
	}

}