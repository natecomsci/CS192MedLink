<!-- src/routes/registerFacility/+page.svelte -->
<script lang="ts">
  import { fail } from '@sveltejs/kit';
  import { invalidate } from '$app/navigation';

  let name = '';
  let hospitalID = '';
  let password = '';
  let formError: string | null = null;
</script>

<form method="post">
  {#if formError}
    <p class="error">{formError}</p>
  {/if}

  <label>
    Hospital Name:
    <input type="text" bind:value={name} name="name" required />
  </label>

  <label>
    Hospital ID:
    <input type="text" bind:value={hospitalID} name="hospitalID" required />
  </label>

  <label>
    Password:
    <input type="password" bind:value={password} name="password" required />
  </label>

  <button type="submit">Register</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 400px;
    margin: auto;
  }

  label {
    font-weight: bold;
  }

  input {
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
  }

  .error {
    color: red;
    font-weight: bold;
  }

  button {
    background-color: #007bff;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }
</style>
