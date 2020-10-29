import './components/index';
import { CustomElement } from './components/BaseComponent/BaseComponent';
import { Mode } from './shared/enums/Mode';
import { OnOff } from './shared/enums/OnOff';
import * as iro from '@jaames/iro';

// Development Mode
const DEVELOPMENT = process.env.NODE_ENV === 'development';

const errors = [];

let websocket;
let config;
let devicePresets;
let mode = Mode.STANDBY;

const element = (query: string): CustomElement => {
	return document.querySelector(query) as CustomElement;
};

const setDomValue = (id, value) => {
	const el: CustomElement = document.getElementById(id) as CustomElement;
	if (el) {
		if (typeof el.updateValue === 'function') {
			el.updateValue(value);
		} else {
			el.innerText = value;
		}
	}
};

const setComponentState = (id, state) => {
	const component: CustomElement = document.getElementById(id) as CustomElement;
	if (component) {
		component.setState(state);
	}
};

const testData = () => {
	return {
		device: {
			name: 'Bulb Test 1',
			map_preset: 'wemos',
			device_type: 0,
			gpio_w: 15,
			gpio_ww: 13,
			gpio_r: 12,
			gpio_g: 14,
			gpio_b: 16
		},
		network: {
			ssid: 'Fake SSID',
			password: 'password'
		}
	};
};

const onWsError = (evt) => {
	element('#error-messages').setState({
		text: 'Error establishing Web Socket connection'
	});
	window.scrollTo(0, 0);
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
	const el: CustomElement = document.getElementById('password') as CustomElement;
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

	if (DEVELOPMENT) {
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
			window.scrollTo(0, 0);
			element('#error-messages').setState({ text: 'Error loading configuration' });
		});
};

const loadDevicePresets = () => {
	if (DEVELOPMENT) {
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
			window.scrollTo(0, 0);
			element('#error-messages').setState({ text: 'Error loading device presets' });
		});
};

const addEventListeners = () => {
	// Page Settings:
	document.addEventListener('touchstart', function() {}, true); // mobile safari styling

	// Mode Toggles
	const modeToggleSwitches = Array.from(document.querySelectorAll('.mode-toggle'));
	for (let toggle of modeToggleSwitches) {
		toggle.addEventListener('onToggle', (e: CustomEvent) => {
			const state = (e.target as CustomElement).state;
			if (state.state === 'ON') {
				for (let s of modeToggleSwitches) {
					const t: CustomElement = s as CustomElement;
					if (t.state.id !== state.id && t.state.state === 'ON') {
						t.setState({ state: 'OFF' });
					}
				}
				switch (state.id) {
					case 'modeRgb':
						mode = Mode.RGB;
						element('#rgb-warning').setState({
							text:
								'While manual RGB mode is enabled, Lumenator will not respond to external control commands.'
						});
						// sendRgbColors();
						break;
					case 'modeWhite':
						mode = Mode.WHITE;
						break;
					default:
						// GPIO Testing Mode
						mode = Mode.GPIO_TESTING;
						element('#gpio-test-warning').setState({
							text:
								'While GPIO testing is enabled, Lumenator will not respond to external control commands.'
						});
						break;
				}
			} else if (state.state === 'OFF') {
				mode = Mode.STANDBY;
				element('#gpio-test-warning').setState({
					visible: false,
					text: null
				});
				element('#rgb-warning').setState({
					visible: false,
					text: null
				});
				if (websocket) {
					websocket.send('standby');
				}
			}
			if (websocket && state.id !== 'modeRgb' && state.id !== 'modeWhite') {
				websocket.send(`${e.detail.id}:${OnOff[e.detail.state]}`);
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
			dto[section][prop] = (document.getElementById(prop) as CustomElement).state.value;
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
				element('#info-messages').setState({ text: 'Updated Configuration Successfully', visible: true });
				window.scrollTo(0, 0);
			} else {
				element('#error-messages').setState({
					text: 'Something went wrong while saving the configuration',
					visible: true
				});
				window.scrollTo(0, 0);
			}
		})
		.catch((e) => {
			console.log(e);
			element('#error-messages').setState({
				text: 'Something went wrong while saving the configuration',
				visible: true
			});
			window.scrollTo(0, 0);
		});
};

const refresh = () => {
	window.location.reload();
};

const sendRgbColors = (color: { r: number; g: number; b: number }) => {
	if (mode !== Mode.RGB) {
		mode = Mode.RGB;
		element('#modeRgb').setState({ state: 'ON' });
	}
	// const color = rgbControlColorPicker.getCurColorRgb();
	const r = `00${color.r}`.slice(`00${color.r}`.length - 3);
	const g = `00${color.g}`.slice(`00${color.g}`.length - 3);
	const b = `00${color.b}`.slice(`00${color.b}`.length - 3);

	if (websocket) {
		websocket.send(`rgbctrl:r:${r}:g:${g}:b:${b}`);
	}
};

const loadColorPickers = () => {
	const colorPicker = iro.default.ColorPicker('#rgb-color-picker', null);
	colorPicker.on('color:change', function(color) {
		sendRgbColors(color.rgb);
	});
	// Control Page Color Picker
	// rgbControlColorPicker = new KellyColorPicker({
	// 	place: 'control-color-picker',
	// 	size: 225,
	// 	color: 'rgb(0, 0, 255)',
	// 	userEvents: {
	// 		mousemoveh: () => {
	// 			sendRgbColors();
	// 		},
	// 		mousemovesv: () => {
	// 			sendRgbColors();
	// 		},
	// 		mouseuph: () => {
	// 			sendRgbColors();
	// 		},
	// 		mouseupsv: () => {
	// 			sendRgbColors();
	// 		}
	// 	}
	// });
};

const init = () => {
	if (!DEVELOPMENT) {
		wsConnect();
	}
	addEventListeners();
	loadConfigJson();
	loadDevicePresets();
	loadColorPickers();
};

init();
