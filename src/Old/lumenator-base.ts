import { CustomElement } from '../components/BaseComponent/BaseComponent';

export class LumenatorBase {
	constructor() {}

	protected element = (query: string): CustomElement => {
		return document.querySelector(query) as CustomElement;
	};
}
