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
			type: this.getAttribute('type') || 'text',
			name: this.getAttribute('name'),
			value: this.trueValue(this.getAttribute('value')) || null
		});
		console.log('Initial State: ', this.state);
		this.onChange = this.onChange.bind(this);
		this.updateOptions = this.updateOptions.bind(this);
	}

	isNullValue(value: string | number): boolean {
		return value === undefined || value === null || value === '';
	}

	trueValue(value: string): string | number | void {
		if (this.isNullValue(value)) {
			return null;
		}
		return this.state.type === 'number' ? parseInt(value, 10) : value;
	}

	updateOptions(): void {
		const select: HTMLSelectElement = this.shadowRoot.querySelector('#select');
		const node: HTMLOptionElement = this.querySelector('option');
		if (this.state.value !== null && this.state.value !== undefined && node) {
			// console.log('True Value of Node: ', this.trueValue(node.value));
			if (this.state.value === this.trueValue(node.value)) {
				node.selected = true;
			} else {
				node.selected = false;
			}
		}
		node && select.append(node);
	}

	onChange(event) {
		const value = event.target.value;
		this.setState({ value: this.trueValue(value) });
	}

	onStateChanges = (state) => {
		const select: HTMLSelectElement = this.shadowRoot.querySelector('#select');
		if (state.value !== this.trueValue(select.value)) {
			select.value = `${state.value}`;
		}
		console.log(state.value);
		select.classList.value = this.isNullValue(state.value) ? 'placeholder' : '';
	};

	connectedCallback() {
		const el = this.shadowRoot.querySelector('#select');
		el.addEventListener('change', this.onChange);
		this.shadowRoot.addEventListener('slotchange', this.updateOptions);
	}

	disconnectedCallback() {
		const el = this.shadowRoot.querySelector('#select');
		el.removeEventListener('change', this.onChange);
		this.shadowRoot.removeEventListener('slotchange', null);
	}
}
window.customElements.define('dropdown-menu', DropdownMenu);
