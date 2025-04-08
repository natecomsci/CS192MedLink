<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  let { form, divisionID, currPopUp = $bindable() }: { form: ActionData, divisionID: String, currPopUp: String } = $props();

  //= =========================================================
  let showPopup = false; // Controls the visibility of the popup
  let currentStep = $state(1); // Tracks the current step (1 or 2)
  let userInput = $state(""); // User input in step 1
  let confirmation = false; // User confirmation for step 2

  let admins = [
    {
      name: 'Admin 1',
      id: '1234567891011',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    {
      name: 'Admin 2',
      id: '9876543210000',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    {
      name: 'Admin 3',
      id: '555666777888',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
    },
        {
      name: 'Admin 1',
      id: '1234567891011',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    {
      name: 'Admin 2',
      id: '9876543210000',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    {
      name: 'Admin 3',
      id: '555666777888',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
    },
        {
      name: 'Admin 1',
      id: '1234567891011',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    {
      name: 'Admin 2',
      id: '9876543210000',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    {
      name: 'Admin 3',
      id: '555666777888',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
    },
        {
      name: 'Admin 1',
      id: '1234567891011',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    {
      name: 'Admin 2',
      id: '9876543210000',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    {
      name: 'Admin 3',
      id: '555666777888',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
    },
    // Add more as needed
  ];

  // Function to move to the next step
  function nextStep() {
    if (currentStep === 1 || 2) {
      currentStep = currentStep + 1;
    } else {
      submitForm();
    }
  }

  // Function to move back to step 1
  function previousStep() {
    currentStep = 1;
  }

  // Function to handle form submission
  function submitForm() {
    // Do the form submission logic (e.g., API call, save data, etc.)
    alert("Form submitted with input: " + userInput);
    resetPopup();
  }

  // Reset popup
  function resetPopup() {
    currentStep = 1;
    userInput = "";
    showPopup = false;
  }
</script>

{#if currentStep === 1}
  <!-- Modal Overlay -->
  <div class="fixed inset-0 bg-black/30 bg-opacity-10 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-80">
      <h2 class="text-lg font-bold">Confirm Deletion</h2>
      <p>Are you sure you want to delete this division?</p>

      <!-- Hidden Form for Deletion -->
      <!-- <form id="deleteForm" method="POST" action="?/deleteDivision" 
        use:enhance={() => {
          return async ({ update }) => {
            await update({ invalidateAll: true });
            if (form?.success) {
              currentStep = 2;
            }
            else{
              currentStep = 2;
            }
          };
        }}
      > -->
        {#if form?.error}
          <p class="text-red-500 text-sm font-semibold">{form.error}</p>
        {/if}

        <input type="hidden" name="divisionID" value="{divisionID}" />

        <!-- Password Field -->
        <div class="mt-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Enter Password:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            class="mt-1 block w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring focus:border-blue-500" 
            required 
          />
        </div>

        <div class="flex justify-end space-x-2 mt-4">
          <button class="px-4 py-2 bg-gray-300 rounded" type="button" onclick={() => currPopUp = ''}>Cancel</button>
          <button class="px-4 py-2 bg-red-600 text-white rounded" type="submit" onclick={() => currentStep = 2}>Confirm</button>

        </div>
      <!-- </form> -->
    </div>
  </div>





{:else if currentStep === 2}
  
  <!-- Modal Background -->
  <div class="fixed inset-0 bg-black/30 bg-opacity-10 flex justify-center items-center z-50">
    <div class="bg-white w-1/2 max-w-full rounded-xl p-6 shadow-lg max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center mb-4">
        <button class="mr-3" onclick={() => currentStep = 1}>
          <svg class="w-6 h-6 text-purple-800" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 class="text-2xl font-bold text-purple-800">Manage Admins in Division Name</h2>
      </div>

      <!-- Scrollable Service List -->
      <div class="overflow-y-auto flex-1 pr-2 border">
        {#each admins as admin}
          <div class="card2 mb-4 flex items-center justify-between rounded-lg bg-gray-50 shadow-sm">
            <div class="flex items-center gap-4">
              <img src={admin.avatar} class="w-14 h-14 rounded-full object-cover" />
              <div>
                <p class="font-bold text-lg text-gray-800">{admin.name}</p>
                <p class="text-purple-600">{admin.id}</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <div class="relative">
                <select class="border rounded px-3 py-2 text-sm focus:outline-none">
                  <option>Reconfigure Admin Divisions</option>
                  <option>Division A</option>
                  <option>Division B</option>
                </select>
              </div>

              <button class="text-red-600 hover:text-red-800">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        {/each}
      </div>

      <!-- Footer Buttons -->
      <div class="flex justify-between mt-4 pt-4 border-t">
        <button class="px-4 py-2 bg-gray-300 rounded" type="button" onclick={() => currPopUp = ''}>Cancel</button>
        <button class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700" type="button" onclick={() => currentStep = 3}>Next</button>
      </div>
    </div>
  </div>




  

{:else if currentStep === 3}
  <!-- Modal Background -->
  <div class="fixed inset-0 bg-black/30 bg-opacity-10 flex justify-center items-center z-50">
    <div class="bg-white w-1/2 max-w-full rounded-xl p-6 shadow-lg max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center mb-4">
        <button class="mr-3" onclick={() => currentStep = 1}>
          <svg class="w-6 h-6 text-purple-800" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 class="text-2xl font-bold text-purple-800">Manage Services in Division Name</h2>
      </div>

      <!-- Scrollable Admin List -->
      <div class="overflow-y-auto flex-1 pr-2 border">
        {#each admins as admin}
          <div class="card2 mb-4 flex items-center justify-between rounded-lg bg-gray-50 shadow-sm">
            <div class="flex items-center gap-4">
              <div>
                <p class="font-bold text-lg text-gray-800">Service Name</p>
                <p class="text-purple-600">Service Division</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <div class="relative">
                <select class="border rounded px-3 py-2 text-sm focus:outline-none">
                  <option>Reconfigure Service Division</option>
                  <option>Division A</option>
                  <option>Division B</option>
                </select>
              </div>

              <button class="text-red-600 hover:text-red-800">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        {/each}
      </div>

      <!-- Footer Buttons -->
      <div class="flex justify-between mt-4 pt-4 border-t">
        <button class="px-4 py-2 bg-gray-300 rounded" type="button" onclick={() => currPopUp = ''}>Cancel</button>
        <button class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700" type="button" onclick={() => currentStep = 3}>Confirm</button>
      </div>
    </div>
  </div>
{/if}