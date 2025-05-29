<script lang="ts">
	import SadFace from '$lib/icons/SadFace.svelte';
</script>

<div class="flex items-center justify-center h-full w-full">
	<div class="text-center">
		<SadFace class="text-primary-800 h-22 w-22 mx-auto" />

		<div class="flex flex-col gap-2 mt-4">
			<h3 class="text-primary-800 text-2xl font-black tracking-tight leading-loose font-['DM_Sans']">
				No Search Results
			</h3>
			<p class="text-neutral-900 text-sm font-normal leading-tight tracking-tight font-['Inter']">
				Please try a different query.
			</p>
		</div>
	</div>
</div>
