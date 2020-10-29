import { CustomElement } from '../BaseComponent/BaseComponent';

const loaderTemplate = document.createElement('template');
loaderTemplate.innerHTML = /*html*/ `
<style>
	@import "style.css";
</style>
<div id="pageLoader" class="pageLoader hidden">
	<div id="loader" class="loader">Loading...</div>
</div>
`;
class Loader extends CustomElement {
	constructor() {
		super(loaderTemplate);
		this.setState({
			id: this.getAttribute('id'),
			loading: this.getAttribute('loading')
		});
		this.updateLoadingClass(!!this.getAttribute('loading'));
	}
	updateLoadingClass(loading) {
		if (loading) {
			this.shadowRoot.querySelector('#pageLoader').className = 'pageLoader';
		} else {
			this.shadowRoot.querySelector('#pageLoader').className = 'pageLoader hidden';
		}
	}
	onStateChanges = (state) => {
		this.updateLoadingClass(state.loading);
	};
}
window.customElements.define('ui-loader', Loader);
