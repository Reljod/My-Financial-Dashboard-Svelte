<script lang="ts">
	import type { DefaultSingleLineGraphOptions } from '$lib/types/chart';
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';

	export let params: DefaultSingleLineGraphOptions;

	// params.chartValues = [20, 10, 5, 2, 20, 30, 45];
	// params.chartLabels = ['12/12', '12/13', '12/14', '12/15', '12/16', '12/17', '12/18'];
	let ctx: any;
	let chartCanvas: HTMLCanvasElement;

	function isDate(dateStr: string) {
		return !isNaN(new Date(dateStr).getDate());
	}

	$: parseLabels = (labels: string[]) => {
		return labels.map((label) => {
			if (!isDate(label)) {
				return label;
			}
			const date = new Date(label);
			return `${date.getMonth() + 1}/${date.getDate()}`;
		});
	};

	onMount(async () => {
		ctx = chartCanvas.getContext('2d');
		var chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: parseLabels(params.chartLabels),
				datasets: [
					{
						label: params.title,
						backgroundColor: params.color,
						borderColor: params.color,
						data: params.chartValues
					}
				]
			}
		});
	});
</script>

<canvas bind:this={chartCanvas} height="120px" id="myChart" />
