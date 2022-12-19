<script lang="ts">
	import { CurrencyCode } from '$lib/types/currency';
	import { ZodTypes } from '$lib/types/finance';
	import MdClose from 'svelte-icons/md/MdClose.svelte';
	import type { z } from 'zod';
	import type { PageData } from './$types';

	import RecentlyAdded from '$lib/components/RecentlyAdded/index.svelte';
	import GainsPerIntervalChart from '$lib/components/TimeSeriesCharts/ExpensesCharts/GainsPerIntervalChart.svelte';
	import PercentageGainPerIntervalChart from '$lib/components/TimeSeriesCharts/ExpensesCharts/PercentageGainPerIntervalChart.svelte';
	// import TimeSeriesCharts from '$lib/components/TimeSeriesCharts/index.svelte';

	export let data: PageData;

	let openAddTransactionForm = false;
	const transactionTypeOptions = ZodTypes.TxType.options;
	const currencyCodes = CurrencyCode.options;
	const transactionCategories = ZodTypes.TxCategory.options;
	const txGainCategories = ['SALARY', 'INITIAL'];
	const txExpensesCategories = [
		'BILLS',
		'FOOD',
		'TRANSPORTATION',
		'ENTERTAINMENT',
		'DEBT',
		'CHARITY'
	];

	let amount: z.infer<typeof ZodTypes.TxAmt>;
	let currency: z.infer<typeof ZodTypes.TxCurrency>;
	let type: z.infer<typeof ZodTypes.TxType>;
	let category: z.infer<typeof ZodTypes.TxCategory>;

	$: isTotalNegative = data.total.value < 0;
	$: isEnableSubmit = amount && currency && type && category;
	$: isEnableClear = !!amount;

	// $: console.log(amount, currency, type, category);
	// $: submitAddTransaction = () => {
	// 	openAddTransactionForm = false;
	// };

	function capitalize(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
	}
</script>

<svelte:head>
	<title>Financial Dashboard</title>
</svelte:head>

<div
	class="grid grid-cols-3 gap-3 w-screen h-screen max-h-screen p-2 box-border font-serif overflow-auto"
>
	<div class="grid grid-rows-5 gap-3 col-span-2">
		<div class="grid grid-cols-12 gap-3 row-span-2 ">
			<div class="grid grid-rows-12 gap-3 col-span-5 ">
				<div class="grid grid-cols-6 gap-3 row-span-5">
					<div class="col-span-1 flex flex-col">
						<button
							class="flex bg-card-primary aspect-square rounded-lg text-5xl text-center justify-center hover:bg-card-primary-hover"
							type="button"
							data-modal-toggle="add-transaction-form-modal"
							on:click={() => (openAddTransactionForm = true)}>+</button
						>
					</div>
					<div class="col-span-5 bg-card-primary" />
				</div>
				<div class="row-span-4 bg-card-primary" />
				<div class="flex row-span-3 gap-2">
					<div class="flex-1 bg-card-primary" />
					<div class="flex-1 bg-card-primary" />
				</div>
			</div>
			<div
				id="current-net-card"
				class="flex flex-col justify-center items-center col-span-7 bg-card-primary"
			>
				<div id="total-net">
					<div id="total-net-label" class="text-xs font-bold">TOTAL NET:</div>
					<div id="total-net-value" class={isTotalNegative ? 'text-red-800' : 'text-green-800'}>
						{#if isTotalNegative} - {/if}
						{data.total.currency}
						<span id="total-net-amount" class="text-4xl font-bold"
							>{Math.abs(data.total.value).toFixed(2)}</span
						>
					</div>
				</div>
			</div>
		</div>
		<div id="time-series-graph-card" class="grid row-span-3 gap-2">
			<div class="grid grid-cols-3 gap-2">
				<div class="grid grid-rows-2 col-span-2 gap-2">
					<div class="bg-card-primary">
						<GainsPerIntervalChart {data} />
					</div>
					<div class="bg-card-primary">
						<PercentageGainPerIntervalChart {data} />
					</div>
				</div>
				<div class="col-span-1 bg-card-primary" />
			</div>
		</div>
	</div>
	<div class="grid grid-rows-6 gap-3 col-span-1">
		<div class="row-span-4 bg-card-primary" />
		<div class="row-span-2 row-end-auto bg-card-primary">
			<RecentlyAdded transactions={data.transactions} />
		</div>
	</div>
</div>

{#if openAddTransactionForm}
	<div
		id="add-transaction-form-modal"
		tabindex="-1"
		aria-hidden="true"
		class="fixed top-0 left-0 right-0 z-40 w-screen h-screen bg-black bg-opacity-30 flex justify-center items-center"
	>
		<div class="relative w-[500px] h-[400px] bg-white rounded-lg z-50 px-4 pt-12">
			<button
				class="absolute top-2 right-2 w-8 h-8"
				on:click={() => (openAddTransactionForm = false)}><MdClose /></button
			>
			<h1 class="text-3xl font-bold">Add New transaction</h1>
			<form method="POST" action="?/add-transaction">
				<div class="form-control w-full py-4">
					<div class="flex w-full">
						<div class="flex-grow">
							<label for="transaction-amount" class="label">
								<span class="label-text">Amount</span>
							</label>
							<input
								name="amount"
								id="transaction-amount"
								type="text"
								placeholder="Enter amount"
								class="input input-bordered w-full max-w-xs"
								bind:value={amount}
							/>
						</div>
						<div class="flex-1">
							<label for="transaction-currency" class="label">
								<span class="label-text">Currency</span>
							</label>
							<select
								name="currency"
								id="transaction-currency"
								bind:value={currency}
								class="select select-bordered"
							>
								<option value="PHP">PHP</option>
								{#each currencyCodes as code}
									<option value={code}>{code}</option>
								{/each}
							</select>
						</div>
					</div>
					<div class="flex">
						<div class="mr-3">
							<label for="transaction-type" class="label">
								<span class="label-text">Type</span>
							</label>
							<select
								name="type"
								id="transaction-type"
								bind:value={type}
								class="select select-bordered"
							>
								{#each transactionTypeOptions as _type}
									<option value={_type}>{capitalize(_type)}</option>
								{/each}
							</select>
						</div>
						<div class="ml-2">
							<label for="transaction-category" class="label">
								<span class="label-text">Category</span>
							</label>
							<select
								name="category"
								id="transaction-category"
								bind:value={category}
								class="select select-bordered"
							>
								{#if type === 'GAIN'}
									{#each txGainCategories as _category}
										<option value={_category}>{capitalize(_category)}</option>
									{/each}
								{:else}
									{#each txExpensesCategories as _category}
										<option value={_category}>{capitalize(_category)}</option>
									{/each}
								{/if}
							</select>
						</div>
					</div>
				</div>
				<div class="flex w-full gap-2 mt-4">
					<button class="btn flex-1" disabled={!isEnableSubmit} type="submit">Submit</button>
					<button class="btn flex-1" disabled={!isEnableClear} type="button">Clear</button>
				</div>
			</form>
		</div>
	</div>
{/if}
