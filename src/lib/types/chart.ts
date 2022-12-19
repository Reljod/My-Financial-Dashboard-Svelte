type DefaultSingleLineGraphDataOptions = {
	label: string;
	chartValues: Array<number | string>;
	color: string;
};

type DefaultSingleLineGraphOptions = {
	title: string;
	chartLabels: Array<string>;
	data: Array<DefaultSingleLineGraphDataOptions>;
	height: string | undefined;
};

export type { DefaultSingleLineGraphOptions, DefaultSingleLineGraphDataOptions };
