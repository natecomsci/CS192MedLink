<script>
  import Logo from '$lib/images/Logo.png';

  import SignInBox from './SignInBox.svelte';

  let id;
  let password;

  function checkCredentials() {
    console.log("Checking Credentials")
  }

</script>

<nav>
  <a href="/">Landing Page</a>
  <a href="/facility">Facility</a>
  <a href="/facility/dashboard">Dashboard</a>

</nav>
<h1 class="text-3xl font-bold underline">
  Facility Landing Page
</h1>
<article class="flex h-screen items-center justify-center">
  <div>
    <img src={Logo} alt="The project logo" width="100" height="100"/>

    <h1 class="text-3xl font-bold underline">
      MedLink
    </h1>
  
    <SignInBox 
      bind:id
      bind:password
    />
  </div>
</article>


<p>id = {id}, password = {password}, sign in clicked = </p>

<!-- @paul, @elle padesign-->
<style>
  @reference "tailwindcss/theme";
  :global(html) {
    background-color: theme(--color-gray-100);
  }

</style>
