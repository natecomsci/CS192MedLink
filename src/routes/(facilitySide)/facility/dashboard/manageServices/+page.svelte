<script lang="ts">
  import type { ServiceDTO } from "$lib/server/DTOs";
  import type { PageProps } from "./$types";

  let { data, form }: PageProps = $props();
  const services: ServiceDTO[] = data.servicesObj ?? []

  import { specializedServiceType } from "$lib/projectArrays";

  function serviceTypeURL(type: string): String {
    if (!specializedServiceType.includes(type)) {
      return "editOPService"
    } else if (type == "Ambulance") {
      return "editAmbulanceService"
    } else if (type == "Blood Bank") {
      return "editBloodBankService"
    } else if (type == "Emergency Room") {
      return "editERService"
    } else {
      return "editICUService"
    }
  }
</script>

<h1 class="text-3xl font-bold underline">
  Manage Services
</h1>


<a href="./manageServices/addService">Add service</a>

<div class="bg-white shadow-lg rounded-lg p-8">
  <div class="mt-4">
    {#each services as { type, serviceID }}
      <div class="py-2 border-b border-transparent">
        <p class="font-bold">{type} Information</p>
        <a href={'./manageServices/' + serviceTypeURL(type) + '/' +serviceID}>
          edit
        </a>

        <button>
          delete
        </button>
      </div>
    {/each}
  </div>
</div>