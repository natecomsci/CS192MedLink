<script>
  import Logo from '$lib/assets/Logo.png';

  import SignInBox from './SignInBox.svelte';

  let id;
  let password;
  let show;

  function checkCredentials() {
    console.log("Checking Credentials")
  }

</script>

<nav>
  <a href="/">Landing Page</a>
  <a href="/dashboard">Dashboard</a>
</nav>

<img src={Logo} alt="The project logo" />

<h1 class="text-3xl font-bold underline">
  MedLink
</h1>

<SignInBox 
  bind:id
  bind:password
  bind:show
/>

<p>id = {id}, password = {password}, showPassword = {show}, sign in clicked = </p>

<!-- @paul, @elle padesign-->
<style>
  @reference "tailwindcss/theme";
  :global(html) {
    background-color: theme(--color-gray-100);
  }

  h1 {
    display: flex; /* or grid */
    justify-content: center;
    align-items: center;
  }

</style>
