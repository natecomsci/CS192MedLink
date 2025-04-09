<script lang="ts">
    import type { Provider } from '@prisma/client';
    import type { PageProps } from './$types';
  
    let { data, form }: PageProps = $props();
  
    let facilityAddress    = $state(data.fullAddress);

    let selectedOwnership = $state(data.ownership);
    let selectedType = $state(data.type);
  
    let facilityName = $state(data.facilityName);
    let photo = $state(data.photo);
    let email = $state(data.email);
    let contactNumber = $state(data.contactNumber);
    let bookingSystem = $state(data.bookingSystem ?? '');
    let acceptedProviders: Provider[] = $state(data.providers ?? []);
  
    let showPlans = false;

  </script>


<!-- ================================================================================================ -->
<div class=" max-w-md mx-auto bg-[#FDFCFD] h-[calc(100vh-100px)] flex flex-col">  
  <!-- Scrollable Content -->
  <div class="flex-1 overflow-y-auto bg-white rounded-t-3xl -mt-6 relative no-scrollbar">
    <!-- Image Container -->
    <div class="relative w-full">
      <img src="{photo}" alt="Hospital" class="w-full h-48 object-cover">

      <!-- Transparent Back Button (Overlay) -->
      <button class="absolute w-10 h-10 top-3 left-3 bg-white text-black rounded-full p-2 shadow-lg">
        ⬅
      </button>
    </div>
    <div class ="p-4">
      <h1 class="text-xl font-semibold text-gray-800">{facilityName}</h1>
      <p class="text-sm text-gray-600">{selectedType} - {selectedOwnership}</p>

      <hr class="my-2 border-gray-300">


      <!-- Location -->
      <div class="mt-4">
        <h2 class="text-purple-600 font-medium">Location</h2>


        <div class="relative mt-2">
          <img src="/map-placeholder.jpg" alt="Map" class="w-full h-45 object-cover rounded-lg mb-4">
          <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white font-bold text-sm rounded-lg">
            📍 View on Google Maps
          </div>
        </div>

        <!-- Address -->
        <p class="mt-2 text-sm text-gray-700"> 📍
          {@html facilityAddress 
            ?`${facilityAddress.street}<br>
                ${facilityAddress.barangay}, ${facilityAddress.city}<br>
                ${facilityAddress.province}, ${facilityAddress.region}`
            : "Address not available"}
        </p>
      </div>

      <!-- Contact Information -->
      <div class="mt-2">
        <h2 class="text-purple-600 font-medium">Contact Information</h2>
        <p class="text-sm text-gray-700">📧 <strong>Email:</strong> {email}</p>
        <p class="text-sm text-gray-700">📞 <strong>Phone:</strong> {contactNumber}</p>
      </div>

      <!-- Booking System -->
      {#if bookingSystem}
        <div class="mt-4">
          <h2 class="text-purple-600 font-medium">Booking System Link</h2>
          <p class="text-sm text-purple-700">🔗 {bookingSystem}</p>
        </div>
      {/if}

      <!-- Accepted Health Plans (Expandable) -->
      {#if acceptedProviders.length > 0}
        <hr class="my-4 border-gray-300">
        <div class="mt-2">
          <h2 class="w-full flex justify-between items-center text-purple-600 font-medium text-left">Accepted Providers</h2>
          <ul class="list-disc pl-5">
            {#each acceptedProviders as provider}
              <li class="mt-2 text-sm text-gray-700">{provider}</li>
            {/each}
          </ul>
        </div>
      {/if}

      <hr class="my-4 border-gray-300">

      <!-- What The Facility Offers -->
      <div class="">
        <h2 class="text-purple-600 font-medium">What The Facility Offers</h2>
        <form method="POST" action="?/viewServices" class="mt-2">
          <button type="submit" class="w-full flex justify-between items-center bg-gray-200 p-3 rounded-lg">
                Services
          </button>
        </form>

        {#if data.hasDivisions}
          <form method="POST" action="?/viewDivision" class="mt-2">
            <button type="submit" class="w-full flex justify-between items-center bg-gray-200 p-3 rounded-lg">
                Divisions 
            </button>
          </form>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;     /* Firefox */
  }
</style>
