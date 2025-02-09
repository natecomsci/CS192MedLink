<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

	import Icon from '@iconify/svelte';

  let Back = "mdi-light:back"
  let Filter = "mingcute:settings-6-line"

	let { search, guest } = $props();
</script>

<!-- @elle, @paul: padesign -->
<div class="grid grid-cols-3 gap-8 sm:gap-6">
	<div>
		<Icon icon={Back} width="20" height="20" />
	</div>
	
	<div>
		<input placeholder="Search" />
	</div>

	<div>		
		<button onclick={() => filterOn = !filterOn}>
			<Icon icon={Filter} width="20" height="20" />
		</button>
	</div>
</div>