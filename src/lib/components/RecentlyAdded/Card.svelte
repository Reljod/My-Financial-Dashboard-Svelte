<script lang="ts">
	import type { TransactionType } from '$lib/types/finance';
	import { ZodTypes } from '$lib/types/finance';

	export let transaction: TransactionType;

	$: transactionAction =
		transaction.type === ZodTypes.TxType.Values.GAIN ? 'Received from' : 'Used in';
	$: isNegative = transaction.type === ZodTypes.TxType.Values.EXPENSE;
</script>

<div class="flex justify-between items-center py-1">
	<div>
		<p id="transaction-action" class="text-xs text-gray-400">{transactionAction}</p>
		<p>{transaction.category}</p>
	</div>
	<div>
		<p class="text-xs text-gray-400">18 Dec 2022</p>
		<p class={`${isNegative ? 'text-red-800' : 'text-green-800'} font-semibold`}>
			{#if isNegative}-{/if}
			{transaction.currency}
			{transaction.amt}
		</p>
	</div>
</div>
