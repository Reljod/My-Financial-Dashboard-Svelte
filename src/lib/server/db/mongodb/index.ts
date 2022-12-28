import { MONGODB_API_KEY, MONGODB_API_URI } from '$env/static/private';
import type { TransactionType } from '$lib/types/finance';
import type { TransactionDb } from '..';
import type { GetAllTransactions } from '../type';

export class TransactionMongoDb implements TransactionDb {
	myHeaders = new Headers();
	CONFIG = {
		dataSource: 'Financial-Dashboard-Cluster',
		database: 'financial-dashboard',
		collection: 'transactions'
	};

	constructor() {
		this.myHeaders.append('Content-Type', 'application/json');
		this.myHeaders.append('Access-Control-Request-Headers', '*');
		this.myHeaders.append('api-key', MONGODB_API_KEY);
		this.myHeaders.append('Accept', 'application/json');
	}

	getAllTransactions = async (params: GetAllTransactions | undefined) => {
		const raw = JSON.stringify({ ...this.CONFIG, filter: { ...params } });
		const requestOptions = {
			method: 'POST',
			headers: this.myHeaders,
			body: raw
		};

		try {
			const response = await fetch(`${MONGODB_API_URI}/action/find`, requestOptions);
			return response.json();
		} catch (error) {
			console.log(error);
		}
	};

	addNewTransaction = async (transaction: TransactionType) => {
		const raw = JSON.stringify({ ...this.CONFIG, document: transaction });
		const requestOptions = {
			method: 'POST',
			headers: this.myHeaders,
			body: raw
		};

		try {
			const response = await fetch(`${MONGODB_API_URI}/action/insertOne`, requestOptions);
			return response.json();
		} catch (error) {
			console.log(error);
		}
	};
}
