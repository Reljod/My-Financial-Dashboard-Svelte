import type { Session } from '$lib/types/auth/session';
import type { TransactionType } from '$lib/types/finance';
import type { z } from 'zod';
import type { GetAllTransactions } from './type';

type SessionType = z.infer<typeof Session>;

export interface TransactionDb {
	addNewTransaction: (transaction: TransactionType) => Promise<TransactionType>;
	getAllTransactions: (params: GetAllTransactions | undefined) => Promise<TransactionType[]>;
}

export interface SessionHandler {
	createNewSession: (session: SessionType) => Promise<any>;
	getSession: (sessionToken: string) => Promise<SessionType | undefined>;
	deleteSession: (sessionToken: string) => Promise<any>;
}
