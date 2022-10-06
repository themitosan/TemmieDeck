/*
	TemmieDeck - player.js
	Responsible for player functions
*/

tempFn_PLAYER = {

	// Modules
	effects: tempFn_EFFECTS,

	// Player data
	data: {
		
		// Players
		players: {
			1: { volume: 0 },
			2: { volume: 0 }
		},

		// Current Player
		currentPlayer: 1,

		// Current Track
		currentFile: '',
		currentTrack: 1,
		trackLength: 0,

		// Pause interval
		pauseTimeout: null

	},

	// Get current player
	getCurrentPlayer: function(){

		// Variables
		var nPlayer = 1, sPlayer = 2;
		
		// Set next player
		if (this.data.currentPlayer === 1){
			nPlayer = 2;
			sPlayer = 1;
		}

		return {nextPlayer: nPlayer, currentPlayer: sPlayer};
	},

	// Play Music
	play: function(trackId){

		// Variables
		var canPlay = !0,
			errorReason = '',
			pData = this.getCurrentPlayer(),
			nPlayer = pData.nextPlayer,
			sPlayer = pData.currentPlayer,
			nextTrackData = MAIN.settings.data.tracks[trackId],
			fadeTime = parseInt(MAIN.settings.data.fadeOut + 10);

		// Spawn error
		const blockPlay = function(msg){
			canPlay = !1;
			errorReason = errorReason + msg;
		}

		// Get custom loop transition time
		if (this.effects.customLoop.isTransitionLoop === !0){
			fadeTime = parseInt(nextTrackData.customLoop.transition + 10);
		}

		// Check if next file exists
		if (MAIN.nw.fs.existsSync(nextTrackData.src) === !1){
			blockPlay('The location for this track does not exists!');
		}

		// Check if can play
		if (canPlay === !0){

			// Clear pause timeout
			clearTimeout(this.data.pauseTimeout);

			// Set next player
			this.data.currentPlayer = nPlayer;

			// Set current track
			this.data.currentTrack = parseInt(trackId);
			this.data.currentFile = MAIN.settings.data.tracks[trackId].src;
			document.getElementById('AUDIO_PLAYER_' + nPlayer).src = MAIN.settings.data.tracks[trackId].src;

			// Process fade out & fade in effects
			this.effects.fadeOut({track: trackId});
			this.effects.fadeIn({track: trackId});

			// Timeout to stop previous player
			this.data.pauseTimeout = setTimeout(function(){
				document.getElementById('AUDIO_PLAYER_' + sPlayer).pause();
				document.getElementById('AUDIO_PLAYER_' + sPlayer).src = '';
				TMS.removeClass('ICON_LOOP_TRANSITION', 'DIV_ICON_ON_OFF_ACTIVE');
			}, fadeTime);

			// Start next player
			document.getElementById('AUDIO_PLAYER_' + nPlayer).play();

			// Update GUI
			MAIN.gui.updatePlayingTrack();

			// Remove focus
			document.getElementById('AUDIO_LABEL_TRACK_INFO_currentTrack').focus();

		} else {
			window.alert('ERROR: Unable to play track ' + trackId + '!\nReason: ' + errorReason);
		}

	},

	// Bind volume to range
	bindVolume: function(){

		document.getElementById('AUDIO_VOLUME_1').onchange = function(){
			document.getElementById('AUDIO_PLAYER_1').volume = document.getElementById('AUDIO_VOLUME_1').value;
		}

		document.getElementById('AUDIO_VOLUME_2').onchange = function(){
			document.getElementById('AUDIO_PLAYER_2').volume = document.getElementById('AUDIO_VOLUME_2').value;
		}

		const checkerInterval = setInterval(function(){
			document.getElementById('AUDIO_PLAYER_1').volume = document.getElementById('AUDIO_VOLUME_1').value;
			document.getElementById('AUDIO_PLAYER_2').volume = document.getElementById('AUDIO_VOLUME_2').value;
		}, 10);
		
	},

	// Set custom volume to track
	setCustomAudioVolume: function(){

		// Get variables
		var cPlayer = MAIN.player.getCurrentPlayer(),
			cTrack = MAIN.player.data.currentTrack;

		// Set volume and make custom volume active
		MAIN.settings.data.tracks[cTrack].customVolume.enabled = !0;
		MAIN.settings.data.tracks[cTrack].customVolume.volume = parseFloat(document.getElementById('AUDIO_VOLUME_' + cPlayer.currentPlayer).value);

		// Save settings
		MAIN.settings.save();

		// Update labels
		MAIN.gui.updateTrackInfo({renderTrackData: !1});
		MAIN.gui.renderTrackData(cTrack);

	},

	// Check if audio is muted
	checkMuted: function(){
		const getMuteState = document.getElementById('AUDIO_PLAYER_MUTE').checked;
		document.getElementById('AUDIO_PLAYER_1').muted = getMuteState;
		document.getElementById('AUDIO_PLAYER_2').muted = getMuteState;
	},

	// Increase / Decrease Volume
	updateVolume: function(mode){

		// Fix missing args
		if (mode === void 0){
			mode = 0;
		}

		// Get variables
		var factor = 0.001,
			cPlayer = MAIN.player.getCurrentPlayer().currentPlayer,
			cVolume = parseFloat(document.getElementById('AUDIO_VOLUME_' + cPlayer).value);

		// Update factor
		if (MAIN.keyboard.superKeys.ctrlLeft === !0){
			factor = 0.01;
		}

		// Decrease or increase
		if (mode === 0){
			cVolume = parseFloat(cVolume - factor);
		} else {
			cVolume = parseFloat(cVolume + factor);
		}

		// Fix out of range values
		if (cVolume < 0){
			cVolume = 0;
		}

		if (cVolume > 1){
			cVolume = 1;
		}

		// console.info('Mode: ' + mode + ' - Volume: ' + cVolume);

		// Apply values
		document.getElementById('AUDIO_VOLUME_' + cPlayer).value = cVolume;
		document.getElementById('AUDIO_PLAYER_' + cPlayer).volume = cVolume;

		// Update Labels
		MAIN.gui.updateLabels();

	},

	/*
		File manager
	*/
	loadTrack: function(trackId){
		MAIN.file.loadFile('.mp3, .wav, .ogg, .flac', function(f){
			
			// Set main file
			const cFile = f[0];
			MAIN.settings.data.tracks[trackId].src = MAIN.file.fixPath(cFile.path);
			MAIN.settings.data.tracks[trackId].fileName = MAIN.file.getFileName(MAIN.file.fixPath(cFile.path));

			// Reset variables - Custom volume
			MAIN.settings.data.tracks[trackId].customVolume.volume = 0.5;
			MAIN.settings.data.tracks[trackId].customVolume.enabled = !1;

			// Reset variables - Custom loop
			MAIN.settings.data.tracks[trackId].customLoop.enabled = !1;
			MAIN.settings.data.tracks[trackId].customLoop.loopStart = 0;
			MAIN.settings.data.tracks[trackId].customLoop.loopEnd = 1100;

			// Save settings
			MAIN.settings.save();

			// Request render
			MAIN.gui.renderTrackData(trackId);
			
		});
	}

}

// Delete modules
delete tempFn_EFFECTS;