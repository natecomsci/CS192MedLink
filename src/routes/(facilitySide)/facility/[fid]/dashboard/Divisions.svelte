<div class="bg-white shadow-lg rounded-lg p-8">
    <div class="flex justify-between items-center border-b border-[#DBD8DF] pb-2">
      <h2 class="text-[30px] text-[#9044C4] font-bold">Divisions</h2>
      <a 
        href="/manage-admins" 
        class="text-purple-500 text-sm hover:text-purple-400 transition-colors duration-200"
      >✏️ Manage Divisions</a>
    </div>
  
    <div class="mt-4">
      {#each Array(5) as _, i}
        <p class="py-2 border-b border-transparent italic">Department of Cardiology</p>
      {/each}
    </div>
  </div>
  