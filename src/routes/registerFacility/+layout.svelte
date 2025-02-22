<!-- src/routes/registerFacility/+layout.svelte -->
<script>
  export let title = "Register Facility";
</script>

<main>
  <h1>{title}</h1>
  <slot />
</main>

<style>
  main {
    max-width: 500px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    background: white;
  }

  h1 {
    text-align: center;
  }
</style>
