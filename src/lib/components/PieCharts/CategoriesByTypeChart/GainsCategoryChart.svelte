<script lang="ts">
	import type { DefaultPieChartDataOptions, DefaultPieChartOptions } from '$lib/types/chart';
	import type { PageData } from '.svelte-kit/types/src/routes/$types';
	import DefaultGraph from './Default.svelte';

	export let data: PageData;

	const graphData = {
		label: data.amtCategories.gains.categories,
		datasets: [{ data: data.amtCategories.gains.amounts }]
	} as DefaultPieChartOptions;

	$: params = {
		title: 'Expenses by Gains (PHP)',
		data: graphData,
		height: '50px'
	} as DefaultPieChartDataOptions;
</script>

<DefaultGraph {params} />
