<script lang="ts">
  import Logo from '$lib/images/Logo.png';
  import type { PageProps } from './$types';
  import { enhance } from '$app/forms';



  let showFilter = $state(false);
  let { data, form }: PageProps = $props();

  // Enums for filters
  const Provider = [
    'INTELLICARE',
    'ASIACARE',
    'AVEGA',
    'CAREWELL',
    'one_COOPHEALTH',
    'DYNAMIC_CARE_CORPORATION',
    'EASTWEST_HEALTHCARE',
    'FORTICARE',
    'GETWELL',
    'HC_and_D',
    'HEALTHFIRST',
    'HMI',
    'HPPI',
    'IWC',
    'ICARE',
    'KAISER',
    'LIFE_and_HEALTH',
    'MAXICARE',
    'MEDICARD',
    'MEDICARE',
    'MEDOCARE',
    'METROCARE',
    'OMHSI',
    'PACIFIC_CROSS',
    'PHILHEALTH',
    'VALUCARE',
    'WELLCARE'
  ];

  const FacilityType = [
    'BARANGAY_HEALTH_CENTER',
    'CLINIC',
    'HEALTH_CENTER',
    'HOSPITAL',
    'INFIRMARY',
    'POLYCLINIC',
    'PRIMARY_CARE_CLINIC',
    'CARDIOLOGY_CLINIC',
    'DENTAL_CLINIC',
    'DERMATOLOGY_CLINIC',
    'ENDOCRINOLOGY_CLINIC',
    'ENT_CLINIC',
    'FERTILITY_CLINIC',
    'GASTROENTEROLOGY_CLINIC',
    'IMMUNOLOGY_CENTER',
    'INFECTIOUS_DISEASE_CENTER',
    'MATERNITY_CENTER',
    'NEPHROLOGY_CLINIC',
    'NEUROLOGY_CLINIC',
    'ONCOLOGY_CENTER',
    'OPHTHALMOLOGY_CLINIC',
    'ORTHOPEDIC_CLINIC',
    'PEDIATRIC_CLINIC',
    'PULMONOLOGY_CLINIC',
    'RHEUMATOLOGY_CLINIC',
    'UROLOGY_CLINIC',
    'DIAGNOSTIC_LAB',
    'GENETIC_TESTING_LAB',
    'PATHOLOGY_LAB',
    'RADIOLOGY_CENTER',
    'BURN_CENTER',
    'CRITICAL_CARE_CENTER',
    'EMERGENCY_CENTER',
    'POISON_CONTROL_CENTER',
    'TRAUMA_CENTER',
    'URGENT_CARE_CENTER',
    'BLOOD_BANK',
    'DIALYSIS_CENTER',
    'MENTAL_HEALTH_FACILITY',
    'PAIN_MANAGEMENT_CLINIC',
    'REHABILITATION_CENTER',
    'SLEEP_CENTER',
    'SUBSTANCE_ABUSE_CENTER',
    'TRANSPLANT_CENTER',
    'ALTERNATIVE_MEDICINE_CENTER',
    'HERBAL_MEDICINE_CENTER',
    'PHYSICAL_THERAPY_CENTER',
    'AMBULATORY_CARE_CENTER',
    'SURGICAL_CENTER',
    'AMBULANCE_SERVICE'
  ];

  const Ownership = [
    'PUBLIC',
    'PRIVATE'
  ];

    // Filters
  let selectedProvider: string = $state("");
  let selectedFacilityType: string = $state("");
  let selectedOwnership: string =  $state("");
  let selectedProviders: string[] = [];

    // Action to remove all filters
    const removeFilters = () => {
    selectedProvider = "";
    selectedFacilityType = "";
    selectedOwnership = "";
  };
</script>

<form 
  class="" 
  method="POST"
  action="?/search"
  use:enhance
>

<div class="min-h-screen bg-[#AE72DA] flex flex-col items-center justify-start relative">
  <div class="absolute top-20 left-1/2 transform -translate-x-1/2 justify-items-center">
    <img src={Logo} alt="MedLink logo" width="150" height="150" />
  </div>

  <div class="w-full bg-white rounded-t-3xl shadow-lg mt-50 p-6 flex flex-col items-center flex-grow">
    <h1 class="mt-15 mb-5 font-['DM_Sans'] text-[60px] leading-[40px] tracking-[-0.03em] font-black text-[#3D1853] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
      Med<span class="text-[#9044C4]">Link</span>
    </h1>
    <p class="text-gray-500 text-center mt-2 mb-5">Connecting you to healthcare,<br>one search at a time.</p>

    <div class="flex w-1/2 items-center gap-x-2">
      <!-- Search Bar Section -->
      <div class="relative flex items-center gap-2 pl-2 rounded-full border border-gray-300 bg-white shadow-sm flex-grow">
        <input
          type="text"
          name="query"
          value=""
          placeholder="Search for Services"
          class="flex-1 p-2 text-gray-700 bg-transparent outline-none appearance-none"
        />
        <button type="submit" class="p-2 text-gray-500">
          <img src="/search_icon.svg" alt="Search" class="w-6 h-6" />
        </button>
      </div>

      <!-- Filter Button -->
      <button 
        type="button"
        class="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-purple-800 text-white rounded-full"
        onclick={() => showFilter = !showFilter}
      >
        <img src="/filter_icon.svg" alt="Filter" class="w-5 h-5" />
      </button>
    </div>

    <!-- </div> -->
    {#if form?.error}
      <p class="text-red-600 mt-2">{form.error}</p>
    {/if}

    <div class="grid grid-cols-2 gap-4 p-6 w-full max-w-md">
      <a href="/search/Ambulance" class="flex flex-col items-center justify-center bg-white border border-[#9E8BA9] rounded-xl shadow-md p-4 hover:shadow-lg transition">
        <img src="/ambulance_icon.svg" alt="Ambulance Icon" class="w-8 h-8 mb-2" />
        <span class="text-sm font-medium text-[#5B2F74]">Ambulance</span>
      </a>

      <a href="/search/Blood%20Bank" class="flex flex-col items-center justify-center bg-white border border-[#9E8BA9] rounded-xl shadow-md p-4 hover:shadow-lg transition">
        <img src="bloodbank_icon.svg" alt="Blood Bank Icon" class="w-8 h-8 mb-2" />
        <span class="text-sm font-medium text-[#5B2F74]">Blood Bank</span>
      </a>

      <a href="/search/Intensive%20Care%20Unit" class="flex flex-col items-center justify-center bg-white border border-[#9E8BA9] rounded-xl shadow-md p-4 hover:shadow-lg transition">
        <img src="ICU_icon.svg" alt="ICU Icon" class="w-8 h-8 mb-2" />
        <span class="text-sm font-medium text-[#5B2F74]">ICU</span>
      </a>

      <a href="/search/Emergency%20Room" class="flex flex-col items-center justify-center bg-white border border-[#9E8BA9] rounded-xl shadow-md p-4 hover:shadow-lg transition">
        <img src="ER_icon.svg" alt="ER Icon" class="w-8 h-8 mb-2" />
        <span class="text-sm font-medium text-[#5B2F74]">ER</span>
      </a>
    </div>
    
    {#if showFilter}
<!-- Ownership selection (Dropdown) -->
<div class="mt-4">
  <label for="ownership">Ownership:</label>
  <select id="ownership" name="selectedOwnership" bind:value={selectedOwnership} class="border p-2 rounded w-full">
    <option value="">Any</option> <!-- Default placeholder when no filter selected -->
    {#each Ownership as ownership}
      <option value={ownership}>{ownership}</option>
    {/each}
  </select>
</div>

<!-- Provider selection (Dropdown) -->
<div class="mt-4">
  <label for="provider">Provider:</label>
  <select name="selectedProvider" id="provider" bind:value={selectedProvider} class="border p-2 rounded w-full">
    <option value=""> Any </option> <!-- Default placeholder when no filter selected -->
    {#each Provider as provider}
      <option value={provider}>{provider}</option>
    {/each}
  </select>
</div>

<!-- Facility Type selection (Dropdown) -->
<div class="mt-4">
  <label for="facilityType">Facility Type:</label>
  <select name="selectedFacilityType" id="facilityType" bind:value={selectedFacilityType} class="border p-2 rounded w-full">
    <option value=""> Any </option> <!-- Default placeholder when no filter selected -->
    {#each FacilityType as facilityType}
      <option value={facilityType}>{facilityType}</option>
    {/each}
  </select>
</div>
    <!-- Additional filters like booking system, etc. can go here. -->

        <!-- Remove Filters Button -->
        <div class="mt-4">
          <button onclick={removeFilters} class="bg-red-500 text-white p-2 rounded hover:bg-red-700">
            Remove Filters
          </button>
        </div>
  
    {/if}
  </div>
</div>
</form>



