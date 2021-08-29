import { ControlMode } from "../../../lib/enums/ControlMode";
import { WebsocketService } from "../../../lib/services/websocket-service";

export interface IOnColorSetData {
  type: "rgb" | "white" | "whiteValue";
  color: { r: number; g: number; b: number };
}
export interface IManualControlProps {
  webSocketService: WebsocketService;
  rgbColor?: { r: number; g: number; b: number };
  whiteColor?: { r: number; g: number; b: number }; // Stored as RGB to be able to reload the color picker settings from state
  whiteValueColor?: { r: number; g: number; b: number }; // Stored as RGB to be able to reload the color picker settings from state
  controlMode?: ControlMode;
  onControlModeToggle?: (controlMode: ControlMode) => void;
  onColorSet?: (data: IOnColorSetData) => void;
}
