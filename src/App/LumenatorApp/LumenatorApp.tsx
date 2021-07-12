import { Component, h } from "preact";

import Chip from "../../lib/components/Chip/Chip";
import { ConfigService } from "../../lib/services/config-service";
import { ControlMode } from "../../lib/enums/ControlMode";
import DeviceSetup from "./DeviceSetup/DeviceSetup";
import { IConfigJson } from "../../lib/interfaces/IConfigJson";
import ManualControl from "./ManualControl/ManualControl";
import NavMenu from "../../lib/components/NavMenu/NavMenu";
import NavMenuTab from "../../lib/components/NavMenuTab/NavMenuTab";

interface ILumenatorAppState {
  controlMode: ControlMode;
  loading: boolean;
  originalConfig?: IConfigJson;
  config?: IConfigJson;
}
class LumenatorApp extends Component<null, ILumenatorAppState> {
  private configService = new ConfigService();

  constructor() {
    super();
    this.state = { controlMode: ControlMode.STANDBY, loading: true };
  }

  private init = async (): Promise<any> => {
    try {
      const data = await this.configService.loadConfigJson();
      if (data) {
        this.setState({ originalConfig: { ...data }, config: { ...data } });
      }
    } catch (error) {
      debugger;
    }
  };

  componentDidMount() {
    this.init();
  }

  private handleControlModeToggle = (newMode: ControlMode): void => {
    this.setState({ controlMode: newMode });
  };

  render() {
    return (
      <div id="lumenator-web-app">
        <header>
          <div class="header-container">
            <div class="header-items">
              <h2>Lumenator</h2>
              <Chip text="test"></Chip>
              <div class="version">v1.0</div>
            </div>
          </div>
        </header>
        <NavMenu activeId={2}>
          <NavMenuTab id={1} title="Control">
            <ManualControl
              controlMode={this.state.controlMode}
              onControlModeToggle={this.handleControlModeToggle}
            ></ManualControl>
          </NavMenuTab>
          <NavMenuTab id={2} title="Device">
            <DeviceSetup
              config={this.state.config?.device}
              onConfigUpdate={(deviceConfig) => {
                this.setState({
                  config: {
                    ...(this.state.config as IConfigJson),
                    device: deviceConfig,
                  },
                });
              }}
              controlMode={this.state.controlMode}
              onControlModeToggle={this.handleControlModeToggle}
            ></DeviceSetup>
          </NavMenuTab>
          <NavMenuTab id={3} title="MQTT"></NavMenuTab>
          <NavMenuTab id={4} title="Network"></NavMenuTab>
        </NavMenu>
        {JSON.stringify(this.state.config)}
      </div>
    );
  }
}

export default LumenatorApp;

// import './components/index';
// import { CustomElement } from './components/BaseComponent/BaseComponent';
// import { Mode } from './shared/enums/Mode';
// import { OnOff } from './shared/enums/OnOff';
// import * as iro from '@jaames/iro';
// import { testData } from './shared/MockData';
// import { LumenatorBase } from './lumenator-base';

// export class LumenatorApp extends LumenatorBase {
// 	private kelvinMin = 4000;
// 	private kelvinMax = 9000;

// 	private websocket;
// 	private config;
// 	private devicePresets;
// 	private mode = Mode.STANDBY;

// 	private errors = [];

// 	constructor(private devMode) {
// 		super();
// 		if (!this.devMode) {
// 			this.wsConnect();
// 		}
// 		this.addEventListeners();
// 		this.loadConfigJson();
// 		this.loadDevicePresets();
// 		this.setupColorPickers();
// 	}

// 	private rgbColorPicker = iro.default.ColorPicker('#rgb-color-picker', {
// 		borderWidth: 2,
// 		layout: [
// 			{
// 				component: iro.default.ui.Wheel,
// 				options: {
// 					borderColor: '#d1d1d1'
// 				}
// 			},
// 			{
// 				component: iro.default.ui.Slider,
// 				options: {
// 					borderColor: '#d1d1d1',
// 					sliderType: 'value'
// 				}
// 			}
// 		]
// 	});

// 	private whiteColorPicker = iro.default.ColorPicker('#white-color-picker', {
// 		borderWidth: 2,
// 		layout: [
// 			{
// 				component: iro.default.ui.Slider,
// 				options: {
// 					borderColor: '#d1d1d1',
// 					minTemperature: this.kelvinMin,
// 					maxTemperature: this.kelvinMax,
// 					sliderType: 'kelvin',
// 					sliderShape: 'circle'
// 				}
// 			}
// 		]
// 	});
// 	private whiteValuePicker = iro.default.ColorPicker('#white-value-picker', {
// 		borderWidth: 2,
// 		layout: [
// 			{
// 				component: iro.default.ui.Slider,
// 				options: {
// 					borderColor: '#d1d1d1',
// 					sliderType: 'value'
// 				}
// 			}
// 		]
// 	});

// 	private setDomValue = (id, value) => {
// 		const el: CustomElement = document.getElementById(id) as CustomElement;
// 		if (el) {
// 			if (typeof el.updateValue === 'function') {
// 				el.updateValue(value);
// 			} else {
// 				el.innerText = value;
// 			}
// 		}
// 	};

// 	private setComponentState = (id, state) => {
// 		const component: CustomElement = document.getElementById(id) as CustomElement;
// 		if (component) {
// 			component.setState(state);
// 		}
// 	};

// 	private onWsError = (evt) => {
// 		this.element('#error-messages').setState({
// 			text: 'Error establishing Web Socket connection'
// 		});
// 		window.scrollTo(0, 0);
// 		console.log(evt);
// 	};

// 	private wsConnect = () => {
// 		const url = 'ws://' + document.location.host + ':1337';
// 		if (document.location.host.length) {
// 			let i = 0;
// 			const connectionInt = setInterval(() => {
// 				i++;
// 				this.websocket = new WebSocket(url);
// 				this.websocket.onopen = () => {
// 					clearInterval(connectionInt);
// 				};
// 				// websocket.onopen = function (evt) { onOpen(evt) };
// 				// websocket.onclose = function (evt) { onClose(evt) };
// 				// websocket.onmessage = function (evt) { onMessage(evt) };
// 				this.websocket.onerror = (evt) => {
// 					if (i === 5) {
// 						clearInterval(connectionInt);
// 						this.onWsError(evt);
// 					}
// 				};
// 			}, 1000);
// 		}
// 	};

// 	private showPassword = () => {
// 		const el: CustomElement = document.getElementById('password') as CustomElement;
// 		const newState = el.state.type === 'password' ? 'text' : 'password';
// 		this.setComponentState('password', { type: newState });
// 		this.setDomValue('show-password-button', newState === 'password' ? 'Show' : 'Hide');
// 	};

// 	private showMqttPassword = () => {
// 		const el: CustomElement = document.getElementById('mqtt_password') as CustomElement;
// 		const newState = el.state.type === 'password' ? 'text' : 'password';
// 		this.setComponentState('mqtt_password', { type: newState });
// 		this.setDomValue('show-mqtt-password-button', newState === 'password' ? 'Show' : 'Hide');
// 	};

// 	private setDeviceModels = () => {
// 		const deviceModels = Object.keys(this.config.device);
// 		deviceModels.forEach((model) => {
// 			this.setComponentState(model, { value: this.config.device[model] });
// 		});

// 		if (this.config.device.name) {
// 			this.setComponentState('title-chip', { text: this.config.device.name });
// 		}
// 	};

// 	private setNetworkModels = () => {
// 		const networkModels = Object.keys(this.config.network);
// 		networkModels.forEach((model) => {
// 			this.setComponentState(model, { value: this.config.network[model] });
// 		});
// 	};

// 	private setMqttModels = () => {
// 		const mqttModels = Object.keys(this.config.mqtt);
// 		mqttModels.forEach((model) => {
// 			if (model === 'mqtt_enabled') {
// 				const enabledState = this.config.mqtt[model] === true ? 'ON' : 'OFF';
// 				this.setComponentState(model, { state: enabledState });
// 			} else {
// 				this.setComponentState(model, { value: this.config.mqtt[model] });
// 			}
// 		});
// 	};

// 	private loadConfigJson = () => {
// 		const loadData = (data) => {
// 			this.config = data;
// 			console.log(this.config);
// 			if (this.config.device) {
// 				this.setDeviceModels();
// 			}
// 			if (this.config.mqtt) {
// 				this.setMqttModels();
// 			}
// 			if (this.config.network) {
// 				this.setNetworkModels();
// 			}
// 		};

// 		if (this.devMode) {
// 			loadData(testData());
// 			return;
// 		}

// 		fetch('config')
// 			.then(function(response) {
// 				return response.json();
// 			})
// 			.then(function(data) {
// 				if (data) {
// 					loadData(data);
// 				}
// 			})
// 			.catch(function(e) {
// 				console.warn('Something went wrong loading the config json file.', e);
// 				window.scrollTo(0, 0);
// 				this.element('#error-messages').setState({ text: 'Error loading configuration' });
// 			});
// 	};

// 	private loadDevicePresets = () => {
// 		if (this.devMode) {
// 			return;
// 		}

// 		fetch('devicePresets')
// 			.then((response) => response.json())
// 			.then((data) => {
// 				if (data) {
// 					this.devicePresets = data;
// 				}
// 			})
// 			.catch(function(e) {
// 				console.warn('Something went wrong loading the device presets.', e);
// 				window.scrollTo(0, 0);
// 				this.element('#error-messages').setState({ text: 'Error loading device presets' });
// 			});
// 	};

// 	private addEventListeners = () => {
// 		// Page Settings:
// 		document.addEventListener('touchstart', function() {}, true); // mobile safari styling

// 		// Mode Toggles
// 		const modeToggleSwitches = Array.from(document.querySelectorAll('.mode-toggle'));
// 		for (let toggle of modeToggleSwitches) {
// 			toggle.addEventListener('onToggle', (e: CustomEvent) => {
// 				const state = (e.target as CustomElement).state;
// 				if (state.state === 'ON') {
// 					for (let s of modeToggleSwitches) {
// 						const t: CustomElement = s as CustomElement;
// 						if (t.state.id !== state.id && t.state.state === 'ON') {
// 							t.setState({ state: 'OFF' });
// 						}
// 					}
// 					switch (state.id) {
// 						case 'modeRgb':
// 							this.mode = Mode.RGB;
// 							this.element('#rgb-warning').setState({
// 								text:
// 									'While manual RGB mode is enabled, Lumenator will not respond to external control commands.'
// 							});
// 							this.sendRgbColors(this.rgbColorPicker.color.rgb);
// 							break;
// 						case 'modeWhite':
// 							this.mode = Mode.WHITE;
// 							this.element('#white-warning').setState({
// 								text:
// 									'While manual white mode is enabled, Lumenator will not respond to external control commands.'
// 							});
// 							this.sendWhiteLevels({
// 								kelvin: this.whiteColorPicker.color.kelvin,
// 								value: this.whiteValuePicker.color.value
// 							});
// 							break;
// 						default:
// 							// GPIO Testing Mode
// 							this.mode = Mode.GPIO_TESTING;
// 							this.element('#gpio-test-warning').setState({
// 								text:
// 									'While GPIO testing is enabled, Lumenator will not respond to external control commands.'
// 							});
// 							break;
// 					}
// 				} else if (state.state === 'OFF') {
// 					this.mode = Mode.STANDBY;
// 					this.element('#gpio-test-warning').setState({
// 						visible: false,
// 						text: null
// 					});
// 					this.element('#rgb-warning').setState({
// 						visible: false,
// 						text: null
// 					});
// 					this.element('#white-warning').setState({
// 						visible: false,
// 						text: null
// 					});
// 					if (this.websocket) {
// 						this.websocket.send('standby');
// 					}
// 				}
// 				if (this.websocket && state.id !== 'modeRgb' && state.id !== 'modeWhite') {
// 					this.websocket.send(`${e.detail.id}:${OnOff[e.detail.state]}`);
// 				}
// 			});
// 		}

// 		// Buttons
// 		this.element('#show-password-button').addEventListener('click', this.showPassword);
// 		this.element('#show-mqtt-password-button').addEventListener('click', this.showMqttPassword);
// 		this.element('#save-network-configuration').addEventListener('click', this.saveConfiguration);
// 		this.element('#save-device-configuration').addEventListener('click', this.saveConfiguration);
// 	};

// 	private saveConfiguration = () => {
// 		// document.querySelector('#loader').setState({ loading: true });
// 		let dto = {};
// 		const sections = Object.keys(this.config);
// 		sections.forEach((section) => {
// 			dto[section] = {};
// 			const props = Object.keys(this.config[section]);
// 			props.forEach((prop) => {
// 				dto[section][prop] = (document.getElementById(prop) as CustomElement).state.value;
// 			});
// 		});
// 		fetch('config', {
// 			method: 'post',
// 			headers: {
// 				Accept: 'application/json, text/plain, */*',
// 				'Content-Type': 'application/json'
// 			},
// 			body: JSON.stringify(dto)
// 		})
// 			.then((res) => res.json())
// 			.then((res) => {
// 				// document.querySelector('#loader').setState({ loading: false });
// 				if (res.success) {
// 					this.element('#info-messages').setState({
// 						text: 'Updated Configuration Successfully',
// 						visible: true
// 					});
// 					window.scrollTo(0, 0);
// 				} else {
// 					this.element('#error-messages').setState({
// 						text: 'Something went wrong while saving the configuration',
// 						visible: true
// 					});
// 					window.scrollTo(0, 0);
// 				}
// 			})
// 			.catch((e) => {
// 				console.log(e);
// 				this.element('#error-messages').setState({
// 					text: 'Something went wrong while saving the configuration',
// 					visible: true
// 				});
// 				window.scrollTo(0, 0);
// 			});
// 	};

// 	private refresh = () => {
// 		window.location.reload();
// 	};

// 	private withLeadingZeros = (value: string | number, zeros: number): string => {
// 		return `00${value}`.slice(`00${value}`.length - zeros);
// 	};

// 	private sendRgbColors = (color: { r: number; g: number; b: number }) => {
// 		if (this.mode !== Mode.RGB) {
// 			this.mode = Mode.RGB;
// 			this.element('#modeRgb').setState({ state: 'ON' });
// 		}
// 		const r = this.withLeadingZeros(color.r, 3);
// 		const g = this.withLeadingZeros(color.g, 3);
// 		const b = this.withLeadingZeros(color.b, 3);

// 		if (this.websocket) {
// 			this.websocket.send(`rgbctrl:r:${r}:g:${g}:b:${b}`);
// 		}
// 	};

// 	private sendWhiteLevels = (level: { kelvin: number; value: number }) => {
// 		if (this.mode !== Mode.WHITE) {
// 			this.mode = Mode.WHITE;
// 			this.element('#modeWhite').setState({ state: 'ON' });
// 		}

// 		const multiplier = level.value / 100; // Brightness Slider Multiplier
// 		const max = this.kelvinMax - this.kelvinMin;
// 		const relativeVal = level.kelvin - this.kelvinMin;
// 		const wMultiplier = Math.round(relativeVal / max * 100) / 100;
// 		const wVal = Math.round(255 * wMultiplier);
// 		const wwVal = 255 - wVal < 0 ? 0 : 255 - wVal;
// 		const w = this.withLeadingZeros((wVal * multiplier).toFixed(0), 3);
// 		const ww = this.withLeadingZeros((wwVal * multiplier).toFixed(0), 3);

// 		if (this.websocket) {
// 			this.websocket.send(`whitectrl:w:${w}:ww:${ww}`);
// 		}
// 	};

// 	private setupColorPickers = () => {
// 		this.rgbColorPicker.on('color:change', (color) => {
// 			this.sendRgbColors(color.rgb);
// 		});
// 		this.whiteColorPicker.on('color:change', (color) => {
// 			this.sendWhiteLevels({ kelvin: color.kelvin, value: this.whiteValuePicker.color.value });
// 		});
// 		this.whiteValuePicker.on('color:change', (color) => {
// 			this.sendWhiteLevels({ kelvin: this.whiteColorPicker.color.kelvin, value: color.value });
// 		});
// 	};
// }
