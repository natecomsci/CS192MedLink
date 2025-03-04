<script lang="ts">
  import type { PageProps } from "./$types";

  let { data, form }: PageProps = $props();
</script>

<h1 class="text-3xl font-bold underline">
  Edit Service
</h1>


<a href="./manageServices/addService">Add service</a>

<div class="bg-white shadow-lg rounded-lg p-8">
  <div class="mt-4">
    {#each services as { type, serviceID }}
      <div class="py-2 border-b border-transparent">
        <p class="font-bold">{type} Information</p>
        <a href={'./manageServices/editService'+serviceID}>
          edit
        </a>

        <button>
          delete
        </button>
      </div>
    {/each}
  </div>
</div>