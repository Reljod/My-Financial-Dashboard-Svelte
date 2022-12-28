import { NODE_ENV } from '$env/static/private';

export const sessionConfig = {
	default: {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 5, // 5 minutes
		secure: NODE_ENV === 'production'
	}
};
