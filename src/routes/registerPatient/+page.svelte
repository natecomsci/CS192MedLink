<!-- src/routes/registerFacility/+page.svelte -->
<script lang="ts">
  import { invalidate } from '$app/navigation';

  let hospital = '';
  let email = '';
  let password = '';
  let formError: string | null = null;

  async function registerFacility(event: SubmitEvent) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('hospital', hospital);
    formData.append('email', email);
    formData.append('password', password);

    const response = await fetch('/registerFacility', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      formError = await response.text();
    } else {
      await invalidate('/registerFacility'); // Refresh the page
      window.location.href = '/facility'; // Redirect to dashboard after success
    }
  }
</script>

<form on:submit={registerFacility}>
  {#if formError}
    <p class="error">{formError}</p>
  {/if}

  <label>
    Hospital Name:
    <input type="text" bind:value={hospital} required />
  </label>

  <label>
    Email:
    <input type="email" bind:value={email} required />
  </label>

  <label>
    Password:
    <input type="password" bind:value={password} required />
  </label>

  <button type="submit">Register</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  label {
    font-weight: bold;
  }

  input {
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
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
