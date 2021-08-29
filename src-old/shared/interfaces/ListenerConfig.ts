import { ListenerType } from '../types/ListenerType';

export interface IListenerConfig {
	id: string;
	type: ListenerType;
	callback: () => void;
}
