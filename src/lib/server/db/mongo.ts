import { MONGODB_API_KEY, MONGODB_API_URI } from '$env/static/private';
import type { TransactionType } from '$lib/types/finance';
import type { GetAllTransactions } from './type';

const config = {
	dataSource: 'Financial-Dashboard-Cluster',
	database: 'financial-dashboard',
	collection: 'transactions'
};

const myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('Access-Control-Request-Headers', '*');
myHeaders.append('api-key', MONGODB_API_KEY);
myHeaders.append('Accept', 'application/json');

const getAllTransactions = async (params: GetAllTransactions | undefined) => {
	const raw = JSON.stringify({ ...config, filter: { ...params } });
	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw
	};

	try {
		const response = await fetch(`${MONGODB_API_URI}/action/find`, requestOptions);
		return response.json();
	} catch (error) {
		console.log(error);
	}
};

const addNewTransaction = async (transaction: TransactionType) => {
	const raw = JSON.stringify({ ...config, document: transaction });
	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw
	};

	try {
		const response = await fetch(`${MONGODB_API_URI}/action/insertOne`, requestOptions);
		return response.json();
	} catch (error) {
		console.log(error);
	}
};

export { getAllTransactions, addNewTransaction };
