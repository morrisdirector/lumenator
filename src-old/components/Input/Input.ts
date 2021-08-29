import { CustomElement } from '../BaseComponent/BaseComponent';

const textInput = document.createElement('template');
textInput.innerHTML = /*html*/ `
<style>
	@import "style.css";
</style>
<div class="input-container">
	<input id="input" class="text-input">
	<slot></slot>
</div>
`;
class TextInput extends CustomElement {
	constructor() {
		super(textInput);
		this.setState({
			id: this.getAttribute('id'),
			name: this.getAttribute('name'),
			type: this.getAttribute('type') || 'text',
			value: this.getAttribute('value') || null
		});
		this.onChange = this.onChange.bind(this);
	}

	onChange(event) {
		const value = event.target.value;
		const storedVal = this.state.type === 'number' ? parseInt(value, 10) : value;
		this.setState({ value: storedVal });
	}

	onStateChanges = (state) => {
		const input: HTMLInputElement = this.shadowRoot.querySelector('#input');
		if (state.value !== input.value) {
			if (state.value === undefined) {
				input.value = null;
			} else {
				input.value = state.value;
			}
		}
		(this.shadowRoot.querySelector('#input') as HTMLInputElement).type = state.type;
	};

	connectedCallback() {
		const el = this.shadowRoot.querySelector('#input');
		el.addEventListener('change', this.onChange);
	}

	disconnectedCallback() {
		const el = this.shadowRoot.querySelector('#input');
		el.removeEventListener('change', this.onChange);
	}
}
window.customElements.define('text-input', TextInput);
