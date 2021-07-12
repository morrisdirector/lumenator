import { ControlMode } from "../../../lib/enums/ControlMode";
import { IConfigDevice } from "../../../lib/interfaces/IConfigJson";

export interface IDeviceSetupProps {
  config?: IConfigDevice;
  newConfig?: IConfigDevice;
  controlMode?: ControlMode;
  onControlModeToggle?: (controlMode: ControlMode) => void;
  onConfigUpdate?: (config: IConfigDevice) => void;
}
