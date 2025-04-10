  <script lang="ts">
    import type { ServiceResultsDTO } from '$lib';
    
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


    let { data, form } = $props();

    const patientSearchPageSize = data.patientSearchPageSize ?? 5;

    let services: ServiceResultsDTO[] = $state(data.services ?? [])

    let currOffset: number = $state(5)
    let hasMore: boolean = $state(data.moreServices ?? false)
  
    // Filters
  let selectedProvider: string = $state(data.selectedProvider ?? "any" );
  let selectedFacilityType: string = $state(data.selectedFacilityType ?? "any");
  let selectedOwnership: string =  $state(data.selectedOwnership ?? "any");
  let selectedProviders: string[] = [];




    async function loadMode(query: string) {
      if (!hasMore) {
        return
      } 
      const body = JSON.stringify({currOffset, query});

      try {
        const response = await fetch("./loadMoreHandler", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        });

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const rv = await response.json();
        services = [...services, ...rv.results];
        currOffset = currOffset + patientSearchPageSize;
        hasMore = rv.hasMore;
        
      } catch (error) {
        throw new Error(`Response status: ${error}`);
      }
    }

  </script>

<div class="max-w-md mx-auto p-4 bg-[#FDFCFD]">
  <form 
    method="POST"
    action="?/search"
    class="items-center space-x-2"
  >
    <div class="flex items-center gap-2 p-2 rounded-full border border-gray-300 bg-white shadow-sm w-full">
      <a href="/" class="pl-4 text-gray-500">
        ←
      </a>
      <input
        type="text"
        name="query"
        value={data.query}
        placeholder="Search services..."
        class="flex-1 p-2 text-gray-700 bg-transparent outline-none"
      />
      <button type="submit" class="p-2 text-gray-500">
        <img src="/search_icon.svg" alt="Search" class="w-6 h-6" />
      </button>
    </div>




    <!-- Additional filters like booking system, etc. can go here. -->


  </form>
  
  {#if form?.error}
    <p class="error">{form.error}</p>
  {/if}
  
  {#if services.length > 0}
    <div class="mt-3">
      {#each services as service}
        <div class="mb-3 flex justify-between items-center pl-4 pr-4 pt-3 pb-3 border border-gray-300 rounded-xl shadow-lg bg-white w-full">
          <div class="w-full">
            <div class="flex justify-between items-center">
              <p class="font-bold text-purple-900">{service.name}</p>
              <form method="POST" action="?/viewDetails">
                <input type="hidden" name="facilityID" value={service.facilityID} />
                <input type="hidden" name="serviceID" value={service.serviceID} />
                <input type="hidden" name="serviceType" value={service.type} />
                <button class="text-gray-700 hover:bg-gray-200 rounded-full transition">
                  <img src="/plus_icon.svg" alt="Add" class="w-5 h-5" />
                </button>
              </form>
            </div>
            <hr class="my-1 border-gray-300">
            <p class="italic text-sm text-gray-600">{service.type}</p>
          </div>
        </div>
      {/each}
    </div>
    {#if hasMore} 
      <div class="flex justify-center mt-4">
        <button 
          class="bg-[#9044C4] rounded-lg px-6 py-3 text-white font-semibold shadow-md hover:bg-gray-600 transition"
          onclick={() => loadMode(data.query ?? '')}>
          Load More
        </button>
      </div>
    {/if}
  {:else}
    <p>No services found.</p>
  {/if}
</div>


{#if data.error}
  <div class="text-red-600 font-semibold bg-red-100 p-4 rounded shadow-sm mb-4">
    ⚠️ {data.error}
  </div>
{/if}