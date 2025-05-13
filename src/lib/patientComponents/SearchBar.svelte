<script lang="ts">
	import { enhance } from "$app/forms";

	import Search from "$lib/icons/Search.svelte";
	import ValueX from "$lib/icons/ValueX.svelte";
	import ArrowL from "$lib/icons/ArrowL.svelte";

	type State = 'default' | 'error' | 'result';

	let {
		propState = "default", query = $bindable(), placeholder
	}: {
		propState?: State; query: string; placeholder: string;
	} = $props();

	let currentState: State = $state(propState);

	const svgClass: string =
		'h-7 w-7 transition-colors duration-300 ease-in-out hover:text-neutral-700 active:text-neutral-700';

	const handleSubmit = (event: SubmitEvent) => {
		if (!query.trim()) {
			event.preventDefault();

			currentState = 'error';
		}
	};

	$effect(() => {
		if (currentState === 'error' && query.trim() !== '') {
			currentState = propState;
		}
	});
</script>

<form method="POST" action="?/search" use:enhance onsubmit={handleSubmit} class="w-full flex">
	<div
		class="flex items-center gap-2 bg-neutral-50 h-12 w-full px-5 py-3 rounded-full border border-neutral-200 shadow-lg shadow-neutral-100 focus-within:ring-2 focus-within:ring-neutral-900"
	>
		{#if currentState === 'result'}
			<button
				type="button"
				onclick={() => window.history.length > 1 && window.history.back()}
				class="text-neutral-900"
			>
				<ArrowL class={svgClass} />
			</button>
		{:else}
			<button type="submit" class="text-neutral-900">
				<Search class={svgClass} />
			</button>
		{/if}

		<div class="h-6 w-px bg-neutral-400"></div>

		<input
			type="text"
			name="query"
			bind:value={query}
			placeholder={currentState === 'error' ? 'Please enter a search query.' : placeholder}
			class="
				flex-1 bg-transparent pl-0 border-none outline-none min-w-0 focus:ring-0 text-sm font-normal tracking-tight leading-tight font-['Inter']
				${currentState === 'error' 
					? 'text-error-on placeholder-error-on' 
					: 'text-neutral-400 placeholder-neutral-400 focus:text-neutral-900'
				}
			"
		/>

		{#if query}
			<button
				type="button"
				onclick={() => (query = '')}
				class="flex-shrink-0 text-neutral-900"
			>
				<ValueX class={svgClass} />
			</button>
		{/if}
	</div>
</form>