export const testData = () => {
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
		mqtt: {
			mqtt_enabled: true,
			mqtt_client_name: 'bulb_1',
			mqtt_user: 'fake_mqtt_user',
			mqtt_password: 'password',
			mqtt_ip: [ 192, 168, 1, 193 ],
			mqtt_port: 1883
		},
		network: {
			ssid: 'Fake SSID',
			password: 'password'
		}
	};
};
