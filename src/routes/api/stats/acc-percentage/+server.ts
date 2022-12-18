import { getAllTransactions } from '$lib/server/db';
import Statistics from '$lib/server/finance/stats';
import { ZodTypes } from '$lib/types/finance';

export const GET = async () => {
	const transactionsRawDb = await getAllTransactions({} as any);
	const transactionsRaw = transactionsRawDb['documents'];

	const transactions = ZodTypes.Transactions.parse(transactionsRaw);

	const stats = new Statistics(transactions);
};
