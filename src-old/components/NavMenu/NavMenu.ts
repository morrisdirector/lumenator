import { CustomElement } from '../BaseComponent/BaseComponent';

const template = document.createElement('template');
template.innerHTML = /*html*/ `
<style>
	@import "style.css";
</style>
<ul class='nav-menu-ul'><slot></slot></ul>
`;
class NavMenu extends CustomElement {
	public activeTab;
	constructor() {
		super(template);
		this.activeTab = this.getAttribute('activeTab');
	}

	resetAllTabs(tabs) {
		for (let tab of tabs) {
			tab.shadowRoot.querySelector('.tab').className = 'tab hidden';
			const tabId = tab.getAttribute('id');
			const panel = document.getElementById(`panel-${tabId}`);
			if (panel) {
				panel.classList.add('hidden');
				panel.classList.remove('active');
			}
		}
	}

	onClick(e) {
		const tabId = e && e.target && e.target.id;
		if (tabId) {
			const tabs = Array.from(this.querySelectorAll('nav-menu-li'));
			this.resetAllTabs(tabs);
			const selected = tabs.find((t) => t.getAttribute('id') === tabId);
			selected.shadowRoot.querySelector('.tab').className = 'tab active';
			const panel = document.getElementById(`panel-${tabId}`);
			if (panel) {
				panel.classList.remove('hidden');
				panel.classList.add('active');
			}
		}
	}

	connectedCallback() {
		this.addEventListener('click', this.onClick);
	}

	disconnectedCallback() {
		this.removeEventListener('click', this.onClick);
	}
}
window.customElements.define('nav-menu', NavMenu);
