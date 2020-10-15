'use strict';

const errors = [];
// const deviceModels = [ 'name' ];
// const network = [ 'name' ];

let websocket;
let config;
let devicePresets;
let mode = Mode.STANDBY;

const onWsError = (evt) => {
	document.querySelector('#error-messages').setState({ text: 'Error establishing Web Socket connection' });
	$(window).scrollTop(0);
	console.log(evt);
};

const wsConnect = () => {
	const url = 'ws://' + document.location.host + ':1337';
	if (document.location.host.length) {
		let i = 0;
		const connectionInt = setInterval(() => {
			i++;
			websocket = new WebSocket(url);
			websocket.onopen = () => {
				clearInterval(connectionInt);
			};
			// websocket.onopen = function (evt) { onOpen(evt) };
			// websocket.onclose = function (evt) { onClose(evt) };
			// websocket.onmessage = function (evt) { onMessage(evt) };
			websocket.onerror = (evt) => {
				if (i === 5) {
					clearInterval(connectionInt);
					onWsError(evt);
				}
			};
		}, 1000);
	}
};

const showPassword = () => {
	const el = document.getElementById('password');
	const newState = el.state.type === 'password' ? 'text' : 'password';
	setComponentState('password', { type: newState });
	setDomValue('show-password-button', newState === 'password' ? 'Show' : 'Hide');
};

const setDeviceModels = () => {
	const deviceModels = Object.keys(config.device);
	deviceModels.forEach((model) => {
		setComponentState(model, { value: config.device[model] });
	});

	if (config.device.name) {
		setComponentState('title-chip', { text: config.device.name });
	}
};

const setNetworkModels = () => {
	const networkModels = Object.keys(config.network);
	networkModels.forEach((model) => {
		setComponentState(model, { value: config.network[model] });
	});
};

const loadConfigJson = () => {
	const loadData = (data) => {
		config = data;
		console.log(config);
		if (config.device) {
			setDeviceModels();
		}
		if (config.network) {
			setNetworkModels();
		}
	};

	if (DEBUG) {
		loadData(testData());
		return;
	}

	fetch('config')
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			if (data) {
				loadData(data);
			}
		})
		.catch(function(e) {
			console.warn('Something went wrong loading the config json file.', e);
			$(window).scrollTop(0);
			document.querySelector('#error-messages').setState({ text: 'Error loading configuration' });
		});
};

const loadDevicePresets = () => {
	if (DEBUG) {
		return;
	}

	fetch('devicePresets')
		.then((response) => response.json())
		.then((data) => {
			if (data) {
				devicePresets = data;
			}
		})
		.catch(function(e) {
			console.warn('Something went wrong loading the device presets.', e);
			$(window).scrollTop(0);
			document.querySelector('#error-messages').setState({ text: 'Error loading device presets' });
		});
};

const addEventListeners = () => {
	// Page Settings:
	document.addEventListener('touchstart', function() {}, true); // mobile safari styling
	// Components
	const gpioToggleSwitches = Array.from(document.querySelectorAll('.gpio-toggle'));
	for (let toggle of gpioToggleSwitches) {
		toggle.addEventListener('onToggle', (e) => {
			if (e.target.state.state === 'ON') {
				for (let t of gpioToggleSwitches) {
					if (t.state.id !== e.target.state.id && t.state.state === 'ON') {
						t.setState({ state: 'OFF' });
					}
				}
			}
			if (websocket) {
				websocket.send(`${e.detail.id}:${OnOff[e.detail.state]}`);
			}
		});
	}

	const modeToggleSwitches = Array.from(document.querySelectorAll('.mode-toggle'));
	for (let toggle of modeToggleSwitches) {
		toggle.addEventListener('onToggle', (e) => {
			mode = Mode.WHITE;
			if (e.target.state.state === 'ON') {
				for (let t of modeToggleSwitches) {
					if (t.state.id !== e.target.state.id && t.state.state === 'ON') {
						t.setState({ state: 'OFF' });
					}
				}
			}
		});
	}
};

const saveConfiguration = () => {
	// document.querySelector('#loader').setState({ loading: true });
	let dto = {};
	const sections = Object.keys(config);
	sections.forEach((section) => {
		dto[section] = {};
		const props = Object.keys(config[section]);
		props.forEach((prop) => {
			dto[section][prop] = document.getElementById(prop).state.value;
		});
	});
	fetch('config', {
		method: 'post',
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(dto)
	})
		.then((res) => res.json())
		.then((res) => {
			// document.querySelector('#loader').setState({ loading: false });
			if (res.success) {
				document
					.querySelector('#info-messages')
					.setState({ text: 'Updated Configuration Successfully', visible: true });
				$(window).scrollTop(0);
			} else {
				document
					.querySelector('#error-messages')
					.setState({ text: 'Something went wrong while saving the configuration', visible: true });
				$(window).scrollTop(0);
			}
		})
		.catch((e) => {
			console.log(e);
			document
				.querySelector('#error-messages')
				.setState({ text: 'Something went wrong while saving the configuration', visible: true });
			$(window).scrollTop(0);
		});
};

const refresh = () => {
	window.location.reload();
};

const sendRgbColors = (picker) => {
	if (mode !== Mode.RGB) {
		mode = Mode.RGB;
		document.querySelector('#modeRgb').setState({ state: 'ON' });
	}
	const color = picker.getCurColorRgb();
	const r = `00${color.r}`.slice(`00${color.r}`.length - 3);
	const g = `00${color.g}`.slice(`00${color.g}`.length - 3);
	const b = `00${color.b}`.slice(`00${color.b}`.length - 3);

	if (websocket) {
		websocket.send(`rgbctrl:r:${r}:g:${g}:b:${b}`);
	}
};

const loadColorPickers = () => {
	// Control Page Color Picker
	new KellyColorPicker({
		place: 'control-color-picker',
		size: 225,
		color: 'rgb(0, 0, 255)',
		userEvents: {
			mousemoveh: (e, self) => {
				sendRgbColors(self);
			},
			mousemovesv: (e, self) => {
				sendRgbColors(self);
			},
			mouseuph: (e, self) => {
				sendRgbColors(self);
			},
			mouseupsv: (e, self) => {
				sendRgbColors(self);
			}
		}
	});
};

const init = () => {
	if (!DEBUG) {
		wsConnect();
	}
	addEventListeners();
	loadConfigJson();
	loadDevicePresets();
	loadColorPickers();
};

init();
