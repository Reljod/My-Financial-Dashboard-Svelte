<script lang="ts">
	import type { DefaultPieChartDataOptions, DefaultPieChartOptions } from '$lib/types/chart';
	import type { PageData } from '.svelte-kit/types/src/routes/$types';
	import DefaultGraph from './Default.svelte';

	export let data: PageData;

	const graphData = {
		label: data.amtCategories.expenses.categories,
		datasets: [{ data: data.amtCategories.expenses.amounts }]
	} as DefaultPieChartOptions;

	$: params = {
		title: 'Expenses by Category (PHP)',
		data: graphData,
		height: '50px'
	} as DefaultPieChartDataOptions;
</script>

<DefaultGraph {params} />
