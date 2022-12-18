<script lang="ts">
	import type { DefaultSingleLineGraphOptions } from '$lib/types/chart';
	import type { PageData } from '.svelte-kit/types/src/routes/$types';
	import DefaultSingleLineGraph from '../Default.svelte';

	export let data: PageData;
	// import type { TransactionsType } from "$lib/types/finance";

	$: params = {
		title: 'Daily Gains and Expenses',
		chartValues: data.relativePercentageGain.sum,
		chartLabels: data.relativePercentageGain.date,
		color: 'rgb(22, 101, 52)'
	} as DefaultSingleLineGraphOptions;
	$: console.log(data.relativePercentageGain);

	// export let transactions: TransactionsType = []
</script>

<DefaultSingleLineGraph {params} />
