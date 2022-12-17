import type { TransactionsType } from '$lib/types/finance';

export class Summary {
	constructor(public transactions: TransactionsType) {
		this.transactions = transactions;
	}

	get total(): number {
		return this.transactions.reduce((accumulator, obj) => {
			let result: number;
			if (obj.type === 'GAIN') {
				result = accumulator + obj.amt;
			} else if (obj.type === 'EXPENSE') {
				result = accumulator - obj.amt;
			} else {
				result = accumulator;
			}

			return result;
		}, 0);
	}
}
