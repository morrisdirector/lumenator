export interface IModalActionButton {
	variant?: 'primary' | 'default';
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
