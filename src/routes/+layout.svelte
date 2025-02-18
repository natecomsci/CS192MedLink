<!-- Used for showing  -->

<script lang="ts">
  let { children } = $props();
  import "./app.css";

  import DebugRouting from './DebugRouting.svelte'

  let debugMode: Boolean = true;
</script>

{#if debugMode}
  <DebugRouting />
{/if}

{@render children()}