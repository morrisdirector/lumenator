import {
  AlertWarningIcon,
  AlertWarningType,
} from "../../lib/components/AlertWarning/IAlertWarningProps";
import { Component, Fragment, VNode, h } from "preact";

import AlertWarning from "../../lib/components/AlertWarning/AlertWarning";
import Chip from "../../lib/components/Chip/Chip";
import { ConfigService } from "../../lib/services/config-service";
import { ControlMode } from "../../lib/enums/ControlMode";
import DeviceSetup from "./DeviceSetup/DeviceSetup";
import { HardwareService } from "../../lib/services/hardware-service";
import { IConfigJson } from "../../lib/interfaces/IConfigJson";
import { IOnColorSetData } from "./ManualControl/IManualControlProps";
import Loader from "../../lib/components/Loader/Loader";
import ManualControl from "./ManualControl/ManualControl";
import NavMenu from "../../lib/components/NavMenu/NavMenu";
import NavMenuTab from "../../lib/components/NavMenuTab/NavMenuTab";
import NetworkSetup from "./NetworkSetup/NetworkSetup";
import { OnOff } from "../../lib/enums/OnOff";
import { WebsocketService } from "../../lib/services/websocket-service";

interface ILumenatorAppState {
  controlMode: ControlMode;
  loading: boolean;
  messages: Array<VNode<any>>;
  restartRequest?: boolean;
  originalConfig?: IConfigJson;
  config?: IConfigJson;
  rgbColor?: { r: number; g: number; b: number };
  whiteColor?: { r: number; g: number; b: number };
  whiteValueColor?: { r: number; g: number; b: number };
}
class LumenatorApp extends Component<null, ILumenatorAppState> {
  private configService = new ConfigService();
  private websocketService = new WebsocketService();
  private hardwareService = new HardwareService();

  constructor() {
    super();
    this.state = {
      controlMode: ControlMode.STANDBY,
      loading: true,
      messages: [],
    };
    this.saveConfiguration = this.saveConfiguration.bind(this);
    this.renderMessages = this.renderMessages.bind(this);
    this.renderActionSection = this.renderActionSection.bind(this);
  }

  private init = async (): Promise<any> => {
    try {
      const data = await this.configService.loadConfigJson();
      if (data) {
        this.setState({
          originalConfig: { ...data },
          config: { ...data },
          loading: false,
        });
      }
    } catch (error) {
      console.error(error);
      this.setState({ loading: false });
    }
  };

  componentDidMount() {
    this.init();
  }

  private isGpioMode = (mode: ControlMode): boolean => {
    return (
      mode === ControlMode.GPIO_B ||
      mode === ControlMode.GPIO_G ||
      mode === ControlMode.GPIO_R ||
      mode === ControlMode.GPIO_W ||
      mode === ControlMode.GPIO_WW
    );
  };

  private handleControlModeToggle = (newMode: ControlMode): void => {
    if (this.isGpioMode(this.state.controlMode)) {
      // Turn off the old GPIO
      this.websocketService.send(`gpio:${this.state.controlMode}:${OnOff.OFF}`);
    }
    if (this.isGpioMode(newMode)) {
      // Turn on the new GPIO
      this.websocketService.send(`gpio:${newMode}:${OnOff.ON}`);
    }
    if (newMode === ControlMode.STANDBY) {
      this.websocketService.send(`standby`);
    }
    this.setState({ controlMode: newMode });
  };

  private handleColorSet = (data: IOnColorSetData): void => {
    if (data.type === "rgb") {
      this.setState({ rgbColor: data.color });
    }
    if (data.type === "white") {
      this.setState({ whiteColor: data.color });
    }
    if (data.type === "whiteValue") {
      this.setState({ whiteValueColor: data.color });
    }
  };

  private saveConfiguration(): void {
    this.setState({ loading: true });
    if (this.state.config) {
      this.configService.saveConfigJson(this.state.config).then((result) => {
        if (result === true) {
          setTimeout(() => {
            this.setState({
              originalConfig: {
                ...this.state.config,
              } as IConfigJson,
              loading: false,
              messages: [
                ...this.state.messages,
                <AlertWarning
                  text="Configuration saved successfully"
                  closable={true}
                  autoClose={true}
                ></AlertWarning>,
              ],
            });
          }, 1000);
        }
      });
    }
  }

  private renderMessages(): h.JSX.Element {
    return <Fragment>{this.state.messages.map((msg) => msg)}</Fragment>;
  }

  private renderRestartDialog(): h.JSX.Element {
    return (
      <section class="action-section no-margin">
        <div>
          <AlertWarning
            type={AlertWarningType.BASIC_BORDERLESS}
            text="Are you sure?"
          />
        </div>
        <div>
          <button
            onClick={() => {
              this.setState({
                restartRequest: false,
              });
            }}
          >
            Cancel
          </button>
          <button
            class="alert"
            onClick={() => {
              this.setState({
                loading: true,
                restartRequest: false,
                messages: [],
              });
              this.hardwareService.restart();
              setTimeout(() => {
                this.websocketService.close();
                this.websocketService.reconnect().then((connected) => {
                  if (connected) {
                    this.setState({
                      loading: false,
                      controlMode: ControlMode.STANDBY,
                      messages: [
                        <AlertWarning
                          text="Restarted successfully"
                          autoClose={true}
                          closable={true}
                        />,
                      ],
                    });
                  }
                });
              }, 1000);
            }}
          >
            Restart
          </button>
        </div>
      </section>
    );
  }

  private renderUnsaved(): h.JSX.Element {
    return (
      <section class="action-section no-margin">
        <div>
          <AlertWarning
            icon={AlertWarningIcon.ALERT}
            type={AlertWarningType.BASIC_BORDERLESS}
            text="Unsaved Changes"
          />
        </div>
        <div>
          <button
            onClick={() => {
              this.setState({
                config: { ...this.state.originalConfig } as IConfigJson,
              });
            }}
          >
            Reset
          </button>
          <button class="primary" onClick={this.saveConfiguration}>
            Save Configuration
          </button>
        </div>
      </section>
    );
  }

  private renderActionSection(): h.JSX.Element {
    return this.state.restartRequest ? (
      this.renderRestartDialog()
    ) : this.configService.hasUnsavedChanges(
        this.state.originalConfig,
        this.state.config
      ) ? (
      this.renderUnsaved()
    ) : (
      <Fragment></Fragment>
    );
  }

  render() {
    return (
      <div id="lumenator-web-app">
        {this.state.loading && <Loader></Loader>}
        <header>
          <div class="header-container">
            <div class="header-items">
              <h2>Lumenator</h2>
              {this.state.originalConfig &&
                this.state.originalConfig.device.name && (
                  <Chip text={this.state.originalConfig.device.name}></Chip>
                )}
              <div class="version">v1.0</div>
            </div>
          </div>
        </header>
        <NavMenu
          activeId={1}
          renderMessages={this.renderMessages}
          renderActionSection={this.renderActionSection}
        >
          <NavMenuTab id={1} title="Device">
            <DeviceSetup
              deviceConfig={this.state.config && this.state.config.device}
              gpioConfig={this.state.config && this.state.config.gpio}
              onConfigUpdate={(deviceConfig, gpioConfig) => {
                this.setState({
                  config: {
                    ...(this.state.config as IConfigJson),
                    device: deviceConfig,
                    gpio: gpioConfig,
                  },
                });
              }}
              controlMode={this.state.controlMode}
              onControlModeToggle={this.handleControlModeToggle}
              onRestart={() => {
                this.setState({ restartRequest: true });
              }}
            ></DeviceSetup>
          </NavMenuTab>
          <NavMenuTab id={2} title="Network">
            <NetworkSetup
              configNetwork={this.state.config && this.state.config.network}
              configAccessPoint={
                this.state.config && this.state.config.accessPoint
              }
              onConfigUpdate={(configs) => {
                this.setState({
                  config: {
                    ...(this.state.config as IConfigJson),
                    network: configs.network,
                    accessPoint: configs.accessPoint,
                  },
                });
              }}
            ></NetworkSetup>
          </NavMenuTab>
          <NavMenuTab id={3} title="Control">
            <ManualControl
              webSocketService={this.websocketService}
              controlMode={this.state.controlMode}
              onControlModeToggle={this.handleControlModeToggle}
              onColorSet={this.handleColorSet}
              rgbColor={this.state.rgbColor}
              whiteColor={this.state.whiteColor}
              whiteValueColor={this.state.whiteValueColor}
            ></ManualControl>
          </NavMenuTab>
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
