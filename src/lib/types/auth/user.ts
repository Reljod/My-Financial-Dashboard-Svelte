import { z } from 'zod';

const FirstName = z.string().min(1).max(50);
const LastName = z.string().min(1).max(50);
const Email = z.string().email().max(50);
const Password = z.string().min(8).max(50);

const User = z.object({
	id: z.string().cuid(),
	firstName: FirstName,
	lastName: LastName,
	email: Email,
	password: Password,
	createdAt: z.string(),
	updatedAt: z.string()
});

const UserHashed = User.extend({
	password: z.string()
});

const LoginInput = z.object({
	email: z.string().email(),
	password: z.string()
});

const RegisterInput = z.object({
	firstName: FirstName,
	lastName: LastName,
	email: Email,
	password: Password
});

type UserHashedType = z.infer<typeof UserHashed>;

export { LoginInput, RegisterInput, FirstName, LastName, Email, Password, UserHashed };
export type { UserHashedType };
export default User;
