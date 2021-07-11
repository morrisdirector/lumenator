export interface ILoaderProps {
	id?: string;
	loading?: boolean;
	/**
	 * @default: 'page'
	 */
	variant?: 'page' | 'container';
}
