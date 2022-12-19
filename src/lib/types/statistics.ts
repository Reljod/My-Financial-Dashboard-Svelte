type IntervalStats = {
	sum: Array<number>;
	date: Array<string>;
	accSum: Array<number>;
	percentageIncrease: Array<number>;
};

type AmtCategoriesByType = {
	amounts: Array<number>;
	categories: Array<string>;
};

type AmtCategories = {
	expenses: AmtCategoriesByType;
	gains: AmtCategoriesByType;
};

export type { IntervalStats, AmtCategories, AmtCategoriesByType };
