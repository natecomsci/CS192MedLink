<script>
  import { onMount } from 'svelte';
  import FacilityButton from '$lib/FacilityButton.svelte';
  import SettingsButton from '$lib/SettingsButton.svelte';
  import Logo from '$lib/images/Logo.png';

  let history = Array(10).fill({
    admin: 'Admin 1',
    action: 'Updated ICU Information',
    time: '3:11 PM',
    date: '1/29/2025',
    division: 'Emergency Division'
  });

  let admins = Array(3).fill('Admin 1');
  let services = Array(20).fill('ICU Information');
  let divisions = Array(15).fill('Department of Cardiology');

  let hospitalName = 'Allied Care Experts Medical Center–Baypointe, Inc.';

  let currentPage = 1;
  let itemsPerPage = 10;

  let paginatedHistory = [];

  function updatePagination() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    paginatedHistory = history.slice(start, end);
  }

  function nextPage() {
    if (currentPage < Math.ceil(history.length / itemsPerPage)) {
      currentPage++;
      updatePagination();
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      updatePagination();
    }
  }

  onMount(updatePagination);
</script>

<style>
  /* Ensure the background spans the entire width */
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #EDEBEF;
    width: 100vw !important;
    min-height: 100vh; /* Full viewport height */
    padding: 0px;
    box-sizing: border-box;
  }

  /* Inner content wrapper */
  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 25px;
    max-width: 1200px; /* Centered content */
    width: 100%;
  }

  /* Box styles */
  .box {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }

  /* Control History (left side) */
  .control-history {
    overflow-y: auto;
    padding: 20px;
    min-height: 400px;
  }

  /* Right section layout */
  .right-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* Services and Divisions in two equal columns */
  .services-divisions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  /* Admin box layout */
  .admins-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px;
  }

  .admin-list {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
  }

  .admin-avatar {
    width: 50px;
    height: 50px;
    background: gray;
    border-radius: 50%;
  }
</style>

<header class="flex items-center justify-between p-3 border top-0 duration-200 sticky z-[10] top-0 duration-200 px-6 flex items-center justify-between border border-transparent bg-white ">
  <div class="flex items-center">
      <img src={Logo} alt="MedLink logo" class="w-10 h-13" />
      <h1 class="px-3 font-['DM_Sans'] text-[30px] leading-[40px] tracking-[-0.03em] font-black text-[#3D1853] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">Med<span class="text-[#9044C4]">Link</span></h1>
  </div>

  <div class="flex gap-3">
      <h2 class="font-bold text-[27px] text-[#3D1853]">{hospitalName}</h2>
      <FacilityButton />
      <SettingsButton />
  </div>
</header>

<div class="">
  <div class="content">
    <!-- Control History (Left Side) -->
    <div class="box control-history">
      <h3 class="font-bold text-[#9044C4] text-[20px]">Control History</h3>
      {#each paginatedHistory as entry}
        <p><strong>{entry.admin}</strong> {entry.action} - {entry.time} {entry.date} <em>{entry.division}</em></p>
      {/each}
      <button on:click={prevPage} disabled={currentPage === 1}>Prev</button>
      <span> Page {currentPage} </span>
      <button on:click={nextPage} disabled={currentPage >= Math.ceil(history.length / itemsPerPage)}>Next</button>
    </div>

    <!-- Right Section -->
    <div class="right-section">
      <!-- Admins -->
      <div class="box admins-box">
        <h3 class="font-bold text-[#9044C4] text-[20px]">Admins</h3>
        <div class="admin-list">
          {#each admins as admin}
            <div class="admin-avatar"></div>
          {/each}
        </div>
      </div>

      <!-- Services and Divisions -->
      <div class="services-divisions">
        <!-- Services -->
        <div class="box">
          <h3 class="font-bold text-[#9044C4] text-[20px]">Services</h3>
          {#each services as service}
            <p>{service}</p>
          {/each}
        </div>

        <!-- Divisions -->
        <div class="box">
          <h3 class="font-bold text-[#9044C4] text-[20px]">Divisions</h3>
          {#each divisions as division}
            <p>{division}</p>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>