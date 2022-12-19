interface DefaultSingleLineGraphDataOptions {
	label: string;
	color: string;
	chartValues: Array<number | string>;
}

interface DefaultSingleLineGraphOptions {
	title: string;
	chartLabels: Array<string>;
	height: string | undefined;
	data: Array<DefaultSingleLineGraphDataOptions>;
}

interface DefaultPieChartOptions {
	datasets: Array<{ data: Array<number> }>;
	label: Array<string>;
}

interface DefaultPieChartDataOptions {
	title: string;
	height: string | undefined;
	data: DefaultPieChartOptions;
}

export type {
	DefaultSingleLineGraphOptions,
	DefaultSingleLineGraphDataOptions,
	DefaultPieChartOptions,
	DefaultPieChartDataOptions
};
