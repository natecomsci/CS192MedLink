<script lang="ts">
	import Expand from '$lib/icons/Expand.svelte';

	let {
		facilityName, facilityID, serviceID, serviceType
	}: {
		facilityName: string; facilityID: string; serviceID: string; serviceType: string;
	} = $props();
</script>

<!-- Why : ( )-->
<div
	class="flex flex-col gap-2 bg-neutral-50 border border-neutral-300 rounded-2xl w-full px-4 py-3 shadow-lg shadow-neutral-100"
>
	<div class="flex w-full items-center justify-between">
		<p class="text-primary-900 text-base font-bold tracking-tight leading-normal font-['Inter'] truncate">
			{facilityName}
		</p>

		<form method="POST" action="?/viewDetails" class="flex items-center">
			<input type="hidden" name="facilityID" value={facilityID} />

			<input type="hidden" name="serviceID" value={serviceID} />

			<input type="hidden" name="serviceType" value={serviceType} />

			<button type="submit" class="text-neutral-900">
				<Expand class="h-7 w-7 transition-colors duration-300 hover:text-neutral-700 active:text-neutral-700" />
			</button>
		</form>
	</div>

	<hr class="border-neutral-200" />

	<p class="text-sm font-medium italic tracking-tight leading-tight font-['Inter']">
		{serviceType}
	</p>
</div>