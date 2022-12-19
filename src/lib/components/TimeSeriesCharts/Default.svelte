<script lang="ts">
	import type { DefaultSingleLineGraphOptions } from '$lib/types/chart';
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';

	export let params: DefaultSingleLineGraphOptions;

	let ctx: any;
	let chartCanvas: HTMLCanvasElement;

	function isDate(dateStr: string) {
		return !isNaN(new Date(dateStr).getDate());
	}

	$: datasetsValue = params.data.map((data) => {
		return {
			label: data.label,
			backgroundColor: data.color,
			borderColor: data.color,
			data: data.chartValues
		};
	});

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
				datasets: datasetsValue
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
