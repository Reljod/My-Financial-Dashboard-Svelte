// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Error {}
	interface Locals {
		sessionId: string;
		user: import('$lib/types/auth/user').UserHashedType | null;
	}
	interface PageData {
		user: import('$lib/types/auth/user').UserHashedType | null;
		transactions: import('$lib/types/finance').TransactionsType;
		intervalStats: import('$lib/types/statistics').IntervalStats;
		total: import('$lib/types/finance').TotalType;
		amtCategories: import('$lib/types/statistics').AmtCategories;
	}
	// interface Platform {}
}
