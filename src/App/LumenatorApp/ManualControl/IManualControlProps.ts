import { ControlMode } from "../../../lib/enums/ControlMode";

export interface IOnColorSetData {
  type: "rgb" | "white" | "whiteValue";
  color: { r: number; g: number; b: number };
}
export interface IManualControlProps {
  rgbColor?: { r: number; g: number; b: number };
  whiteColor?: { r: number; g: number; b: number };
  whiteValueColor?: { r: number; g: number; b: number };
  controlMode?: ControlMode;
  onControlModeToggle?: (controlMode: ControlMode) => void;
  onColorSet?: (data: IOnColorSetData) => void;
}
