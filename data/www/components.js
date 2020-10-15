class CustomElement extends HTMLElement {
	constructor(template) {
		super();
		this.state = {};
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.appendChild(template.content.cloneNode(true));
	}

	isObject(arg) {
		return (typeof arg === 'object' || typeof arg === 'function' || Array.isArray(arg)) && !!arg;
	}

	/**
	 * Updates the state with a new state
	 * @param newState 
	 */
	setState(newState) {
		const previousState = { ...this.state };
		Object.entries(newState).forEach(([ key, value ]) => {
			this.state[key] =
				this.isObject(this.state[key]) && this.isObject(value) ? { ...this.state[key], ...value } : value;
		});
		if (typeof this.onStateChanges === 'function') {
			this.onStateChanges(this.state, previousState);
		}
	}

	/**
	 * Updates Value for form elements where ID is provided
	 * @param value 
	 */
	updateValue(value) {
		if (this.state.id) {
			this.setState({ [this.state.id]: value });
		}
	}
}

/**
 * Alert Message Component
 */
const alertMessageTemplate = document.createElement('template');
alertMessageTemplate.innerHTML = /*html*/ `
<style>
	@import "style.css";
</style>
<div class="alert-message">
	<div id="message" class="info">
		<span></span>
		<button class="close">x</button>
	</div>
</div>
`;
class AlertMessage extends CustomElement {
	constructor() {
		super(alertMessageTemplate);
		const text = this.getAttribute('text');
		this.setState({
			text: text,
			type: this.getAttribute('type') || 'info',
			closable: !!this.getAttribute('closable'),
			visible: !!text
		});

		this.onClose = this.onClose.bind(this);
	}

	onStateChanges(state, previousState) {
		if (!state.visible && state.text && state.text !== previousState.text) {
			this.setState({ visible: true });
			return;
		}
		if (state.visible) {
			const newClass = state.closable ? `closable ${state.type}` : state.type;
			this.shadowRoot.querySelector('#message').className = newClass;
			this.shadowRoot.querySelector('#message span').innerHTML = state.text;
			this.shadowRoot.querySelector('.alert-message').className = 'alert-message';
		} else {
			this.shadowRoot.querySelector('.alert-message').className = 'alert-message hidden';
		}
	}

	onClose() {
		this.setState({ visible: false });
	}

	connectedCallback() {
		this.shadowRoot.querySelector('button').addEventListener('click', this.onClose);
	}

	disconnectedCallback() {
		this.shadowRoot.querySelector('button').removeEventListener('click', this.onClose);
	}
}
window.customElements.define('alert-message', AlertMessage);

/**
 * Toggle Switch Component
 */
const toggleTemplate = document.createElement('template');
toggleTemplate.innerHTML = /*html*/ `
<style>
	@import "style.css";
</style>
<div class="toggle-switch on" ontouchstart="return true;">
	<div class="circle"></div>
</div>
`;
class ToggleSwitch extends CustomElement {
	constructor() {
		super(toggleTemplate);
		this.setState({ state: this.getAttribute('state') || 'OFF', id: this.getAttribute('id') });
		this.shadowRoot.querySelector('.toggle-switch').className = `toggle-switch ${this.state.state}`;
	}

	onStateChanges(state) {
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

/**
 * Nav Menu Component
 */
const navMenu = document.createElement('template');
navMenu.innerHTML = /*html*/ `
<style>
	@import "style.css";
</style>
<ul class='nav-menu-ul'><slot></slot></ul>
`;
class NavMenu extends CustomElement {
	// activeTab;
	constructor() {
		super(navMenu);
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

/**
 * Nav Menu Li Component
 */
const navMenuLi = document.createElement('template');
navMenuLi.innerHTML = /*html*/ `
<style>
	@import "style.css";
</style>
<li class="tab hidden"><slot></slot>
</li>
`;
class NavMenuLi extends CustomElement {
	constructor() {
		super(navMenuLi);
		if (this.getAttribute('active') !== null) {
			this.shadowRoot.querySelector('.tab').className = 'tab active';
		}
	}
}
window.customElements.define('nav-menu-li', NavMenuLi);

/**
 * Input
 */
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

	onStateChanges(state) {
		const input = this.shadowRoot.querySelector('#input');
		if (state.value !== input.value) {
			input.value = state.value;
		}
		this.shadowRoot.querySelector('#input').type = state.type;
	}

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

/**
 * Dropdown Menu (select)
 */
const dropdownMenuTemplate = document.createElement('template');
dropdownMenuTemplate.innerHTML = /*html*/ `
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
		super(dropdownMenuTemplate);
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

	onStateChanges(state) {
		const select = this.shadowRoot.querySelector('#select');
		if (state.value !== select.value) {
			select.value = state.value;
		}
		select.classList = !state.value ? 'placeholder' : '';
	}

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
		this.shadowRoot.removeEventListener('slotchange');
	}
}
window.customElements.define('dropdown-menu', DropdownMenu);

/**
 * Chip
 */
const chipTemplate = document.createElement('template');
chipTemplate.innerHTML = /*html*/ `
<style>
	@import "style.css";
</style>
<div id="chip" class="chip hidden"></div>
`;
class Chip extends CustomElement {
	constructor() {
		super(chipTemplate);
		this.setState({
			id: this.getAttribute('id'),
			text: this.getAttribute('text')
		});
	}
	onStateChanges(state) {
		if (state.text) {
			this.shadowRoot.querySelector('#chip').innerHTML = state.text;
			this.shadowRoot.querySelector('#chip').className = 'chip';
		}
	}
}
window.customElements.define('ui-chip', Chip);

/**
 * Loader
 */
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
	onStateChanges(state) {
		this.updateLoadingClass(state.loading);
	}
}
window.customElements.define('ui-loader', Loader);
