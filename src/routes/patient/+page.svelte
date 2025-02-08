<script>
  import Search from '$lib/Search.svelte'
  import Header from '$lib/Header.svelte'
</script>

<Header />

<nav>
  <a href="/">Landing Page</a>
  <a href="/patient/1">Patient 1</a>

</nav>

<h1 class='text-3xl font-bold underline'>Patient: Landing Page, guest search</h1>



<Search />