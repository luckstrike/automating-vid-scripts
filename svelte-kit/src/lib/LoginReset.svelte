<script lang='ts'>
	import { authHandlers, authStore } from "./stores/authStore";

    // TODO: Add in Google Auth log in
    // You can probably have a button that says "Log in with Google"
    // which then calls the authHandlers.loginWithGoogle() function

    let signUp: boolean = false; // log in is the default mode

    let action: string = '';
    let email: string = '';
    let newPass: string = '';
    let newEmail: string = '';
    let confirmPassword: string = '';

    async function handleSubmit() {
        if (!action) {
            return;
        }

        if (action === 'updatePass') {
            return await authHandlers.updatePassword(newPass);
        } else if (action === 'updateEmail') {
            return await authHandlers.updateEmail(newEmail);
        }
    }

</script>

<div class="container">
    <div>
        <button on:click={() => action = 'updateEmail'}>Update Email</button>
        <button on:click={() => action = 'updatePass'}>Update Password</button>
    </div>

    {#if action === 'updateEmail'}
        <form>
            <label>
                <input bind:value={newEmail} type="text" placeholder="New Email" />
            </label>
            
            <button on:click|preventDefault={handleSubmit} type="submit">Submit</button>
        </form>
    {/if}

    {#if action === 'updatePass'}
        <form>
            <label>
                <input bind:value={newPass} type="password" placeholder="New Password" />
            </label>
            <button on:click|preventDefault={handleSubmit} type="submit">Submit</button>
        </form>
    {/if}
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        flex: 0 0 100%;
        justify-content: center;
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
        font-size: 1rem;
        padding: 0;
        margin: 0;
    }
</style>