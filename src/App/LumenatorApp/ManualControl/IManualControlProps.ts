import { ControlMode } from "../../../lib/enums/ControlMode";

export interface IManualControlProps {
  controlMode?: ControlMode;
  onControlModeToggle?: (controlMode: ControlMode) => void;
}
