<script lang="ts">
	import type { RegisterInput } from '$lib/types/auth/user';
	import type { z } from 'zod';

	type RegisterInputType = z.infer<typeof RegisterInput>;

	let data: RegisterInputType = {
		firstName: '',
		lastName: '',
		email: '',
		password: ''
	};

	$: isEnableSubmit = data.firstName && data.lastName && data.email && data.password;
	$: isEnableReset = !!data.firstName || !!data.lastName || !!data.email || !!data.password;

	const onReset = () => {
		data.firstName = '';
		data.lastName = '';
		data.email = '';
		data.password = '';
	};
</script>

<div class="w-screen h-screen flex justify-center">
	<div class="relative w-[500px] rounded-lg z-50 px-6 pt-12 pb-8">
		<h1 class="text-3xl font-bold">Register</h1>
		<form method="POST">
			<div class="form-control w-full py-6">
				<div class="flex-grow">
					<label for="first-name" class="label">
						<span class="label-text">First Name</span>
					</label>
					<input
						name="firstName"
						id="first-name"
						type="text"
						class="input input-bordered w-full"
						bind:value={data.firstName}
					/>
				</div>
				<div class="flex-grow">
					<label for="last-name" class="label">
						<span class="label-text">Last Name</span>
					</label>
					<input
						name="lastName"
						id="last-name"
						type="text"
						class="input input-bordered w-full"
						bind:value={data.lastName}
					/>
				</div>
				<div class="flex-grow">
					<label for="email" class="label">
						<span class="label-text">Email</span>
					</label>
					<input
						name="email"
						id="email"
						type="text"
						class="input input-bordered w-full"
						bind:value={data.email}
					/>
				</div>
				<div class="flex-grow">
					<label for="password" class="label">
						<span class="label-text">Password</span>
					</label>
					<input
						name="password"
						id="password"
						type="password"
						class="input input-bordered w-full"
						bind:value={data.password}
					/>
				</div>
				<div class="flex w-full gap-2 my-4">
					<button class="btn btn-primary flex-1" type="submit" disabled={!isEnableSubmit}
						>Submit</button
					>
					<button
						class="btn btn-outline btn-secondary flex-1"
						type="button"
						disabled={!isEnableReset}
						on:click={onReset}>Reset</button
					>
				</div>
			</div>
		</form>
	</div>
</div>
