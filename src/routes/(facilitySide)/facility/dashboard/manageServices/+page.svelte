<script lang="ts">
    import type { ServiceDTO } from "$lib/server/DTOs";
  import type { PageProps } from "./$types";

  let { data, form }: PageProps = $props();
  const services: ServiceDTO[] = data.servicesObj ?? []

  import { specializedServiceType } from "$lib/projectArrays";
    import { serviceNameToUIName } from "$lib/Mappings";

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

  let servicess = Array(10).fill({ title: "ICU Information", division: "Emergency Division" });
  import Logo from '$lib/images/Logo.png';
  let hospitalName = 'Allied Care Experts Medical Center–Baypointe, Inc.';
  let search = "";
</script>



<!-- Header -->
<!-- <header class="flex items-center justify-between sticky p-5 bg-gray-50  "> -->
  <header class="flex items-center justify-between p-3 border  border-transparent top-0 duration-200 sticky z-[10] px-6 bg-white ">
    <!-- Back Icon -->
  <div class="items-center flex gap-5">
    <a href="../dashboard">
      <img
        src="/back_icon.svg"
        alt="Back"
        class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"
      />
    </a>

    <!-- Manage Services -->
    <h2 class="font-bold text-[27px] text-[#3D1853]">Manage Services</h2>
  </div>

  <!-- Medlink Logo -->
  <div class="flex items-center">
      <img src={Logo} alt="MedLink logo" class="w-10 h-13" />
      <h1 class="px-3 font-['DM_Sans'] text-[30px] leading-[40px] tracking-[-0.03em] font-black text-[#3D1853] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">Med<span class="text-[#9044C4]">Link</span></h1>
  </div>
</header>


<div class="p-6 bg-gray-50 max-h-screen border">
        <!-- View and Search -->
    <div class="w-2/3 flex items-center gap-10">
      <input
        type="text"
        placeholder="Search"
        class="px-4 py-0 border-2 w-3/4 border-gray-500 rounded-2xl h-10 w-2/3"
      />
      <h1>View By:</h1>

      <select class="px-4 py-0 border-2 border-gray-500 rounded-2xl h-10">
        <option>Default</option>
      </select>
    </div>

    <!-- Scrollable List Container -->
    <div class="space-y-3 mt-4 w-2/3 border  h-[calc(100vh-300px)] overflow-y-auto pr-8 pt-5">
      {#each servicess as service}
        <div class="flex items-center justify-between p-3 bg-white rounded-[30px] shadow-[0px_4px_10px_rgba(0,0,0,0.3)] w-full">
          <!-- Left Side: Text Content -->
          <div>
            <h3 class="text-lg font-bold text-gray-900 px-4">{service.title}</h3>
            <p class="text-purple-600 px-4">{service.division}</p>
          </div>
        
          <!-- Right Side: Icons -->
          <div class="flex items-center space-x-4 pr-4">
            <img src="/edit_icon.svg" alt="Edit" class="w-6 h-6 cursor-pointer hover:opacity-80" />
            <img src="/trash_icon.svg" alt="Delete" class="w-6 h-6 cursor-pointer hover:opacity-80" />
          </div>
        </div>
      {/each}
    </div>

    <div class="flex items-center justify-center gap-4 mt-4 w-2/3">
      <button class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">⟨ Previous</button>
      <span class="font-medium">Page 1 of 22</span>
      <button class="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Next ⟩</button>
    </div>

  <button class="fixed bottom-6 right-6 bg-purple-500 text-white px-6 py-3 rounded-full flex items-center space-x-2 shadow-lg">
    <span class="text-xl">+</span>
    <a href="./manageServices/addService">Add service</a>
  </button>
</div>

<style>
::-webkit-scrollbar {
  width: 8px !important;
}

::-webkit-scrollbar-thumb {
  background: #a855f7 !important;
  border-radius: 10px !important;
}

::-webkit-scrollbar-track {
  background: #f3f4f6 !important;
  border-radius: 10px !important;
}

::-webkit-scrollbar-thumb:hover {
  background: #9333ea !important;
}

</style>
