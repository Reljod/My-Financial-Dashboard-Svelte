import { z } from 'zod';

const Session = z.object({
	id: z.string().cuid(),
	userId: z.string().cuid(),
	expires: z.string(),
	sessionToken: z.string()
});

export { Session };
