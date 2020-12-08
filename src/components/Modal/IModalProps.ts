export interface IModalActionButton {
	variant?: 'primary' | 'default';
	label?: string;
	callback?: () => {};
}

export interface IModalProps {
	open?: boolean;
	header?: string;
	/**
	 * Default: true
	 */
	closeOnDimmerClick?: boolean;
	loading?: boolean;
	actionButtons?: Array<IModalActionButton>;
}
