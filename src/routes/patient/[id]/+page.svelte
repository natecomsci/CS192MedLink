<script lang="ts">
  import Search from '$lib/Search.svelte'
  import Header from '$lib/Header.svelte'

  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<h1  class='text-3xl font-bold underline'>User ID: {data.id} Page</h1>

<Search guest={false}/>