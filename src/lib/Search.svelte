<!-- Nested.svelte -->
<script lang="ts">
	let { guest = true } = $props();
</script>

<h1>{guest ? "in guest mode" : "in signed in mode"}</h1>