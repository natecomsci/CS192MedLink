<script lang="ts">

    let {currPopUp = $bindable()}:{currPopUp: String;} = $props();


    let selectedOwnership = $state('PUBLIC')
    let selectedType = $state('')
    
</script>

<div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <!-- <div class="grid grid-cols-1 bg-white m-6 space-y-2 rounded-2xl shadow drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"> -->
      <!-- <div class="h-[calc(100vh-100px)] flex bg-gray-100 rounded-2xl"> -->
        <div class="w-1/2 h-[calc(100vh-100px)] bg-white  flex flex-col rounded-2xl overflow-y-auto">
            <!-- Label -->
            <!-- <div class="flex items-center gap-5 border pl-6 pr-6">
                <button onclick={() => currPopUp = ''} type="button">
                  <img src="/back_icon.svg" alt="Back" class="w-6 h-6 cursor-pointer transition-colors duration-200 hover:opacity-70 active:opacity-50"/>
                </button>
                <h1 class="text-[30px] font-['DM_Sans'] font-bold text-purple-900">General Information</h1>
            </div> -->


            <!-- Image Container -->
            <div class="relative group w-full h-[500px] overflow-hidden rounded-t-xl cursor-pointer bg-black">
                <img src="" alt="Facility" class="w-full h-full object-cover transition-opacity duration-300" />
                
                <!-- Hover Overlay (Opens File Manager) -->
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 text-white text-lg font-semibold"
                    onclick={() => {}}
                >
                    Change Image
                </div>

                <!-- Hidden File Input -->
                <input type="file" name="facilityImage" accept="image/*"  class="hidden" onchange={()=>{}} />
            </div>


                <!-- {#if form?.error}
                    <p class="error">{form.error}</p>
                {/if} -->


            <div class="w-full max-w-3x1 mx-auto bg-white space-y-4 mt-4  pl-6 pr-6">

                    <div>
                        <label>
                            <span class="text-label">Name</span>
                            <input
                            name="facilityName"
                            type="text"
                            class="input-box"
                            placeholder="Name" 
                            
                            />
                        </label>
                    </div>
                    
                    <!-- Meow More Address Info -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">        
                        <label class="w-full">
                            <span class="text-label">Region</span>
                            <select 
                                name="region" 
                                class="input-box"
                            >
                            <!-- {#each data.regions ?? [] as r}
                                <option value={String(r.regionID)}>{r.name}</option>
                            {/each} -->
                            </select>
                        </label>
                    
                        <label class="w-full">
                            <span class="text-label">Province</span>
                            <select 
                                name="province" 
                                class="input-box"
                            >
                                <!-- {#each provinceList as p}
                                    <option value={String(p.pOrCID)}>{p.name}</option>
                                {/each} -->
                            </select>
                        </label>
                    
                    <label class="w-full">
                        <span class="text-label">City/Municipality</span>
                        <select 
                            name="city" 
                            class="input-box"
                        >
                            <!-- {#each cityList as c}
                                <option value={String(c.cOrMID)}>{c.name}</option>
                            {/each} -->
                        </select>
                    </label>

                    <label class="w-full">
                        <span class="text-label">Barangay</span>
                        <select 
                            name="brgy" 
                            class="input-box"
                        >
                            <!-- {#each barangayList as b}
                                <option value={String(b.brgyID)}>{b.name}</option>
                            {/each} -->
                        </select>
                    </label>
                    </div>       
                    
                    <div>
                        <label>
                            <span class="text-label">Street</span>
                            <input
                            name="street"
                            type="text"
                            class="input-box"
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
                                class="input-box" />
                        </label>
                        
                        <!-- Contact No. -->
                        <label class="w-full">
                        <span class="text-label">Contact No.</span>
                            <input 
                                name="phoneNumber" 
                                type="tel"
                                placeholder="Contact No."
                                class="input-box"
                            />
                        </label>
                    
                        <!-- Type -->
                        <label class="w-full">
                        <span class="text-label">Type</span>
                            <select 
                                name="type" 
                                class="input-box"
                            >
                                <!-- {#each facilityType as t}
                                    <option value={t} selected={t === selectedType}>{t}</option>
                                {/each} -->
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
                            /> 
                        </label>

                        <label>
                        <span class="text-label">Accepted Insurance Providers</span>
                            <div class="relative w-full">
                                <!-- Dropdown Button -->
                                <button 
                                    class="input-box overflow-hidden" 
                                    type="button" 
                                >
                                    <span class="fade-mask w-full text-left">
                                        Select Providers
                                    </span>
                            
                                    <!-- Dropdown Icon -->
                                    <svg class="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 transition-transform pointer-events-none" 
                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            
                                <!-- Dropdown Content
                                {#if showDropdown}
                                    <div class="absolute w-full bg-white border border-gray-300 shadow-lg p-2 max-h-60 overflow-y-auto bottom-full mb-1 z-50">
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
                                {/if} -->
                            </div>                  
                        </label>


                    </div>

                    <div class="justify-between flex  py-10 space-x-3">
                        <!-- <a 
                        href="../dashboard"
                        class="flex justify-center items-center font-['Inter'] w-[200px] bg-[#9044C4] text-white py-2 rounded-2xl text-[15px] font-bold transition hover:bg-purple-700 active:scale-95 active:bg-purple-800"
                        data-sveltekit-reload
                        >
                        Cancel    
                         </a> -->
                    <button 
                        class="flex justify-center items-center font-['Inter'] w-[200px] bg-[#9044C4] text-white py-2 rounded-2xl text-[15px] font-bold transition 
                                hover:bg-purple-500 active:scale-95 active:bg-purple-800"
                        onclick={() => currPopUp = ''}
                        type='submit'
                    >
                        Cancel
                    </button>
                    
                    <button 
                        class="flex justify-center items-center font-['Inter'] w-[200px] bg-[#9044C4] text-white py-2 rounded-2xl text-[15px] font-bold transition 
                                hover:bg-purple-500 active:scale-95 active:bg-purple-800"
                        type='submit'
                    >
                        Update    
                    </button>
                    </div>    
            </div>



                
            
            
            
            
            
        </div>
        <!-- </div> -->
      <!-- </div> -->
</div>

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
