<script lang="ts">
	import Expand from '$lib/icons/Expand.svelte';

	type Kind = 'service' | 'division';

    let {
        id, label, kind
    }: {
        id: string; label: string; kind: Kind;
    } = $props();
</script>

<!-- Why : ( )-->
<div
	class="flex w-full items-center justify-between rounded-2xl border border-neutral-300 bg-neutral-50 px-4 py-3 shadow-lg shadow-neutral-100"
>
	<p class="text-primary-900 text-base font-bold tracking-tight leading-normal font-['Inter'] truncate">
		{label}
	</p>

	<form method="POST" action="?/viewDetails" class="flex items-center">
		<input type="hidden" name={kind === 'service' ? 'serviceID' : 'divisionID'} value={id} />

		<input type="hidden" name={kind === 'service' ? 'serviceType' : 'divisionName'} value={label} />

		<button type="submit" class="text-neutral-900">
			<Expand class="h-7 w-7 transition-colors duration-300 hover:text-neutral-700 active:text-neutral-700" />
		</button>
	</form>
</div>