import { sessionConfig } from '$lib/server/config/session';
import type { SessionHandler, TransactionDb } from '$lib/server/db';
import { TransactionMongoDb } from '$lib/server/db/mongodb';
import Authentication, { BCryptPasswordHasher } from '$lib/server/db/mongodb/auth';
import { MongoSessionHandler } from '$lib/server/db/mongodb/session';
import Statistics from '$lib/server/finance/stats';
import { Summary } from '$lib/server/finance/summary';
import type { LoginInput } from '$lib/types/auth/user';
import { ZodTypes } from '$lib/types/finance';
import type { AmtCategories, IntervalStats } from '$lib/types/statistics';
import { redirect } from '@sveltejs/kit';
import cuid from 'cuid';
import type { z } from 'zod';
import type { Actions } from './$types';

const passwordHasher = new BCryptPasswordHasher();
const authentication = new Authentication(passwordHasher);
const transactionDb: TransactionDb = new TransactionMongoDb();
const sessionHandler: SessionHandler = new MongoSessionHandler();

export const load = async (event: any) => {
	const transactionsRawDb = await transactionDb.getAllTransactions({} as any);
	const transactionsRaw = transactionsRawDb['documents'];

	const transactions = ZodTypes.Transactions.parse(transactionsRaw);
	transactions.sort((a, b) => new Date(a.created_at).getDate() - new Date(b.created_at).getDate());
	const summary = new Summary(transactions);
	const stats = new Statistics(transactions);

	const intervalStats: IntervalStats = stats.getIntervalStats();
	const expenses = stats.getAmountCategoriesByType('EXPENSE');
	const gains = stats.getAmountCategoriesByType('GAIN');

	const amtCategories = {
		expenses,
		gains
	} as AmtCategories;

	const data = {
		transactions,
		intervalStats,
		amtCategories,
		total: {
			value: summary.total,
			currency: 'PHP'
		},
		user: event.locals.user
	};

	return data;
};

export const actions: Actions = {
	'add-transaction': async (event) => {
		const formData = await event.request.formData();
		const datetimeStr = formData.get('transactionDate') + ' ' + formData.get('transactionTime');

		const newTransaction = ZodTypes.Transaction.parse({
			type: formData.get('type'),
			amt: parseFloat(formData.get('amount') as string),
			currency: formData.get('currency'),
			created_at: new Date(datetimeStr).toISOString(),
			updated_at: new Date().toISOString(),
			category: formData.get('category')
		});

		await transactionDb.addNewTransaction(newTransaction);
	},

	login: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		const { user, error } = await authentication.login({ email, password } as z.infer<
			typeof LoginInput
		>);
		if (user && !error) {
			const newSessionId = cuid();
			await sessionHandler.createNewSession({
				id: cuid(),
				sessionToken: newSessionId,
				userId: user.id,
				expires: new Date(Date.now() + sessionConfig.default.maxAge * 1000).toISOString()
			});

			event.locals.sessionId = newSessionId;
			event.locals.user = user;
			event.cookies.set('sessionid', newSessionId, sessionConfig.default);
		}

		throw redirect(303, '/');
	},

	logout: async (event) => {
		const sessionId = event.locals.sessionId;
		await sessionHandler.deleteSession(sessionId);
		event.cookies.set('sessionid', '', sessionConfig.default);
		throw redirect(303, '/');
	}
};
