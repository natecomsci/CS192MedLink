<script lang="ts">
    import type { POrCDTO, COrMDTO, BrgyDTO } from '$lib/server/dtos';
    import type { PageProps } from './$types';
    import { enhance } from '$app/forms';

    import tempImage from "$lib/images/catle.jpg"
  
    let provinceList: POrCDTO[] = $state([]);
    let cityList: COrMDTO[] = $state([]);
    let barangayList: BrgyDTO[] = $state([]);
  
    let enableProvinces = $state(false);
    let enableCities = $state(false);
    let enableBarangays = $state(false);
    let enableStreet = $state(false);


    let { data, form }: PageProps = $props();

    let region: String = $state(data.region || 'Region');
    let province: String = $state(data.province ||'Province');
    let city: String = $state(data.city || 'City');
    let barangay: String = $state(data.barangay ||'Barangay');
    let street: String = $state(data.street || '');
    let selectedType = $state(data.ownership);
    let selectedKind = $state(data.type);

    const get_ = async (scope: String) => {
      let body = JSON.stringify({})
  
      if (scope === "province") {
        body = JSON.stringify({regionID: Number(region)});
      } else if (scope === "city") {
        body = JSON.stringify({pOrCID: Number(province)});
      } else if (scope === "brgy") {
        body = JSON.stringify({cOrMID: Number(city)});
      }
  
      try {
        const response = await fetch("./updateFacilityInfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        });
  
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
  
        const data = await response.json();
  
        if (scope === "province") {
          provinceList = data;
          enableProvinces = true;
          enableCities = false;
          enableBarangays = false;
          enableStreet = false;
        } else if (scope === "city") {
          cityList = data;
          enableCities = true;
          enableBarangays = false;
          enableStreet = false;
        } else if (scope === "brgy") {
          barangayList = data;
          enableBarangays = true;
          enableStreet = true;
        }
  
        if (!enableCities) {
          city = "City";
        }
        if (!enableBarangays) {
          barangay = "Barangay";
        }
        if (!enableStreet) {
          street = "";
        }
        
      } catch (error) {
        throw new Error(`Response status: ${error}`);
      }
    }

    // -------------- DAG DAG NI ELLE -------
    let imageUrl: string = $state('$lib/images/catle.jpg'); // Default image
    // let fileInput: HTMLInputElement | null = null;
    let isPublic = $state(true);

    // function handleFileUpload(event: Event) {
    //     const input = event.target as HTMLInputElement;
    //     const file = input.files?.[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //             if (typeof e.target?.result === 'string') {
    //                 imageUrl = e.target.result;
    //             }
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // }

    // function triggerFileInput() {
    //     fileInput?.click();
    // }
</script>
  
<form
    class="w-300 h-[calc(100vh-100px)] mx-auto grid grid-cols-1 bg-white  m-6 space-y-2  rounded-2xl p-6 shadow drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
    method="POST" 
    use:enhance
    action="?/update"
>
<!-- onchange={(e) => {e.currentTarget.requestSubmit()}} -->
<div class="w-full max-w-3x1 mx-auto bg-white">
    <!-- Image Container -->
    <div class="relative group w-full h-64 overflow-hidden rounded-xl border cursor-pointer">
        <img src={tempImage} alt="Hospital" class="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-60" />
        
        <!-- Hover Overlay -->
        <!-- <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 text-white text-lg font-semibold">
            Change Image
        </div> -->
    </div>

    <!-- Hidden File Input -->
    <!-- <input 
        type="file"
        name="facilityImage" 
        accept="image/*"
        bind:this={fileInput} 
        class="hidden" 
        onchange={handleFileUpload} 
    /> -->

    {#if form?.error}
        <p class="error">{form.error}</p>
    {/if}

    <label class="">
        Name
        <input 
        name="facilityName"
        type="text" 
        class="border p-2 rounded w-full" 
        placeholder="Name"
        required 
        bind:value={data.facilityName}/> 
    </label>
      
    <!-- Meow More Address Info -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">        
        <label class="w-full">
            Region
            <select 
                name="region" 
                bind:value={region} 
                onchange={() => get_("province")}
                required 
                class="border p-2 rounded w-full"
            >
            {#each data.regions as { regionID, name }}
                <option value={regionID}>{name}</option>
            {/each}
            </select>
        </label>
      
        <label class="w-full">
            Province
            <select 
                name="province" 
                bind:value={province} 
                required 
                onchange={() => get_("city")}
                disabled={!enableProvinces}
                class="border p-2 rounded w-full"
            >
                {#each provinceList as { pOrCID, name }}
                    <option value={pOrCID}>{name}</option>
                {/each}
            </select>
        </label>
      
      <label class="w-full">
          City/Municipality
          <select 
              name="city" 
              bind:value={city} 
              required 
              onchange={() => get_("brgy")}
              disabled={!enableCities}
              class="border p-2 rounded w-full"
          >
              {#each cityList as { cOrMID, name }}
                  <option value={cOrMID}>{name}</option>
              {/each}
          </select>
      </label>

      <label class="w-full">
        Barangay
        <select 
            name="brgy" 
            bind:value={barangay} 
            required 
            onchange={() => enableStreet ? "" : enableStreet = !enableStreet}
            disabled={!enableBarangays}
            class="border p-2 rounded w-full"
        >
            {#each barangayList as { brgyID, name }}
                <option value={brgyID}>{name}</option>
            {/each}
        </select>
    </label>
    </div>       
    
    <label>
        Street
        <input 
        name="street"
        type="text" 
        bind:value={street}
        class="border p-2 rounded w-full" 
        disabled={!enableStreet}
        placeholder="Name"
        required /> 
        {#if form?.description === "street"}
            <p class="error">{form.error}</p>
        {/if}
    </label>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full items-center">
        <label class="w-full">
            Email
            <input 
                name="email" 
                type="text"
                placeholder="Email"
                required 
                class="border p-2 rounded w-full"
                bind:value={data.email}/>
        </label>
        
        <label class="w-full">
            Contact No.
            <input 
                name="phoneNumber" 
                type="tel"
                placeholder="Contact No."
                required 
                class="border p-2 rounded w-full"
                bind:value={data.contactNumber}
            />
        </label>
    
        <label class="w-full">
            Type
            <select 
                name="type" 
                bind:value={selectedKind} 
                required 
                class="border p-2 rounded w-full"
            >
                {#each data.types as t}
                    <option value={t} selected={t === selectedKind}>{t}</option>
                {/each}
            </select>
        </label>


        <label class="w-full text-sm font-medium">
          Ownership
          <div class="flex bg-gray-200 rounded-full w-[200px] h-[50px] p-1">
              <!-- PUBLIC -->
              <label class="flex-1 text-center cursor-pointer">
                  <input 
                      type="radio" 
                      name="ownership" 
                      bind:group={selectedType}
                      value="PUBLIC"
                      class="hidden"
                  />
                  <div class="py-1 text-sm font-semibold rounded-full transition-all h-full"
                      class:selected={selectedType === "PUBLIC"}
                  >
                      PUBLIC
                  </div>
              </label>
      
              <!-- PRIVATE -->
              <label class="flex-1 text-center cursor-pointer">
                  <input 
                      type="radio" 
                      name="ownership" 
                      bind:group={selectedType}
                      value="PRIVATE"
                      class="hidden"
                  />
                  <div class="py-1 text-sm font-semibold rounded-full transition-all h-full"
                      class:selected={selectedType === "PRIVATE"}
                  >
                      PRIVATE
                  </div>
              </label>
          </div>
      </label>
      
        



    </div>
    

    <!-- Booker -->
    <div class="grid grid-cols-2 space-x-3">
        <label>
            Booking System
            <input 
            name="bookingSystem"
            type="text" 
            class="border p-2 rounded w-full" 
            placeholder="Name"
            bind:value={data.bookingSystem}
             /> 
        </label>

        <label>
            Accepted Insurance Providers
            <select 
            name="insurance" 
            required 
            class="border p-2 rounded w-full"
            >
                {#each data.providers as t}
                    <option value={t}>{t}</option>
                {/each}
            </select>
        </label>
    </div>

    <div class="justify-between flex  py-10 space-x-3">
        <a 
        href="../dashboard"
        class="flex justify-center items-center font-['Inter'] w-[200px] bg-[#9044C4] text-white py-2 rounded-2xl text-[15px] font-bold transition 
              hover:bg-purple-700 active:scale-95 active:bg-purple-800"
    >
        Cancel    
    </a>
    
    <button 
        class="flex justify-center items-center font-['Inter'] w-[200px] bg-[#9044C4] text-white py-2 rounded-2xl text-[15px] font-bold transition 
                hover:bg-purple-500 active:scale-95 active:bg-purple-800"
        type='submit'
    >
        Update    
    </button>
    
    </div>    
</div>
</form>
  


<style>
    .selected {
        background-color: #9044C4;
        color: white;
    }
</style>