<script>
  let { children } = $props();
  import "../../app.css";
</script>

<main class="space-y-8 bg-teal-100">
    {@render children()}
</main>


<!-- add repeating elements for all  pages here -->

<!-- like when there is a navigation bar for all pages, you can add here then include <slot /> to render rest of page-->