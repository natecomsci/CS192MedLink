<script lang="ts">
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	import SadFace from '$lib/icons/SadFace.svelte';
	import PrimaryButton from '../PrimaryButton.svelte';

	const refreshPage = () => {
		window.location.reload();
	};


</script>

<!-- Overlay -->
<div
	in:fade={{ duration: 125 }}
	class="bg-primary-950/75 fixed inset-0 z-50 backdrop-blur-[2px]"
></div>

<!-- Pop Up -->
<div
	in:fade={{ duration: 300, easing: cubicOut }}
	class="fixed top-1/2 left-1/2 z-60 -translate-x-1/2 -translate-y-1/2 transform w-[90vw] max-w-sm px-6 py-8 flex flex-col items-center rounded-[54px] bg-background text-center shadow-xl shadow-neutral-800"
>
	<SadFace class="text-primary-800 h-22 w-22 mx-auto" />

	<div class="flex flex-col gap-2 mt-4">
		<h3 class="text-primary-800 text-2xl font-black tracking-tight leading-snug font-['DM_Sans']">
			No Database Connection
		</h3>

		<p class="text-neutral-900 text-sm font-normal leading-tight tracking-wide font-['Inter']">
			Please check your internet connection or
			<br />
			retry in a few moments.
		</p>
	</div>

	<div class="mt-6">
		<PrimaryButton text="Refresh Page" onClick={refreshPage} />
	</div>
</div>