
import { CustomElement } from './base-component';

const toggleTemplate = document.createElement('template');
toggleTemplate.innerHTML = /*html*/ `
<style>
	@import "style.css";
</style>
<div class="toggle-switch on" ontouchstart="return true;">
	<div class="circle"></div>
</div>
`;
export class ToggleSwitch extends CustomElement {
	constructor() {
		super(toggleTemplate);
		this.setState({ state: this.getAttribute('state') || 'OFF', id: this.getAttribute('id') });
		this.shadowRoot.querySelector('.toggle-switch').className = `toggle-switch ${this.state.state}`;
	}

	onStateChanges = (state) => {
		this.shadowRoot.querySelector('.toggle-switch').className = `toggle-switch ${state.state}`;
		const onToggle = new CustomEvent('onToggle', {
			bubbles: true,
			detail: this.state
		});

		this.dispatchEvent(onToggle);
	}

	onClick() {
		this.setState({ state: this.state.state === 'ON' ? 'OFF' : 'ON' });
	}

	connectedCallback() {
		this.addEventListener('click', this.onClick);
	}

	disconnectedCallback() {
		this.removeEventListener('click', this.onClick);
	}
}
window.customElements.define('toggle-switch', ToggleSwitch);