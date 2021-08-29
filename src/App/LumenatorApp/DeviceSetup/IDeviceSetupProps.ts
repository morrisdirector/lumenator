import {
  IConfigDevice,
  IConfigGPIO,
} from "../../../lib/interfaces/IConfigJson";

import { ControlMode } from "../../../lib/enums/ControlMode";

export interface IDeviceSetupProps {
  deviceConfig?: IConfigDevice;
  gpioConfig?: IConfigGPIO;
  newConfig?: IConfigDevice;
  controlMode?: ControlMode;
  onControlModeToggle?: (controlMode: ControlMode) => void;
  onConfigUpdate?: (
    deviceConfig: IConfigDevice,
    gpioConfig: IConfigGPIO
  ) => void;
  onRestart?: () => void;
}
