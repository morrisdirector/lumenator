const setDomValue = (id, value) => {
	const el = document.getElementById(id);
	if (el) {
		if (typeof el.updateValue === 'function') {
			el.updateValue(value);
		} else {
			el.innerText = value;
		}
	}
};

const setComponentState = (id, state) => {
	const component = document.getElementById(id);
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
