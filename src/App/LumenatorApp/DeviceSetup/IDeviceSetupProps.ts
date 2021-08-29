import { ControlMode } from "../../../lib/enums/ControlMode";
import { IConfigJson } from "../../../lib/interfaces/IConfigJson";

export interface IDeviceSetupProps {
  config?: IConfigJson;
  controlMode?: ControlMode;
  onControlModeToggle?: (controlMode: ControlMode) => void;
  onConfigUpdate?: (config: IConfigJson) => void;
  onRestart?: () => void;
}
