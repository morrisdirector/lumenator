import { MarginType } from '../../shared/enums/MarginType';

export enum AlertMessageType {
	INFO = 'info',
	ALERT = 'alert',
	DANGER = 'danger'
}

export interface IAlertMessageProps {
	text?: string;
	icon?: string;
	type?: AlertMessageType;
	closable?: boolean;
	visible?: boolean;
	margin?: MarginType;
}
