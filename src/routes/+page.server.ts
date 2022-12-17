import { addNewTransaction, getAllTransactions } from '$lib/server/db';
import { Summary } from '$lib/server/finance/summary';
import { ZodTypes } from '$lib/types/finance';
import type { Actions, RouteParams } from './$types';

export const load = async ({ params }: { params: RouteParams }) => {
	const transactionsRawDb = await getAllTransactions({} as any);
	const transactionsRaw = transactionsRawDb['documents'];

	const transactions = ZodTypes.Transactions.parse(transactionsRaw);
	const summary = new Summary(transactions);

	const data = {
		transactions,
		total: {
			value: summary.total,
			currency: 'PHP'
		}
	};

	return data;
};

export const actions: Actions = {
	transaction: async (event) => {
		const formData = await event.request.formData();
		const newTransaction = ZodTypes.Transaction.parse({
			type: formData.get('type'),
			amt: parseFloat(formData.get('amount') as string),
			currency: formData.get('currency'),
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			category: formData.get('category')
		});

		await addNewTransaction(newTransaction);
	}
};
