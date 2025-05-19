<script lang="ts">
	import Setting from '$lib/icons/Setting.svelte';

	let {
		query, onClick
	}: {
		query: string, onClick: () => void;
	} = $props();
</script>

<button
	type="button"
	onclick={onClick}
	disabled={query === ''}
	class={`flex flex-shrink-0 items-center justify-center bg-neutral-50 h-12 w-12 rounded-full border border-neutral-200 shadow-lg shadow-neutral-100 
		${query === '' ? 'cursor-not-allowed opacity-50' : ''}
	`}
>
	<div class="flex items-center justify-center h-full w-full">
		<Setting
			class="h-7 w-7 text-neutral-900 transition-colors duration-300 ease-in-out hover:text-neutral-700 active:text-neutral-700"
		/>
	</div>
</button>