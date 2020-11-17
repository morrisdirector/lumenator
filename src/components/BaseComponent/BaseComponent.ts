export class CustomElement extends HTMLElement {
	public state;
	public onStateChanges;

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
				this.isObject(this.state[key]) && this.isObject(value)
					? { ...this.state[key], ...value as object }
					: value;
		});
		if (typeof this.onStateChanges === 'function') {
			this.onStateChanges(this.state, previousState);
		}
	}

	private getEl(selector?: string, context: ShadowRoot | HTMLElement = this.shadowRoot): HTMLElement {
		return selector ? context.querySelector(selector) : context as HTMLElement;
	}

	addClass(add: string, selector?: string, context: ShadowRoot | HTMLElement = this.shadowRoot) {
		const el: HTMLElement = this.getEl(selector, context);
		const classList = el.className.split(' ');
		if (!classList.find((c) => c === add)) {
			classList.push(add);
		}
		el.className = classList.join(' ');
	}

	removeClass(remove: string, selector?: string, context: ShadowRoot | HTMLElement = this.shadowRoot) {
		const el: HTMLElement = this.getEl(selector, context);
		const classList = el.className.split(' ').filter((c) => c !== remove);
		el.className = classList.join(' ');
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
