<script lang="ts">
  import Search from '$lib/Search.svelte'
  import Header from '$lib/Header.svelte'

  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<Header guest={false} id={data.id} />

<nav>
  <a href="/">Landing Page</a>
  <a href="/patient/1">Patient 1</a>

</nav>

<h1  class='text-3xl font-bold underline'>User ID: {data.id} Page</h1>

<Search guest={false}/>