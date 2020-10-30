import './components/index';
import { CustomElement } from './components/BaseComponent/BaseComponent';
import { Mode } from './shared/enums/Mode';
import { OnOff } from './shared/enums/OnOff';
import * as iro from '@jaames/iro';

// Development Mode
const DEVELOPMENT = process.env.NODE_ENV === 'development';

const errors = [];

const rgbColorPicker = iro.default.ColorPicker('#rgb-color-picker', {
	borderWidth: 2,
	layout: [
		{
			component: iro.default.ui.Wheel,
			options: {
				borderColor: '#d1d1d1'
			}
		},
		{
			component: iro.default.ui.Slider,
			options: {
				borderColor: '#d1d1d1',
				sliderType: 'value'
			}
		}
	]
});
const kelvinMin = 4000;
const kelvinMax = 9000;
const whiteColorPicker = iro.default.ColorPicker('#white-color-picker', {
	borderWidth: 2,
	layout: [
		{
			component: iro.default.ui.Slider,
			options: {
				borderColor: '#d1d1d1',
				minTemperature: kelvinMin,
				maxTemperature: kelvinMax,
				sliderType: 'kelvin',
				sliderShape: 'circle'
			}
		}
	]
});
const whiteValuePicker = iro.default.ColorPicker('#white-value-picker', {
	borderWidth: 2,
	layout: [
		{
			component: iro.default.ui.Slider,
			options: {
				borderColor: '#d1d1d1',
				sliderType: 'value'
			}
		}
	]
});

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
						sendRgbColors(rgbColorPicker.color.rgb);
						break;
					case 'modeWhite':
						mode = Mode.WHITE;
						element('#white-warning').setState({
							text:
								'While manual white mode is enabled, Lumenator will not respond to external control commands.'
						});
						sendWhiteLevels({ kelvin: whiteColorPicker.color.kelvin, value: whiteValuePicker.color.value });
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
				element('#white-warning').setState({
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

const withLeadingZeros = (value: string | number, zeros: number): string => {
	return `00${value}`.slice(`00${value}`.length - zeros);
};

const sendRgbColors = (color: { r: number; g: number; b: number }) => {
	if (mode !== Mode.RGB) {
		mode = Mode.RGB;
		element('#modeRgb').setState({ state: 'ON' });
	}
	const r = withLeadingZeros(color.r, 3);
	const g = withLeadingZeros(color.g, 3);
	const b = withLeadingZeros(color.b, 3);

	if (websocket) {
		websocket.send(`rgbctrl:r:${r}:g:${g}:b:${b}`);
	}
};

const sendWhiteLevels = (level: { kelvin: number; value: number }) => {
	if (mode !== Mode.WHITE) {
		mode = Mode.WHITE;
		element('#modeWhite').setState({ state: 'ON' });
	}

	const multiplier = level.value / 100; // Brightness Slider Multiplier
	const max = kelvinMax - kelvinMin;
	const relativeVal = level.kelvin - kelvinMin;
	const wMultiplier = Math.round(relativeVal / max * 100) / 100;
	const wVal = Math.round(255 * wMultiplier);
	const wwVal = 255 - wVal < 0 ? 0 : 255 - wVal;
	const w = withLeadingZeros((wVal * multiplier).toFixed(0), 3);
	const ww = withLeadingZeros((wwVal * multiplier).toFixed(0), 3);

	if (websocket) {
		websocket.send(`whitectrl:w:${w}:ww:${ww}`);
	}
};

const setupColorPickers = () => {
	rgbColorPicker.on('color:change', (color) => {
		sendRgbColors(color.rgb);
	});
	whiteColorPicker.on('color:change', (color) => {
		sendWhiteLevels({ kelvin: color.kelvin, value: whiteValuePicker.color.value });
	});
	whiteValuePicker.on('color:change', (color) => {
		sendWhiteLevels({ kelvin: whiteColorPicker.color.kelvin, value: color.value });
	});
};

const init = () => {
	if (!DEVELOPMENT) {
		wsConnect();
	}
	addEventListeners();
	loadConfigJson();
	loadDevicePresets();
	setupColorPickers();
};

init();
