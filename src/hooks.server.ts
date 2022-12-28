import redis from '$lib/redis';
import type { SessionHandler } from '$lib/server/db';
import Authentication, { BCryptPasswordHasher } from '$lib/server/db/mongodb/auth';
import { RedisSessionHandler } from '$lib/server/db/redis/session';

const passwordHasher = new BCryptPasswordHasher();
const sessionHandler: SessionHandler = new RedisSessionHandler(redis);
const authentication = new Authentication(passwordHasher);

export const handle = async ({ event, resolve }) => {
	const resetAndRedirect = () => {
		event.locals.sessionId = '';
		event.locals.user = null;
	};

	const sessionId = event.cookies.get('sessionid');
	if (!sessionId) {
		resetAndRedirect();
	}

	console.log('sessionId', sessionId);

	event.locals.sessionId = sessionId;

	const session = await sessionHandler.getSession(sessionId);
	console.log('session', session);

	const isExpired = new Date(session?.expires as string) < new Date();
	console.log('isexpired', isExpired);
	if (session && !isExpired) {
		const userId = session.userId;
		const response = await authentication.getUserById(userId);

		if (!response.error) {
			console.log('user session', response.user);
			event.locals.user = response.user;
		} else {
			resetAndRedirect();
		}
	} else {
		try {
			await sessionHandler.deleteSession(sessionId);
		} catch (error) {
			console.error(error);
		}
		resetAndRedirect();
	}

	const response = await resolve(event);

	return response;
};
