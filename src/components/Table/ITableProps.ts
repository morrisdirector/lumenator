export interface ITableActionButtonProps {
	variant: string;
	label?: string;
	callback?(row): any;
}

export interface ITableColumnProps {
	key?: string;
	header?: string;
	actionButtons?: Array<ITableActionButtonProps>;
}

export interface ITableConfigProps {
	columns: Array<ITableColumnProps>;
}

export interface ITableProps<T> {
	config: ITableConfigProps;
	data?: Array<T>;
}
