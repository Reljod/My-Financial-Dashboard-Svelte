import { z } from 'zod';

const TxType = z.enum(['EXPENSE', 'GAIN']);
const TxAmt = z.number().int().positive().finite();
const TxCurrency = z.string().min(2).max(5);
const TxDateTime = z.string();
const TxCategory = z.enum([
	'BILLS',
	'SALARY',
	'INITIAL',
	'FOOD',
	'TRANSPORTATION',
	'ENTERTAINMENT',
	'DEBT'
]);

const Transaction = z.object({
	type: TxType,
	amt: TxAmt,
	currency: TxCurrency,
	created_at: TxDateTime,
	updated_at: TxDateTime,
	category: TxCategory
});

const Transactions = z.array(Transaction);

type TransactionType = z.infer<typeof Transaction>;
type TransactionsType = z.infer<typeof Transactions>;

const Total = z.object({
	value: z.number().int().positive().finite(),
	currency: TxCurrency
});

type TotalType = z.infer<typeof Total>;

export const ZodTypes = {
	TxType,
	TxAmt,
	TxCurrency,
	TxDateTime,
	TxCategory,
	Transaction,
	Transactions,
	Total
};

export type { TransactionType, TransactionsType, TotalType };
