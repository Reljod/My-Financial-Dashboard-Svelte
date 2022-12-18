<script lang="ts">
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';

	export let title: string;
	export let chartValues: number[] = [];
	export let chartLabels: string[] = [];

	chartValues = [20, 10, 5, 2, 20, 30, 45];
	const chartValuesReverse = [45, 30, 20, 2, 5, 10, 20];
	chartLabels = ['12/12', '12/13', '12/14', '12/15', '12/16', '12/17', '12/18'];
	let ctx: any;
	let chartCanvas: HTMLCanvasElement;

	onMount(async () => {
		ctx = chartCanvas.getContext('2d');
		var chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: chartLabels,
				datasets: [
					{
						label: 'Revenue',
						backgroundColor: 'rgb(22, 101, 52)',
						borderColor: 'rgb(22, 101, 52)',
						data: chartValues
					}
				]
			}
		});
	});
</script>

<canvas bind:this={chartCanvas} height="50px" id="myChart" />
