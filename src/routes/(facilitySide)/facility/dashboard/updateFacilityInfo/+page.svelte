<script lang="ts">
    import type { POrCDTO, COrMDTO, BrgyDTO } from '$lib/server/DTOs';
    import type { PageProps } from './$types';

    import { enhance } from '$app/forms';

    import { facilityType, providers } from '$lib/projectArrays';
    import type { Provider } from '@prisma/client';

    let enableCities = $state(true);
    let enableBarangays = $state(true);
    let enableStreet = $state(true);

    let { data, form }: PageProps = $props();
  
    let provinceList: POrCDTO[] = $state(data.provinces ?? []);
    let cityList: COrMDTO[] = $state(data.corms ?? []);
    let barangayList: BrgyDTO[] = $state(data.brgys ??[]);
  
    let regionID: String = $state(String(data.regionID) ?? '');
    let provinceID: String = $state(String(data.provinceID) ?? '');
    let cityID: String = $state(String(data.cityID) ?? '');
    let barangayID: String = $state(String(data.barangayID) ?? '');
    let street = $state(data.street ?? '');

    // let booking: String = $state(data.bookingSystem ?? '')

    let selectedOwnership = $state(data.ownership);
    let selectedType = $state(data.type);

    const get_ = async (scope: String) => {
      let body:string = JSON.stringify({})
  
      if (scope === "province") {
        body = JSON.stringify({regionID: Number(regionID)});
      } else if (scope === "city") {
        body = JSON.stringify({pOrCID: Number(provinceID)});
      } else if (scope === "brgy") {
        body = JSON.stringify({cOrMID: Number(cityID)});
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
          cityID = "";
        }
        if (!enableBarangays) {
          barangayID = "";
        }
        if (!enableStreet) {
          street = "";
        }
        
      } catch (error) {
        throw new Error(`Response status: ${error}`);
      }
    }

    function isAccepted(p: Provider): boolean {
        return data.providers?.includes(p) ?? false
    }

  let selectedProviders: string[] = $state(data.providers ?? []);
  let showDropdown = $state(false);
</script>
  
<form
    class="w-300 h-[calc(100vh-100px)] mx-auto grid grid-cols-1 bg-white overflow-y-auto  m-6 space-y-2  rounded-2xl p-6 shadow drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
    method="POST" 
    use:enhance
    action="?/update"
    enctype="multipart/form-data"
>
    <!-- onchange={(e) => {e.currentTarget.requestSubmit()}} -->
    <div class="w-full max-w-3x1 mx-auto bg-white">
        <!-- Image Container -->
        <div class="relative group w-full h-130 overflow-hidden rounded-xl border cursor-pointer">
            <img src={data.photo} alt="Facility" class="w-full h-full object-cover transition-opacity duration-300" />
            
            <!-- Hover Overlay -->
            <!-- <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 text-white text-lg font-semibold">
                Change Image
            </div> -->
        </div>
        <input 
            type="file"
            name="facilityImage" 
            accept="image/*"
        />



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
            bind:value={data.facilityName}/> 
        </label>
          
        <!-- Meow More Address Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">        
            <label class="w-full">
                Region
                <select 
                    name="region" 
                    bind:value={regionID} 
                    onchange={() => get_("province")}
                    class="border p-2 rounded w-full"
                >
                {#each data.regions ?? [] as r}
                    <option value={String(r.regionID)}>{r.name}</option>
                {/each}
                </select>
            </label>
          
            <label class="w-full">
                Province
                <select 
                    name="province" 
                    bind:value={provinceID} 
                    onchange={() => get_("city")}
                    class="border p-2 rounded w-full"
                >
                    {#each provinceList as p}
                        <option value={String(p.pOrCID)}>{p.name}</option>
                    {/each}
                </select>
            </label>
          
          <label class="w-full">
              City/Municipality
              <select 
                  name="city" 
                  bind:value={cityID} 
                  onchange={() => get_("brgy")}
                  disabled={!enableCities}
                  class="border p-2 rounded w-full"
              >
                  {#each cityList as c}
                      <option value={String(c.cOrMID)}>{c.name}</option>
                  {/each}
              </select>
          </label>

          <label class="w-full">
            Barangay
            <select 
                name="brgy" 
                bind:value={barangayID} 
                onchange={() => enableStreet ? "" : enableStreet = !enableStreet}
                disabled={!enableBarangays}
                class="border p-2 rounded w-full"
            >
                {#each barangayList as b}
                    <option value={String(b.brgyID)}>{b.name}</option>
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
            />
        </label>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full items-center">
            <label class="w-full">
                Email
                <input 
                    name="email" 
                    type="text"
                    placeholder="Email"
                    class="border p-2 rounded w-full"
                    bind:value={data.email}/>
            </label>
            
            <label class="w-full">
                Contact No.
                <input 
                    name="phoneNumber" 
                    type="tel"
                    placeholder="Contact No."
                    class="border p-2 rounded w-full"
                    bind:value={data.contactNumber}
                />
            </label>
        
            <label class="w-full">
                Type
                <select 
                    name="type" 
                    bind:value={selectedType} 
                    class="border p-2 rounded w-full"
                >
                    {#each facilityType as t}
                        <option value={t} selected={t === selectedType}>{t}</option>
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
                            bind:group={selectedOwnership}
                            value="PUBLIC"
                            class="hidden"
                        />
                        <div class="py-1 text-sm font-semibold rounded-full transition-all h-full"
                            class:selected={selectedOwnership === "PUBLIC"}
                        >
                            PUBLIC
                        </div>
                    </label>
            
                    <!-- PRIVATE -->
                    <label class="flex-1 text-center cursor-pointer">
                        <input 
                            type="radio" 
                            name="ownership" 
                            bind:group={selectedOwnership}
                            value="PRIVATE"
                            class="hidden"
                        />
                        <div class="py-1 text-sm font-semibold rounded-full transition-all h-full"
                            class:selected={selectedOwnership === "PRIVATE"}
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

                <div class="relative w-full">
                    <!-- Dropdown Button -->
                    <button 
                        class="w-full border bg-white text-left p-2 rounded relative overflow-hidden pr-8" 
                        onclick={() => showDropdown = !showDropdown}
                        type="button" 
                    >
                        <span class="fade-mask">
                            {selectedProviders.length > 0 ? selectedProviders.join(", ") : "Select Providers"}
                        </span>
                
                        <!-- Dropdown Icon -->
                        <svg class="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 transition-transform pointer-events-none" 
                            style="transform: {showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'}" 
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                
                    <!-- Dropdown Content -->
                    {#if showDropdown}
                        <div class="absolute w-full bg-white border shadow-lg p-2 max-h-60 overflow-y-auto bottom-full mb-1 z-50">
                            {#each providers as t}
                                <label class="flex items-center space-x-2">
                                    <input 
                                        name={t} 
                                        type="checkbox" 
                                        checked={isAccepted(t)}
                                        onclick={() => selectedProviders.includes(t) ? selectedProviders.splice(selectedProviders.indexOf(t), 1) : selectedProviders.push(t)} 
                                    />
                                    <span>{t}</span>
                                </label>
                            {/each}
                        </div>
                    {/if}
                </div>
                
                
                  
            </label>


        </div>

        <div class="justify-between flex  py-10 space-x-3">
            <a 
            href="../dashboard"
            class="flex justify-center items-center font-['Inter'] w-[200px] bg-[#9044C4] text-white py-2 rounded-2xl text-[15px] font-bold transition hover:bg-purple-700 active:scale-95 active:bg-purple-800"
            data-sveltekit-reload
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


    .fade-mask {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: clip;
        position: relative;
        max-width: 100%;
        
        /* Fading effect using mask */
        -webkit-mask-image: linear-gradient(to right, black 80%, rgba(0, 0, 0, 0));
        mask-image: linear-gradient(to right, black 80%, rgba(0, 0, 0, 0));
    }

    ::-webkit-scrollbar {
    width: 10px !important;
    }

    ::-webkit-scrollbar-thumb {
    background: #9044C4 !important;
    border-radius: 10px !important;
    }

    ::-webkit-scrollbar-track {
    background: #DCDCDC !important;
    border-radius: 10px !important;
    }

    ::-webkit-scrollbar-thumb:hover {
    background: #6a3191 !important;
    }

</style>


