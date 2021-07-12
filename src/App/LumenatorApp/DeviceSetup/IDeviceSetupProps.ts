import { ControlMode } from "../../../lib/enums/ControlMode";

export interface IDeviceSetupProps {
  controlMode?: ControlMode;
  onControlModeToggle?: (controlMode: ControlMode) => void;
}
