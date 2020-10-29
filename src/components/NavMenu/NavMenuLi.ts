import { CustomElement } from '../BaseComponent/BaseComponent';

const template = document.createElement('template');
template.innerHTML = /*html*/ `
<style>
	@import "style.css";
</style>
<li class="tab hidden"><slot></slot>
</li>
`;
class NavMenuLi extends CustomElement {
	constructor() {
		super(template);
		if (this.getAttribute('active') !== null) {
			this.shadowRoot.querySelector('.tab').className = 'tab active';
		}
	}
}
window.customElements.define('nav-menu-li', NavMenuLi);
