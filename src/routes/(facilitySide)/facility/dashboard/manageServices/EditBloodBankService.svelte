<script lang="ts">
  import type { ActionData, PageData } from "./$types";
  import { enhance } from '$app/forms';

  import type { ServiceDTO } from '$lib';
  
  import { pagingQueryHandler } from '$lib/postHandlers';
      
  let { data,
        form, 
        serviceID, 
        currPopUp = $bindable(), 
        services = $bindable(),
        perPage,
        viewedDivisionID,
        serviceDivisionName = $bindable(),
        serviceDivisionID = $bindable(),
      }:{ data: PageData,
          form: ActionData, 
          serviceID: String, 
          currPopUp: String, 
          services: ServiceDTO[],
          perPage:number,
          viewedDivisionID:string,
          serviceDivisionName: String,
          serviceDivisionID: String,
        } = $props();

  let phoneNumber     : String = $state('')
  let openingTime     : String = $state('')
  let closingTime     : String = $state('')
  let pricePerUnit    : Number = $state(0)
  let turnaroundTimeD : Number = $state(0)
  let turnaroundTimeH : Number = $state(0)
  let A_P  : boolean = $state(false)
  let A_N  : boolean = $state(false)
  let B_P  : boolean = $state(false)
  let B_N  : boolean = $state(false)
  let O_P  : boolean = $state(false)
  let O_N  : boolean = $state(false)
  let AB_P : boolean = $state(false)
  let AB_N : boolean = $state(false)

  let selectedDivisionID = $state(serviceDivisionID)
  let selectedDivisionName = $state(serviceDivisionName)

  async function getData() {
    const body = JSON.stringify({serviceID, serviceType:"Blood Bank"});

    try {
      const response = await fetch("./manageServices/serviceInfo", {
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

      phoneNumber = rv.phoneNumber
      openingTime = rv.openingTime
      closingTime = rv.closingTime
      pricePerUnit = rv.pricePerUnit
      turnaroundTimeD = rv.turnaroundTimeD
      turnaroundTimeH = rv.turnaroundTimeH
      A_P  = rv.bloodTypeAvailability.A_P
      A_N  = rv.bloodTypeAvailability.A_N
      B_P  = rv.bloodTypeAvailability.B_P
      B_N  = rv.bloodTypeAvailability.B_N
      O_P  = rv.bloodTypeAvailability.O_P
      O_N  = rv.bloodTypeAvailability.O_N
      AB_P = rv.bloodTypeAvailability.AB_P
      AB_N = rv.bloodTypeAvailability.AB_N
      
    } catch (error) {
      throw new Error(`Response status: ${error}`);
    }
  }
  getData()

  async function getNewService() {
    try {
      const rv = await pagingQueryHandler({
        page: 'services',
        query: '',
        isInQueryMode:false,
        currentPage:1,
        change:0,
        totalPages:1,
        perPage,
        viewedDivisionID
      });
      services =  rv.list
    } catch (error) {
      console.log((error as Error).message)
    }
  }

</script>

<form method="POST" 
  id="editService"
  action="?/editBloodBankService"
  use:enhance={() => {
        return async ({ update }) => {
            await update({invalidateAll:true});
            if (form?.success) {
                currPopUp = ''
                getNewService()
            }
        };
    }}
>
  <div class="grid grid-cols-1" >
      {#if form?.error}
      <p class="error">{form.error}</p>
      {/if}

      <div class="container">
          <input 
              class="hidden" 
              name="serviceID"
              type="text"
              value={serviceID}
          />
          <!-- Phone Number -->
          <div class="card">
              <label><span class ="text-label">Phone No.</span>
                  <input 
                      class="input-box" 
                      name="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                  />
              </label>
          </div>
  
          <!-- Hours of Operation -->
          <div class="card">
              <label><span class ="text-label">Hours of Operation</span>
                  <div class="flex items-center gap-2">
                      <input 
                      class="input-box w-30"
                      name="opening"
                      type="time"
                      value={openingTime}
                      >
                      to
                      <input 
                      class="input-box w-30"
                      name="closing"
                      type="time"
                      value={closingTime}
                      >
                  </div>
              </label>
          </div>
  
          <!-- Price Rate -->
          <div class="card">
              <label><span class ="text-label">Base Price</span>
                  <input 
                      name="price"
                      type="number" 
                      class="input-box" 
                      placeholder="Price"
                      step=0.01
                      min=0
                      value={pricePerUnit}
                  />
              </label>
          </div>

          <!-- Turnaround Time -->
          <div class="card">
              <label>
                  <span class="text-label">Turnaround Time</span>
                  <div class="flex items-center gap-2">
                      <input 
                          type="number" 
                          name="turnaroundDays"
                          class="input-box w-30" 
                          placeholder="Days" 
                          value={turnaroundTimeD} 

                      />
                      Days
                  
                      <input 
                          type="number" 
                          name="turnaroundHours"
                          class="input-box w-30" 
                          placeholder="Hours" 
                          value={turnaroundTimeH}
                          
                      />
                      Hours
                  </div>
              </label>
          </div>
      <div class="mt-4 bg-white p-4 rounded-lg shadow">
          <p class="block text-label mb-2">Blood Type Availability</p>
          <div class="grid grid-cols-2 gap-2">
              <label class="flex items-center space-x-2">
                  <input name="ap" type="checkbox" checked={A_P}>
                  <span>A+</span>
              </label>
              <label class="flex items-center space-x-2">
                  <input name="an" type="checkbox" checked={A_N}>
                  <span>A-</span>
              </label>
              <label class="flex items-center space-x-2">
                  <input name="bp" type="checkbox" checked={B_P}>
                  <span>B+</span>
              </label>
              <label class="flex items-center space-x-2">
                  <input name="bn" type="checkbox" checked={B_N}>
                  <span>B-</span>
              </label>
              <label class="flex items-center space-x-2">
                  <input name="op" type="checkbox" checked={O_P}>
                  <span>O+</span>
              </label>
              <label class="flex items-center space-x-2">
                  <input name="on" type="checkbox" checked={O_N}>
                  <span>O-</span>
              </label>
              <label class="flex items-center space-x-2">
                  <input name="abp" type="checkbox" checked={AB_P}>
                  <span>AB+</span>
              </label>
              <label class="flex items-center space-x-2">
                  <input name="abn" type="checkbox" checked={AB_N}>
                  <span>AB-</span>
              </label>
          </div>
      </div>
      
      <input type="text" class="hidden" name="divisionID" bind:value={selectedDivisionID} />
      <input type="text" class="hidden" name="divisionName" bind:value={selectedDivisionName} />

      {#if data.hasDivisions}
        <label>
          Divisions

          {#each (data.divisions ?? []) as division}
          {division.name}
            <input 
              type="radio" 
              name="divSelect" 
              onclick={() => {
                selectedDivisionID = division.divisionID
                selectedDivisionName = division.name
              }}
              checked={serviceDivisionID == division.divisionID}
              class="input-box w-30"
            >
          {/each}
        </label>
      {/if}
  </div>
</form>
