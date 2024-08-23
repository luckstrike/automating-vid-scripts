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

<div class="container">
	<h1 class="welcome-title">Howdy there, welcome to VidScripts</h1>
	<h2 class="welcome-title">{signUp ? 'Sign Up' : 'Log In'}</h2>
	<button class="google-login" on:click={handleGoogleSignIn}>
		<DeviconGoogle style="font-size: 1.5em"></DeviconGoogle>
		Continue with Google
	</button>
	<form>
		<input bind:value={email} class="info-input" type="text" placeholder="Email" />
		<input bind:value={password} class="info-input" type="password" placeholder="Password" />

		{#if signUp}
			<input
				bind:value={confirmPassword}
				class="info-input"
				type="password"
				placeholder="Confirm Password"
			/>
		{/if}

		<button on:click|preventDefault={handleSubmit} class="action" type="submit">
			{#if signUp}
				Sign Up
			{:else}
				Log In
			{/if}
		</button>

		{#if signUp}
			Already have an account?
			<button
				class="switch-mode"
				on:click={() => {
					signUp = false;
				}}
			>
				<p class="switch-text">Log In</p>
			</button>
		{:else}
			Or Login With...
			<div>Don't have an account?</div>
			<button
				class="switch-mode"
				on:click={() => {
					signUp = true;
				}}
			>
				<p class="switch-text">Sign Up</p>
			</button>
		{/if}
	</form>
</div>

<style>
	.welcome-title {
		color: #fff;
	}

	.container {
		display: flex;
		flex-direction: column;
		flex: 0 0 100%;
		height: 100vh;
		justify-content: center;
		align-items: center;
	}

	.container form {
		display: flex;
		flex-direction: column;
		flex: 1;
		text-align: center;
	}

	.switch-mode {
		border: none;
		cursor: pointer;
		color: #0070f3;
		background-color: transparent;
		padding: 0;
		margin: 0;
	}

	.info-input {
		border: none;
		border-radius: 10px;
		width: 300px;
		height: 40px;
		margin: 5px;
	}

	.action {
		border: none;
		border-radius: 10px;
		width: 300px;
		height: 40px;
		margin: 5px;
		background-color: #0070f3;
	}

	.switch-text {
		text-decoration: none;
		color: #0070f3;
	}

	.google-login {
		background-color: #0070f3;
		border-radius: 10px;
		border: none;
		padding: 5px;
		flex-direction: column;
		width: 25%;
		text-align: center;
	}
</style>
