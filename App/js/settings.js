/*
	TemmieDeck - settings.js
	Responsible for holding settings data
*/

tempFn_SETTINGS = {

	// Settings Data
	data: {

		// Track data
		fadeIn: 1000,
		fadeOut: 1000,
		setName: 'MAIN',

		// Track data
		tracks: {

			0: { fileName: 'No file selected', src: '', customVolume: { enabled: !1, volume: 0.5 }, customLoop: { enabled: !1, loopStart: 0, loopEnd: 1000, transition: 500 } },
			1: { fileName: 'No file selected', src: '', customVolume: { enabled: !1, volume: 0.5 }, customLoop: { enabled: !1, loopStart: 0, loopEnd: 1000, transition: 500 } },
			2: { fileName: 'No file selected', src: '', customVolume: { enabled: !1, volume: 0.5 }, customLoop: { enabled: !1, loopStart: 0, loopEnd: 1000, transition: 500 } },
			3: { fileName: 'No file selected', src: '', customVolume: { enabled: !1, volume: 0.5 }, customLoop: { enabled: !1, loopStart: 0, loopEnd: 1000, transition: 500 } },
			4: { fileName: 'No file selected', src: '', customVolume: { enabled: !1, volume: 0.5 }, customLoop: { enabled: !1, loopStart: 0, loopEnd: 1000, transition: 500 } },
			5: { fileName: 'No file selected', src: '', customVolume: { enabled: !1, volume: 0.5 }, customLoop: { enabled: !1, loopStart: 0, loopEnd: 1000, transition: 500 } },
			6: { fileName: 'No file selected', src: '', customVolume: { enabled: !1, volume: 0.5 }, customLoop: { enabled: !1, loopStart: 0, loopEnd: 1000, transition: 500 } },
			7: { fileName: 'No file selected', src: '', customVolume: { enabled: !1, volume: 0.5 }, customLoop: { enabled: !1, loopStart: 0, loopEnd: 1000, transition: 500 } },
			8: { fileName: 'No file selected', src: '', customVolume: { enabled: !1, volume: 0.5 }, customLoop: { enabled: !1, loopStart: 0, loopEnd: 1000, transition: 500 } },
			9: { fileName: 'No file selected', src: '', customVolume: { enabled: !1, volume: 0.5 }, customLoop: { enabled: !1, loopStart: 0, loopEnd: 1000, transition: 500 } }

		}

	},

	// Save settings
	save: function(options){

		// Apply set name
		this.data.setName = document.getElementById('AUDIO_TRACK_SET_NAME').value;

		// Temp fix
		if (this.data.setName === ''){
			this.data.setName = 'Unknown_Name';
		}

		// Variables
		var canRenderTracks = !0,
			data = JSON.stringify(this.data),
			cSet = document.getElementById('AUDIO_TRACK_SET_NAME').value;

		// If is new set
		if (localStorage.getItem('SETTINGS_DATA_' + cSet) === null){
			window.alert('INFO - Set created successfull!\nName: ' + cSet);
		}

		// Save on localStorage
		localStorage.setItem('SETTINGS_DATA_' + cSet, data);

		// Post settings
		if (options !== void 0){
			canRenderTracks = options.renderTrackData;

			// Render track data
			if (canRenderTracks === !0){
				for (var i = 0; i < 10; i++){
					MAIN.gui.renderTrackData(i);
				}
			}
		
		}

	},

	// Load settings
	load: function(options){

		// Consts
		const cSet = document.getElementById('AUDIO_TRACK_SET_NAME').value;

		// If save not present, make it!
		if (localStorage.getItem('SETTINGS_DATA_' + cSet) === null){
			window.alert('INFO - Creating set with name: ' + cSet);
			this.save();
		}

		// Load settings
		this.data = JSON.parse(localStorage.getItem('SETTINGS_DATA_' + cSet));

		// Render Set Name
		document.getElementById('AUDIO_TRACK_SET_NAME').value = this.data.setName;

		// Post settings
		if (options !== void 0){
			canRenderTracks = options.renderTrackData;
			
			// Render track data
			if (canRenderTracks === !0){
				for (var i = 0; i < 10; i++){
					MAIN.gui.renderTrackData(i);
				}
			}
		
		}

	},

	// Get custom volume for track
	getCustomVolume: function(tId){

		// Get custom volume
		const trackId = parseInt(tId);
		MAIN.settings.data.tracks[trackId].customVolume.volume = document.getElementById('TRACK_CUSTOM_VOLUME_' + trackId).value;
		MAIN.settings.data.tracks[trackId].customVolume.enabled = document.getElementById('TRACK_ENABLE_CUSTOM_VOLUME_' + trackId).checked;
		this.save();

		// Update labels
		MAIN.gui.updateTrackInfo();

	},

	// Clear all tracks
	clearAlltracks: function(){

		// Ask
		const ask = confirm('Are you sure about this action?');

		if (ask === !0){

			// Reset tracks
			for (var i = 0; i < 10; i++){
				MAIN.settings.data.tracks[i] = { fileName: 'No file selected', src: '', customVolume: { enabled: !1, volume: 0.5 }, customLoop: { enabled: !1, loopStart: 0, loopEnd: 1000, transition: 500 } }
			}

			// Save settings and render
			this.save({renderTrackData: !0});

		}

	}

}