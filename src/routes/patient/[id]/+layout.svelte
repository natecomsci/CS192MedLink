<script lang='ts'>
  import "../../app.css";

  import type { PageProps } from './$types';

  let { children } = $props();

</script>

{@render children()}

<!-- add repeating elements for all  pages here -->

<!-- like when there is a navigation bar for all pages, you can add here then include <slot /> to render rest of page-->


