<script>
  import SignInBox from './SignInBox.svelte';
  let id;
  let password;
</script>

<!-- to add child to parent data passing
<Child SignInBox:id />
<Child SignInBox:password />
 -->

<nav>
  <a href="/">Landing Page</a>
  <a href="/dashboard">Dashboard</a>
</nav>


<h1 class="text-3xl font-bold underline">
  Landing Page
</h1>


<SignInBox />




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

