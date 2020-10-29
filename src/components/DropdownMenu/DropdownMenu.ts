import { CustomElement } from '../BaseComponent/BaseComponent';

const template = document.createElement('template');
template.innerHTML = /*html*/ `
<style>
	@import "style.css";
</style>
<div class="dropdown-menu">
<select id="select" class="placeholder"></select>
<slot></slot>
<div class="dropdown-indicator">
	<svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 1000 1000' xmlns:xlink="http://www.w3.org/1999/xlink">
		<metadata>IcoFont Icons</metadata>
		<title>simple-down</title>
		<glyph glyph-name="simple-down" unicode="&#xeab2;" horiz-adv-x="1000" />
		<path
			d="M200 392.6l300 300 300-300-85.10000000000002-85.10000000000002-214.89999999999998 214.79999999999995-214.89999999999998-214.89999999999998-85.10000000000002 85.20000000000005z" />
	</svg>
</div>
</div>
`;
class DropdownMenu extends CustomElement {
	constructor() {
		super(template);
		this.setState({
			id: this.getAttribute('id'),
			name: this.getAttribute('name'),
			value: this.getAttribute('value') || null
		});
		this.onChange = this.onChange.bind(this);
	}

	onChange(event) {
		const value = event.target.value;
		this.setState({ value: value });
	}

	onStateChanges = (state) => {
		const select: HTMLSelectElement = this.shadowRoot.querySelector('#select');
		if (state.value !== select.value) {
			select.value = state.value;
		}
		select.classList.value = !state.value ? 'placeholder' : '';
	};

	connectedCallback() {
		const el = this.shadowRoot.querySelector('#select');
		el.addEventListener('change', this.onChange);
		this.shadowRoot.addEventListener('slotchange', () => {
			const select = this.shadowRoot.querySelector('#select');
			let node = this.querySelector('option');
			node && select.append(node);
		});
	}

	disconnectedCallback() {
		const el = this.shadowRoot.querySelector('#select');
		el.removeEventListener('change', this.onChange);
		this.shadowRoot.removeEventListener('slotchange', null);
	}
}
window.customElements.define('dropdown-menu', DropdownMenu);
