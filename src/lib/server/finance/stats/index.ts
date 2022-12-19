import type { TransactionsType } from '$lib/types/finance';
import { ZodTypes } from '$lib/types/finance';
import type { IntervalStats } from '$lib/types/statistics';
import dfd from 'danfojs-node';

class Statistics {
	keys: Array<string>;

	constructor(public transactions: TransactionsType) {
		this.transactions = transactions;
		this.keys = ZodTypes.Transaction.keyof().options;
	}

	getIntervalStats(): IntervalStats {
		const df = new dfd.DataFrame(this.transactions);
		const createdAtDate = df['created_at'].apply((x: string | number | Date) =>
			new Date(x).toDateString()
		);
		const signedAmtDf = df.loc({ columns: ['type', 'amt'] }).apply((row: number[]) => {
			row[1] = (row[0] as unknown as string) === 'GAIN' ? row[1] : row[1] * -1;
			return row;
		});
		// const signedAmt = df['amt'].apply((x) => (df['type'] === 'GAIN' ? x : x * -1));
		// df.loc[(df['type'] === 'EXPENSE', 'signed_amt')] = df['amt'] * -1;

		df.addColumn('created_at_date', createdAtDate, { inplace: true });
		df.addColumn('signed_amt', signedAmtDf['amt'], { inplace: true });

		const newDf = df.loc({ columns: ['created_at_date', 'signed_amt'] });

		const groupedDf = newDf.groupby(['created_at_date']).sum();

		groupedDf.print();

		const isoDate = groupedDf['created_at_date'].apply((x: string | number | Date) =>
			new Date(x).toISOString()
		);
		const cumSum = groupedDf.loc({ columns: ['signed_amt_sum'] }).cumSum({ axis: 0 });

		groupedDf.addColumn('created_at_date_iso', isoDate, { inplace: true });
		groupedDf.addColumn('signed_amt_sum_cum', cumSum['signed_amt_sum'], { inplace: true });

		groupedDf.print();

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

		groupedDf.print();

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
