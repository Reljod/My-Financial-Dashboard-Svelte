import type { TransactionsType, TransactionType_Type } from '$lib/types/finance';
import { ZodTypes } from '$lib/types/finance';
import type { AmtCategoriesByType, IntervalStats } from '$lib/types/statistics';
import dfd from 'danfojs-node';

class Statistics {
	keys: Array<string>;
	df: dfd.DataFrame;

	constructor(public transactions: TransactionsType) {
		this.transactions = transactions;
		this.keys = ZodTypes.Transaction.keyof().options;
		this.df = new dfd.DataFrame(this.transactions);
		this._preprocess();
	}

	_preprocess() {
		const createdAtDate = this.df['created_at'].apply((x: string | number | Date) =>
			new Date(x).toDateString()
		);
		const signedAmtDf = this.df.loc({ columns: ['type', 'amt'] }).apply((row: number[]) => {
			row[1] = (row[0] as unknown as string) === 'GAIN' ? row[1] : row[1] * -1;
			return row;
		});

		this.df.addColumn('created_at_date', createdAtDate, { inplace: true });
		this.df.addColumn('signed_amt', signedAmtDf['amt'], { inplace: true });
	}

	getAmountCategoriesByType(type: TransactionType_Type): AmtCategoriesByType {
		let newDf = this.df.loc({ columns: ['type', 'amt', 'category'] });
		newDf = newDf.groupby(['type', 'category']).sum();
		const filteredDf = newDf.query(newDf['type'].eq(type));

		const result = {
			amounts: filteredDf['amt_sum'].values,
			categories: filteredDf['category'].values
		} as AmtCategoriesByType;

		return result;
	}

	getIntervalStats(): IntervalStats {
		const newDf = this.df.loc({ columns: ['created_at_date', 'signed_amt'] });
		const groupedDf = newDf.groupby(['created_at_date']).sum();
		const isoDate = groupedDf['created_at_date'].apply((x: string | number | Date) =>
			new Date(x).toISOString()
		);
		const cumSum = groupedDf.loc({ columns: ['signed_amt_sum'] }).cumSum({ axis: 0 });

		groupedDf.addColumn('created_at_date_iso', isoDate, { inplace: true });
		groupedDf.addColumn('signed_amt_sum_cum', cumSum['signed_amt_sum'], { inplace: true });

		let index = 0;
		const percentageIncrease = groupedDf.loc({ columns: ['signed_amt_sum_cum'] }).apply((row) => {
			let val: any;
			if (index === 0) {
				val = 0;
			} else {
				val = (row[0] / groupedDf['signed_amt_sum_cum'].values[index - 1]) * 100 - 100;
			}
			index++;
			return val;
		}).values;
		groupedDf.addColumn('percentage_increase', percentageIncrease as number[], {
			inplace: true
		});

		const dataObj: IntervalStats = {
			sum: groupedDf['signed_amt_sum'].values,
			date: groupedDf['created_at_date_iso'].values,
			accSum: groupedDf['signed_amt_sum_cum'].values,
			percentageIncrease: groupedDf['percentage_increase'].values
		};

		return dataObj;
	}
}

export default Statistics;
