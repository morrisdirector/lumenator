import { CustomElement } from '../BaseComponent/BaseComponent';
import { ITableProps } from './ITableProps';

const template = document.createElement('template');
template.innerHTML = /*html*/ `
<style>
	@import "style.css";
</style>
<table>
    <tr class="header-row">
        <!-- <th>SSID</th>
        <th>RSSI</th>
        <th>Encryption</th>
        <th></th> -->
    </tr>
    <!-- <tr>
        <td>MyWifi_Network</td>
        <td>64</td>
        <td>WPA</td>
        <td>
            <button class="compact">Select</button>
        </td>
    </tr>
    <tr>
        <td>NotMyNetwork</td>
        <td>45</td>
        <td>WPA</td>
        <td>
            <button class="compact">Select</button>
        </td>
    </tr>
    <tr>
        <td>MyOfficeNetwork</td>
        <td>23</td>
        <td>Open</td>
        <td>
            <button class="compact">Select</button>
        </td>
    </tr> -->
</table>
`;
class Table<T> extends CustomElement {
	constructor() {
		super(template);
	}

	onStateChanges = (state: ITableProps<T>, previous: ITableProps<T>) => {
		// debugger;
	};

	connectedCallback() {}

	disconnectedCallback() {}
}
window.customElements.define('lum-table', Table);
