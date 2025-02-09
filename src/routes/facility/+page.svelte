<script>
  import Logo from '$lib/images/Logo.png';

  import SignInBox from './SignInBox.svelte';

  let fid = $state('');
  let password = $state('');

  function checkCredentials() {
    console.log("Checking Credentials")
  }

</script>

<!-- @elle, @paul: padesign -->
<article class="grid grid-cols-1 justify-items-center p-8">
  <div class="grid grid-cols-1 justify-items-center">
    <img 
      src={Logo} 
      alt="MedLink logo" 
      width="100" 
      height="100"/>

    <h1 class="text-3xl font-bold underline">
      MedLink
    </h1>
  </div>
  <div>
    <SignInBox 
      bind:fid
      bind:password
    />
  </div>
</article>

<!-- temp for functionality -->
<!-- <p>id = {fid}, password = {password}, sign in clicked = </p> -->
