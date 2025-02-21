<div class="bg-white shadow-lg rounded-lg p-4">
    <div class="flex justify-between items-center border-b border-[#DBD8DF] pb-2">
      <h2 class="text-[30px] text-[#9044C4] font-bold">Admins</h2>
        <a 
          href="/manage-admins" 
          class="text-purple-500 text-sm hover:text-purple-400 transition-colors duration-200"
        >✏️ Manage Admins</a>
    </div>
    
    <div class="flex gap-2 mt-4">
      {#each Array(6) as _, i}
        <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
      {/each}
    </div>
  </div>
  