import { getUniqueId } from '../../shared/Utils';
import { CustomElement } from '../BaseComponent/BaseComponent';
import { IModalActionButton, IModalProps } from './IModalProps';

const template = document.createElement('template');
template.innerHTML = /*html*/ `
<style>
	@import "style.css";
</style>
<div id="lum-modal" class="lum-modal">
	<div class="modal-wrapper">
		<div class="modal-col">
			<div class="modal">
				<div class="modal-header hidden">
					<h4 id="modal-header-text"></h4>
					<button id="close">X</button>
				</div>
				<div class="modal-body">
					<slot></slot>
					<ui-loader loading="true" class="modal-loader" variant="container"></ui-loader>
				</div>
				<div id="modal-footer" class="modal-footer hidden">
				</div>
			</div>
		</div>
	</div>
</div>
`;
class Modal extends CustomElement {
	constructor() {
		super(template);
		this.setState({
			open: this.getAttribute('open') === 'true',
			header: this.getAttribute('header'),
			closeOnDimmerClick: this.getAttribute('closeOnDimmerClick') !== 'false',
			minHeight: this.getAttribute('minHeight') ? this.getAttribute('minHeight') + 'px' : null
		} as IModalProps);
	}

	private close = (): void => {
		this.cancelWatchers();
		this.setState({ open: false });
	};

	private onDimmerClick = (e: MouseEvent): void => {
		if (!this.state.closeOnDimmerClick) {
			return;
		}
		const classList = (e.target as HTMLElement).classList;
		if (classList.contains('modal-col') || classList.contains('modal-wrapper')) {
			this.close();
		}
	};

	private toggleVisible = (selector: string, visible: boolean): void => {
		if (!!visible) {
			this.addClass('visible', selector);
			this.removeClass('hidden', selector);
		} else {
			this.removeClass('visible', selector);
			this.addClass('hidden', selector);
		}
	};

	onStateChanges = (state: IModalProps, previous: IModalProps) => {
		this.addClass('noScroll', null, document.body);
		if (!!state.open) {
			this.addClass('noScroll', null, document.body);
			this.addClass('open', '#lum-modal');
			this.removeClass('closed', '#lum-modal');
		} else {
			this.removeClass('noScroll', null, document.body);
			this.addClass('closed', '#lum-modal');
			this.removeClass('open', '#lum-modal');
		}
		if (state.header) {
			this.toggleVisible('.modal-header', true);
			const h4 = this.shadowRoot.getElementById('modal-header-text');
			h4.innerHTML = state.header;
		} else {
			this.toggleVisible('.modal-header', false);
		}
		if (state.actionButtons && state.actionButtons.length) {
			this.toggleVisible('.modal-footer', true);
			const footer = this.shadowRoot.getElementById('modal-footer');
			footer.innerHTML = null;
			state.actionButtons.forEach((button: IModalActionButton) => {
				const id = getUniqueId();
				const b = document.createElement('button');
				b.setAttribute('id', id);
				b.innerHTML = button.label || '';
				footer.appendChild(b);
				this.watch(id, 'click', () => {
					debugger;
				});
			});
		} else {
			this.toggleVisible('.modal-header', false);
		}
		// console.log(state.loading);
		if (!!state.loading) {
			this.addClass('loading', '#lum-modal');
		} else {
			this.removeClass('loading', '#lum-modal');
		}
	};

	connectedCallback() {
		this.shadowRoot.getElementById('lum-modal').addEventListener('click', this.onDimmerClick);
		this.shadowRoot.getElementById('close').addEventListener('click', this.close);
	}

	disconnectedCallback() {
		this.cancelWatchers();
		// this.shadowRoot.getElementById('lum-modal').removeEventListener('click', this.onDimmerClick);
		// this.shadowRoot.getElementById('close').removeEventListener('click', this.close);
	}
}
window.customElements.define('lum-modal', Modal);
