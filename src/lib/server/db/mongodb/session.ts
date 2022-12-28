import { MONGODB_API_KEY, MONGODB_API_URI } from '$env/static/private';
import type { Session } from '$lib/types/auth/session';
import type { z } from 'zod';
import type { SessionHandler } from '..';

export class MongoSessionHandler implements SessionHandler {
	myHeaders = new Headers();
	CONFIG = {
		dataSource: 'Financial-Dashboard-Cluster',
		database: 'financial-dashboard',
		collection: 'sessions'
	};

	constructor() {
		this.myHeaders.append('Content-Type', 'application/json');
		this.myHeaders.append('Access-Control-Request-Headers', '*');
		this.myHeaders.append('api-key', MONGODB_API_KEY);
		this.myHeaders.append('Accept', 'application/json');
	}

	createNewSession = async (session: z.infer<typeof Session>) => {
		const raw = JSON.stringify({ ...this.CONFIG, document: session });
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

	getSession = async (sessionToken: string) => {
		const raw = JSON.stringify({ ...this.CONFIG, filter: { sessionToken } });
		const requestOptions = {
			method: 'POST',
			headers: this.myHeaders,
			body: raw
		};

		try {
			const response = await fetch(`${MONGODB_API_URI}/action/findOne`, requestOptions);
			const session: z.infer<typeof Session> = (await response.json())['document'];
			return session;
		} catch (error) {
			console.log(error);
		}
	};

	deleteSession = async (sessionToken: string) => {
		const raw = JSON.stringify({ ...this.CONFIG, filter: { sessionToken } });
		const requestOptions = {
			method: 'POST',
			headers: this.myHeaders,
			body: raw
		};

		try {
			const response = await fetch(`${MONGODB_API_URI}/action/deleteOne`, requestOptions);
			return response.json();
		} catch (error) {
			console.log(error);
		}
	};
}
