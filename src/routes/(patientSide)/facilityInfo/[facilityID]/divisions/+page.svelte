<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let results = $state(data.results);
  let hasMore = $state(data.hasMore);
  let totalResults = data.totalResults;
  let totalFetched = $state(data.totalFetched);
  let query = $state("");
</script>