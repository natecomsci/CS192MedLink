<script lang="ts">
	import Icon from '@iconify/svelte';

  let Settings = "mdi-light:settings"
  let Bookmarks = "mdi-light:bookmark"
  let { guest = true, id = undefined } = $props();
</script>


<!-- @elle, @paul, padesign -->
<header class="sticky top-0 z-10 w-full bg-brand shadow-md">
    <nav>
        <ul class="flex justify-center">
        		{#if !guest}
							<li>
	                <a 
	                    ><Icon icon={Settings} width="20" height="20" /></a
	                >
	            </li>
						{/if}
            
            <li>
                <a href="{guest ? "/" : '/patient/'+String(id)}">
                    MedLink
                </a>
            </li>

            {#if !guest}
							<li>
	                <a 
	                    ><Icon icon={Bookmarks} width="20" height="20" /></a
	                >
	            </li>
						{/if}

        </ul>
    </nav>
</header>

<!-- href="/patient/{id}/settings" -->
<!-- href="/patient/{id}/bookmarks" -->