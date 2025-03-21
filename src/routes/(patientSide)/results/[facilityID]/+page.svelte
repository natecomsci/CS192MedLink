<script lang="ts">
    import type { POrCDTO, COrMDTO, BrgyDTO } from '$lib/server/DTOs';
    import type { PageProps } from './$types';
  
    import { facilityType, providers } from '$lib/projectArrays';
    import type { Provider } from '@prisma/client';
  
    let { data, form }: PageProps = $props();
  
    let provinceList: POrCDTO[] = $state(data.provinces ?? []);
    let cityList: COrMDTO[] = $state(data.corms ?? []);
    let barangayList: BrgyDTO[] = $state(data.brgys ?? []);
  
    let regionID: String = $state(String(data.regionID) ?? '');
    let provinceID: String = $state(String(data.provinceID) ?? '');
    let cityID: String = $state(String(data.cityID) ?? '');
    let barangayID: String = $state(String(data.barangayID) ?? '');
    let street = $state(data.street ?? '');
  
    let selectedOwnership = $state(data.ownership);
    let selectedType = $state(data.type);
  
    let facilityName = $state(data.facilityName);
    let photo = $state(data.photo);
    let email = $state(data.email);
    let contactNumber = $state(data.contactNumber);
    let bookingSystem = $state(data.bookingSystem ?? '');
    let acceptedProviders: Provider[] = $state(data.providers ?? []);
  
    let enableCities = $state(true);
    let enableBarangays = $state(true);
    let enableStreet = $state(true);
  </script>
  
  <div class="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <div class="flex items-center space-x-4">
      <img src="{photo}" alt="Facility" class="w-24 h-24 rounded-lg object-cover border" />
  
      <div>
        <h1 class="text-2xl font-bold">{facilityName}</h1>
        <p class="text-gray-600">{selectedType} - {selectedOwnership}</p>
      </div>
    </div>
  
    <div class="mt-4">
      <h2 class="text-xl font-semibold">Contact Information</h2>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Phone:</strong> {contactNumber}</p>
    </div>
  
    <div class="mt-4">
      <h2 class="text-xl font-semibold">Location</h2>
      <p><strong>Street:</strong> {street}</p>
      <p><strong>Barangay:</strong> {barangayID}</p>
      <p><strong>City/Municipality:</strong> {cityID}</p>
      <p><strong>Province:</strong> {provinceID}</p>
      <p><strong>Region:</strong> {regionID}</p>
    </div>
  
    {#if bookingSystem}
      <div class="mt-4">
        <h2 class="text-xl font-semibold">Booking System</h2>
        <p>{bookingSystem}</p>
      </div>
    {/if}
  
    {#if acceptedProviders.length > 0}
      <div class="mt-4">
        <h2 class="text-xl font-semibold">Accepted Providers</h2>
        <ul class="list-disc pl-5">
          {#each acceptedProviders as provider}
            <li>{provider}</li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>

  <form method="POST" action="?/viewServices" class="mt-6">
    <button type="submit" class="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-blue-7500">
         Services Offered
    </button>
</form>

<form method="POST" action="?/viewServices" class="mt-6">
  <button type="submit" class="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-blue-7500">
       Divisions 
  </button>
</form>

  