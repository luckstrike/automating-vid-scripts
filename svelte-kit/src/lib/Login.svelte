<script lang="ts">
	import { authHandlers, authStore } from './stores/authStore';
	import DeviconGoogle from '~icons/devicon/google';

	// TODO: Add in Google Auth log in
	// You can probably have a button that says "Log in with Google"
	// which then calls the authHandlers.loginWithGoogle() function

	let signUp: boolean = false; // log in is the default mode

	let email: string = '';
	let password: string = '';
	let confirmPassword: string = '';

	async function handleSubmit() {
		if (!email || !password) {
			alert('Please enter an email and password');
			return;
		} else if (signUp && !confirmPassword) {
			alert('Please confirm your password');
			return;
		} else if (signUp && password !== confirmPassword) {
			alert('Passwords do not match, please make sure they are the same');
			return;
		}

		if (signUp && password === confirmPassword) {
			// Sign Up logic
			try {
				await authHandlers.signup(email, password);
			} catch (error) {
				console.log(error);
			}
		} else {
			// Log In logic
			try {
				await authHandlers.login(email, password);
			} catch (error) {
				console.log(error);
			}
		}

		if ($authStore.currentUser) {
			window.location.href = '/dashboard';
		}
		console.log('???:', $authStore.currentUser);
	}

	async function handleGoogleSignIn() {
		try {
			// Try logging in the user with Google
			await authHandlers.loginWithGoogle();

			// If the user is authenticated then redirect them to
			// the dashboard
			if ($authStore.currentUser) {
				window.location.href = '/dashboard';
			}
		} catch (error) {
			console.error('Google sign-in failed', error);
		}
	}
</script>

<div class="flex flex-col h-screen w-screen justify-center items-center">
	<div class="text-4xl font-bold text-white p-4">Howdy there, welcome to VidScripts</div>
	<div class="text-2xl text-white">{signUp ? 'Sign Up' : 'Log In'}</div>
	<button
		class="flex flex-row space-x-2 px-6 py-4 m-4 bg-white rounded-md items-center"
		on:click={handleGoogleSignIn}
	>
		<DeviconGoogle style="font-size: 1.5em"></DeviconGoogle>
		<div class="font-semibold">Continue with Google</div>
	</button>
	<form class="flex flex-col space-y-2 items-center w-full max-w-md">
		<input bind:value={email} class="p-2 rounded-lg w-full" type="text" placeholder="Email" />
		<input
			bind:value={password}
			class="p-2 rounded-lg w-full"
			type="password"
			placeholder="Password"
		/>

		{#if signUp}
			<input
				bind:value={confirmPassword}
				class="p-2 rounded-lg w-full"
				type="password"
				placeholder="Confirm Password"
			/>
		{/if}

		<button
			on:click|preventDefault={handleSubmit}
			class="bg-blue-600 text-white p-2 rounded-lg w-full"
			type="submit"
		>
			{#if signUp}
				Sign Up
			{:else}
				Log In
			{/if}
		</button>

		{#if signUp}
			<div class="flex flex-col items-center text-white">
				<button
					on:click={() => {
						signUp = false;
					}}
				>
					Log In
				</button>
			</div>
		{:else}
			<div class="flex flex-col text-center items-center text-white">
				<div>Don't have an account?</div>
				<button
					on:click={() => {
						signUp = true;
					}}
				>
					Sign Up
				</button>
			</div>
		{/if}
	</form>
</div>
