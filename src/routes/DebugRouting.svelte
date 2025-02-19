<script lang="ts">
  import { goto } from '$app/navigation';
</script>

<header class="sticky top-0 z-10 w-full bg-red-500 shadow-md">
  <nav>
    <ul class="flex justify-center">
      <li>
        <select class="block p-4" value="Patient Pages">
          <option onclick={() => goto('/signIn')}>Sign In</option>
          <option onclick={() => goto('/signUp')}>Sign Up</option>
          <option onclick={() => goto('/forgotPassword')}>Forgot Password</option>

          <option onclick={() => goto('/')}>Guest</option>
          <option onclick={() => goto('/patient/1')}>Registered Search</option>
          <option onclick={() => goto('/searchResults/Quezon+City')}>P-Guest</option>

          <option onclick={() => goto('/patient/1/settings')}>Settings</option>

          <option onclick={() => goto('/patient/1/bookmarks')}>Bookmarks</option>
          <option onclick={() => goto('/patient/1/bookmarks/allFolders')}>Bookmarks-All Folders</option>
          <option onclick={() => goto('/patient/1/bookmarks/Hospitals')}>Bookmarks-Specific Folder</option>

          <option onclick={() => goto('/facility1')}>Facility Info Page</option>
          <option onclick={() => goto('/facility1/divisions')}>Facility Divisions Page</option>
          <option onclick={() => goto('/facility1/services')}>Facility Services Page</option>
        </select>
      </li>

      <li>
        <select class="block p-4" value="Facility Pages">
          <option onclick={() => goto('/facility')}>Sign In</option>
          <option onclick={() => goto('/facility/1/dashboard')}>Dashboard</option>
        </select>
      </li>
    </ul>
  </nav>
</header>