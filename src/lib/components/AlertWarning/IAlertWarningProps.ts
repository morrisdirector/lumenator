import { MarginType } from "../../enums/MarginType";

export enum AlertWarningType {
  INFO = "info",
  ALERT = "alert",
  DANGER = "danger",
  BASIC = "basic",
  BASIC_BORDERLESS = "basic-borderless",
}

export enum AlertWarningIcon {
  ALERT = "alert",
  INFO = "info",
}

export interface IAlertWarningProps {
  text?: string;
  icon?: AlertWarningIcon;
  type?: AlertWarningType;
  closable?: boolean;
  margin?: MarginType;
  autoClose?: boolean;
  autoCloseDuration?: number;
}
