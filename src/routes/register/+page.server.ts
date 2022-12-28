import Authentication, { BCryptPasswordHasher } from '$lib/server/db/mongodb/auth';
import { RegisterInput } from '$lib/types/auth/user';
import { redirect } from '@sveltejs/kit';
import cuid from 'cuid';
import type { Actions } from '../$types';

const passwordHasher = new BCryptPasswordHasher();
const authentication = new Authentication(passwordHasher);

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const firstName = formData.get('firstName');
		const lastName = formData.get('lastName');
		const email = formData.get('email');
		const password = formData.get('password');

		try {
			const registerInput = RegisterInput.parse({
				firstName,
				lastName,
				email,
				password
			});
			const user = {
				...registerInput,
				id: cuid(),
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			};

			authentication.register(user);
		} catch (error) {
			console.error(error);
			throw redirect(303, '/register');
		}

		throw redirect(303, '/');
	}
};
