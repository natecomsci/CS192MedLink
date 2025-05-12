<script lang="ts">
    import type { Provider } from '@prisma/client';
    import type { PageProps } from './$types';
    import { enhance } from '$app/forms';

    import type { POrCDTO, COrMDTO, BrgyDTO } from '$lib';
    import { facilityType, provider } from '$lib/projectArrays';

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
        return selectedProviders.includes(p) ?? false
    }

  let selectedProviders: string[] = $state(data.providers ?? []);
  let showDropdown = $state(false);


  // For Image Uploading and Previewing
  import { writable } from "svelte/store";

  let fileInput: HTMLInputElement | null = null;
  const imageSrc = writable<string | null>(null);

  // Function to open the file manager
  function openFileDialog() {
    fileInput?.click();
  }

  // Function to update the image preview
  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      imageSrc.set(URL.createObjectURL(file)); // Generate temporary preview
    }
  }
</script>
  
<form
    class="w-300 h-[calc(100vh-50px)] my-5 mx-auto bg-white overflow-y-auto rounded-2xl p-6 shadow drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
    method="POST" 
    use:enhance
    action="?/update"
    enctype="multipart/form-data"
>
   
    <!-- Image Container -->
    <div class="relative group w-full h-130 overflow-hidden rounded-xl cursor-pointer">
        <img src={$imageSrc || data.photo} alt="Facility" class="w-full h-full object-cover transition-opacity duration-300" />
        
        <!-- Hover Overlay (Opens File Manager) -->
        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 text-white text-lg font-semibold"
            onclick={openFileDialog}
        >
            Change Image
        </div>

        <!-- Hidden File Input -->
        <input type="file" name="facilityImage" accept="image/*" bind:this={fileInput} class="hidden" onchange={handleFileChange} />
    </div>


    {#if form?.error}
        <p class="error">{form.error}</p>
    {/if}

    <!-- onchange={(e) => {e.currentTarget.requestSubmit()}} -->
    <div class="w-full max-w-3x1 mx-auto bg-white space-y-4 mt-4">

        <div>
            <label>
                <span class="text-label">Name</span>
                <input
                name="facilityName"
                type="text"
                class="input-box"
                placeholder="Name"
                bind:value={data.facilityName}/>
            </label>
        </div>
          
        <!-- Meow More Address Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">        
            <label class="w-full">
                <span class="text-label">Region</span>
                <select 
                    name="region" 
                    bind:value={regionID} 
                    onchange={() => get_("province")}
                    class="input-box"
                >
                {#each data.regions ?? [] as r}
                    <option value={String(r.regionID)}>{r.name}</option>
                {/each}
                </select>
            </label>
          
            <label class="w-full">
                <span class="text-label">Province</span>
                <select 
                    name="province" 
                    bind:value={provinceID} 
                    onchange={() => get_("city")}
                    class="input-box"
                >
                    {#each provinceList as p}
                        <option value={String(p.pOrCID)}>{p.name}</option>
                    {/each}
                </select>
            </label>
          
          <label class="w-full">
            <span class="text-label">City/Municipality</span>
              <select 
                  name="city" 
                  bind:value={cityID} 
                  onchange={() => get_("brgy")}
                  disabled={!enableCities}
                  class="input-box"
              >
                  {#each cityList as c}
                      <option value={String(c.cOrMID)}>{c.name}</option>
                  {/each}
              </select>
          </label>

          <label class="w-full">
            <span class="text-label">Barangay</span>
            <select 
                name="brgy" 
                bind:value={barangayID} 
                onchange={() => enableStreet ? "" : enableStreet = !enableStreet}
                disabled={!enableBarangays}
                class="input-box"
            >
                {#each barangayList as b}
                    <option value={String(b.brgyID)}>{b.name}</option>
                {/each}
            </select>
        </label>
        </div>       
        
        <div>
            <label>
                <span class="text-label">Street</span>
                <input
                name="street"
                type="text"
                bind:value={street}
                class="input-box"
                disabled={!enableStreet}
                placeholder="Name"
                />
            </label>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full items-center">
            <!-- Email -->
            <label class="w-full">
            <span class="text-label">Email</span>
                <input 
                    name="email" 
                    type="text"
                    placeholder="Email"
                    class="input-box"
                    bind:value={data.email}/>
            </label>
            
            <!-- Contact No. -->
            <label class="w-full">
            <span class="text-label">Contact No.</span>
                <input 
                    name="phoneNumber" 
                    type="tel"
                    placeholder="Contact No."
                    class="input-box"
                    bind:value={data.contactNumber}
                />
            </label>
        
            <!-- Type -->
            <label class="w-full">
            <span class="text-label">Type</span>
                <select 
                    name="type" 
                    bind:value={selectedType} 
                    class="input-box"
                >
                    {#each facilityType as t}
                        <option value={t} selected={t === selectedType}>{t}</option>
                    {/each}
                </select>
            </label>

            <!-- Ownership -->
            <label class="w-full text-sm font-medium">
                <span class="text-label">Ownership</span>
                <div class="flex bg-gray-200 rounded-lg w-full h-9">
                    
                    <!-- PUBLIC -->
                    <label class="flex-1 text-center cursor-pointer">
                        <input 
                            type="radio" 
                            name="ownership" 
                            bind:group={selectedOwnership}
                            value="PUBLIC"
                            class="hidden"
                        />
                        <div class="py-1 text-sm font-semibold rounded-lg transition-all h-full flex items-center justify-center"
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
                        <div class="py-1 text-sm font-semibold rounded-lg transition-all h-full flex items-center justify-center"
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
            <span class="text-label">Booking System</span>
                <input 
                name="bookingSystem"
                type="text" 
                class="input-box" 
                placeholder="Name"
                bind:value={data.bookingSystem}
                 /> 
            </label>

            <label>
            <span class="text-label">Accepted Insurance Providers</span>
                <div class="relative w-full">
                    <!-- Dropdown Button -->
                    <button 
                        class="input-box overflow-hidden" 
                        onclick={() => showDropdown = !showDropdown}
                        type="button" 
                    >
                        <span class="fade-mask text-left">
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
                        <div class="absolute w-full bg-white border border-gray-300 shadow-lg p-2 max-h-60 overflow-y-auto bottom-full mb-1 z-50">
                            {#each provider as t}
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
</style>


