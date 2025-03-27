<script lang="ts">
  import Logo from '$lib/images/Logo.png';
  import Icon from '@iconify/svelte';
  import type { PageProps } from './$types';
  import PatientHeader from './PatientHeader.svelte'
  import { enhance } from '$app/forms';
  
  let Search = "mdi-light:magnify";
  let Filter = "mingcute:settings-6-line";
  
  let showFilter = $state(false);
  let { data, form }: PageProps = $props();

</script>

<PatientHeader/>

<form 
  class="grid grid-cols-1 justify-items-center p-8" 
  method="POST"
  action="?/search"
  use:enhance
>
  <div class="grid grid-cols-1 justify-items-center">
    <img src={Logo} alt="MedLink logo" width="100" height="100"/>
    <h1>Connecting you to healthcare, one search at a time.</h1>
  </div>
  
  <!-- Search Input -->
  <div class="flex items-center mt-4">
    
    <Icon icon={Search} width="20" height="20" class="mr-2"/>
    <input name="query" type="text" placeholder="Search" value="" class="border p-2 rounded"/>

    <button type="submit" class="ml-2 bg-blue-600 text-white px-4 py-2 rounded">
      Search
    </button>

    <button 
      type="button"
      class="ml-2 text-white bg-purple-700 hover:bg-purple-800 p-2.5 rounded-full"
      onclick={() => showFilter = !showFilter}
    >
      <Icon icon={Filter} width="20" height="20"/>
    </button>
  </div>
  {#if form?.error}
    <p class="text-red-600 mt-2">{form.error}</p>
  {/if}

  {#if showFilter}
    <p>filters here</p>
  {/if}
</form>
  

<div class="grid grid-cols-2 justify-items-center p-8">

  <button type="button" class="text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-900">Sign In</button>

  <button type="button" class="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Sign Up</button>

</div>


