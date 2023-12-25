<script lang="ts">
    let username: string = "";
    let password: string = "";

    function handleLogin() {

    }
</script>

<div class="container">
    <div class="login-container">
        <form on:submit|preventDefault={handleLogin}>
            <h2>Login</h2>
            <div class="input-container">
                <label for="username">Username</label>
                <input type="text" id="username" bind:value={username} />
            </div>
            <div class="input-container">
                <label for="password">Password</label>
                <input type="password" id="password" bind:value={password} />
            </div>
            <button type="submit">Login</button>
        </form>
    </div>
</div>

<style>

</style>