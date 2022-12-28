import type { Session } from '$lib/types/auth/session';
import type { Redis } from 'ioredis';
import type { z } from 'zod';
import type { SessionHandler } from '..';

export class RedisSessionHandler implements SessionHandler {
	private redis: Redis;

	constructor(redis: Redis) {
		this.redis = redis;
	}

	createNewSession = async (session: z.infer<typeof Session>) => {
		const { sessionToken, ...rest } = session;
		const result = await this.redis.set(sessionToken, JSON.stringify(rest));
		return result;
	};

	getSession = async (sessionToken: string) => {
		const session = await this.redis.get(sessionToken);
		if (!session) return null;
		return JSON.parse(session);
	};

	deleteSession = async (sessionToken: string) => {
		const result = await this.redis.del(sessionToken);
		return result;
	};
}
