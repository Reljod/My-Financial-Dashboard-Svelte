<script lang="ts">
	import type {
		DefaultSingleLineGraphDataOptions,
		DefaultSingleLineGraphOptions
	} from '$lib/types/chart';
	import type { PageData } from '.svelte-kit/types/src/routes/$types';
	import DefaultSingleLineGraph from '../Default.svelte';

	export let data: PageData;

	const percentageData = {
		chartValues: data.intervalStats.percentageIncrease,
		label: '% Gains/Expenses',
		color: 'rgb(22, 101, 52)'
	} as DefaultSingleLineGraphDataOptions;

	$: params = {
		title: 'Daily Percentage (%) Gain/Expense from total',
		chartLabels: data.intervalStats.date,
		data: [percentageData],
		height: '100px'
	} as DefaultSingleLineGraphOptions;
</script>

<DefaultSingleLineGraph {params} />
