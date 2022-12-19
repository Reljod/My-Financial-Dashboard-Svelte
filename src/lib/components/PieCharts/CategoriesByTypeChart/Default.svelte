<script lang="ts">
	import type { DefaultPieChartDataOptions } from '$lib/types/chart';
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';

	export let params: DefaultPieChartDataOptions;

	let ctx: any;
	let chartCanvas: HTMLCanvasElement;

	function capitalizeWord(string: string) {
		return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
	}

	$: parseLabels = (labels: string[]) => {
		return labels.map((label) => {
			return capitalizeWord(label);
		});
	};

	onMount(async () => {
		ctx = chartCanvas.getContext('2d');
		var chart = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: parseLabels(params.data.label),
				datasets: params.data.datasets
			},
			options: {
				plugins: {
					title: {
						display: true,
						text: params.title
					}
				}
			}
		});
	});
</script>

<canvas bind:this={chartCanvas} height={params.height || '120px'} id="myChart" />
