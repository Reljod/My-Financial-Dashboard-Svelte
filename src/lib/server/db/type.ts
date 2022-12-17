export type GetAllTransactions = {
	limit: number | undefined;
	type: 'EXPENSE' | 'GAIN' | undefined;
};
