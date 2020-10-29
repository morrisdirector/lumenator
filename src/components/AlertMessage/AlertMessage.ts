import { CustomElement } from '../BaseComponent/BaseComponent';

const template = document.createElement('template');
template.innerHTML = /*html*/ `
<style>
	@import "style.css";
</style>
<div class="alert-message">
	<div id="message" class="info">
		<span class="icon hidden"></span>
		<span class="text"></span>
		<button class="close">x</button>
	</div>
</div>
`;
class AlertMessage extends CustomElement {
	constructor() {
		super(template);
		const text = this.getAttribute('text');
		this.setState({
			text: text,
			icon: this.getAttribute('icon'),
			type: this.getAttribute('type') || 'info',
			closable: !!this.getAttribute('closable'),
			visible: !!text
		});

		this.onClose = this.onClose.bind(this);
	}

	onStateChanges = (state, previousState) => {
		if (!state.visible && state.text && state.text !== previousState.text) {
			this.setState({ visible: true });
			return;
		}
		if (state.visible) {
			const newClass = state.closable ? `closable ${state.type}` : state.type;
			this.shadowRoot.querySelector('#message').className = newClass;
			this.shadowRoot.querySelector('#message span.text').innerHTML = state.text;
			this.shadowRoot.querySelector('.alert-message').className = 'alert-message';

			if (state.icon) {
				switch (state.icon) {
					case 'info':
					default:
						this.shadowRoot.querySelector('#message span.icon').innerHTML = 'i';
						break;
				}
				this.shadowRoot.querySelector('#message span.icon').className = 'icon';
			} else {
				this.shadowRoot.querySelector('#message span.icon').className = 'icon hidden';
			}
		} else {
			this.shadowRoot.querySelector('.alert-message').className = 'alert-message hidden';
		}
	};

	onClose() {
		this.setState({ visible: false, text: null });
	}

	connectedCallback() {
		this.shadowRoot.querySelector('button').addEventListener('click', this.onClose);
	}

	disconnectedCallback() {
		this.shadowRoot.querySelector('button').removeEventListener('click', this.onClose);
	}
}
window.customElements.define('alert-message', AlertMessage);
