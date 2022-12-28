import { MONGODB_API_KEY, MONGODB_API_URI } from '$env/static/private';
import type { LoginInput } from '$lib/types/auth/user';
import User, { UserHashed } from '$lib/types/auth/user';
import bcrypt from 'bcrypt';
import type { z } from 'zod';

type UserType = z.infer<typeof User>;

class Authentication {
	myHeaders = new Headers();
	CONFIG = {
		dataSource: 'Financial-Dashboard-Cluster',
		database: 'financial-dashboard',
		collection: 'users'
	};
	hasher: PasswordHasher;

	constructor(hasher: PasswordHasher) {
		this.hasher = hasher;
		this.myHeaders.append('Content-Type', 'application/json');
		this.myHeaders.append('Access-Control-Request-Headers', '*');
		this.myHeaders.append('api-key', MONGODB_API_KEY);
		this.myHeaders.append('Accept', 'application/json');
	}

	register = async (user: UserType) => {
		const hashedPassword = await this.hasher.hash(user.password);
		const userWithHashedPassword = { ...user, password: hashedPassword };
		const raw = JSON.stringify({ ...this.CONFIG, document: userWithHashedPassword });
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

	login = async (loginInput: z.infer<typeof LoginInput>) => {
		const raw = JSON.stringify({ ...this.CONFIG, filter: { email: loginInput.email } });
		const requestOptions = {
			method: 'POST',
			headers: this.myHeaders,
			body: raw
		};

		try {
			const response = await fetch(`${MONGODB_API_URI}/action/findOne`, requestOptions);
			const user: z.infer<typeof UserHashed> = UserHashed.parse(
				(await response.json())['document']
			);
			if (user && (await this.hasher.compare(loginInput.password, user.password))) {
				return { user, error: null };
			}
		} catch (error) {
			console.log(error);
		}

		return { user: null, error: 'Invalid credentials' };
	};

	getUserById = async (id: string) => {
		const raw = JSON.stringify({ ...this.CONFIG, filter: { id: id } });
		const requestOptions = {
			method: 'POST',
			headers: this.myHeaders,
			body: raw
		};

		try {
			const response = await fetch(`${MONGODB_API_URI}/action/findOne`, requestOptions);
			const user: z.infer<typeof UserHashed> = UserHashed.parse(
				(await response.json())['document']
			);
			if (user) {
				return { user, error: null };
			}
		} catch (error) {
			console.log(error);
		}

		return { user: null, error: 'User not found' };
	};
}

interface PasswordHasher {
	hash: (password: string) => Promise<string>;
	compare: (password: string, hash: string) => Promise<boolean>;
}

class BCryptPasswordHasher implements PasswordHasher {
	private saltRounds: number;

	constructor(saltRounds = 10) {
		this.saltRounds = saltRounds;
	}

	hash = async (password: string) => {
		return await bcrypt.hash(password, this.saltRounds);
	};

	compare = async (password: string, hash: string) => {
		return await bcrypt.compare(password, hash);
	};
}

export { BCryptPasswordHasher };
export type { PasswordHasher };
export default Authentication;
