<script lang="ts">
	import type {
		DefaultSingleLineGraphDataOptions,
		DefaultSingleLineGraphOptions
	} from '$lib/types/chart';
	import type { PageData } from '.svelte-kit/types/src/routes/$types';
	import DefaultSingleLineGraph from '../Default.svelte';

	export let data: PageData;

	const sumData = {
		chartValues: data.intervalStats.sum,
		label: 'Gains/Expenses (PHP)',
		color: 'rgb(22, 101, 52)'
	} as DefaultSingleLineGraphDataOptions;

	const accSumData = {
		chartValues: data.intervalStats.accSum,
		label: 'Total (PHP)',
		color: 'rgb(250, 204, 21)'
	} as DefaultSingleLineGraphDataOptions;

	$: params = {
		title: 'Daily Gains and Expenses',
		chartLabels: data.intervalStats.date,
		data: [sumData, accSumData],
		height: '100px'
	} as DefaultSingleLineGraphOptions;
</script>

<DefaultSingleLineGraph {params} />
