import { CustomElement } from '../BaseComponent/BaseComponent';

const template = document.createElement('template');
template.innerHTML = /*html*/ `
<style>
	@import "style.css";
</style>
<div id="chip" class="chip hidden"></div>
`;
class Chip extends CustomElement {
	constructor() {
		super(template);
		this.setState({
			id: this.getAttribute('id'),
			text: this.getAttribute('text')
		});
	}
	onStateChanges = (state) => {
		if (state.text) {
			this.shadowRoot.querySelector('#chip').innerHTML = state.text;
			this.shadowRoot.querySelector('#chip').className = 'chip';
		}
	};
}
window.customElements.define('ui-chip', Chip);
