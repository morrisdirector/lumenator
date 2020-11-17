// import { Modal } from './components/Modal/Modal';
import { CustomElement } from './components/BaseComponent/BaseComponent';
import { LumenatorBase } from './lumenator-base';

export class LumenatorSetup extends LumenatorBase {
	constructor(private devMode) {
		super();
		this.addEventListeners();
	}

	private addEventListeners = (): void => {
		this.element('#network-scan').addEventListener('click', this.scanForNetworks);
	};

	private scanForNetworks = (): void => {
		const modal: CustomElement = document.getElementById('network-modal') as CustomElement;
		modal.setState({ open: true, loading: true });
	};
}
