<script lang="ts">
	import Card from '$lib/components/RecentlyAdded/Card.svelte';
	import type { TransactionsType } from '$lib/types/finance';

	export let transactions: TransactionsType = [];

	const RECENTLY_ADDED_LIMIT = 3;

	$: transactions = transactions.slice(-1 * RECENTLY_ADDED_LIMIT).reverse();
</script>

<div class="p-3 font-sans">
	<div class="flex justify-between my-4 items-center">
		<p class="text-xl font-semibold">Transactions</p>
		<p class="text-sm font-medium text-green-600">See all</p>
	</div>
	<div class="overflow-y-auto max-h-full">
		{#each transactions as transaction}
			<Card {transaction} />
		{/each}
	</div>
</div>
