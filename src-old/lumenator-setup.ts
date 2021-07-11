// import { Modal } from './components/Modal/Modal';
import { CustomElement } from './components/BaseComponent/BaseComponent';
import { ITableConfigProps } from './components/Table/ITableProps';
import { LumenatorBase } from './lumenator-base';

export class LumenatorSetup extends LumenatorBase {
	public networksTableConfig: ITableConfigProps = {
		columns: [
			{ key: 'ssid', header: 'SSID' },
			{ key: 'rssi', header: 'RSSI' },
			{ key: 'enc', header: 'Encryption' },
			{
				actionButtons: [
					{
						variant: 'default',
						label: 'Click me',
						callback: (row) => {
							console.log(row);
						}
					}
				]
			}
		]
	};
	constructor(private devMode) {
		super();
		this.addEventListeners();
		(document.getElementById('scan-table') as CustomElement).setState({ config: this.networksTableConfig });
	}

	private addEventListeners = (): void => {
		this.element('#network-scan').addEventListener('click', this.scanForNetworks);
	};

	private scanForNetworks = (): void => {
		const modal: CustomElement = document.getElementById('network-modal') as CustomElement;
		modal.setState({
			open: true,
			loading: false,
			actionButtons: [
				{
					variant: 'default',
					label: 'Cancel',
					callback: () => {
						modal.setState({ open: false });
					}
				}
			]
		});
	};
}
