<script lang="ts">
	let {
		options, selectedOption = $bindable()
	}: {
		options: string[]; selectedOption: string;
	} = $props();

	function toggleOption(option: string) {
		selectedOption = selectedOption === option ? '' : option;
	}
</script>

<div class="flex items-center justify-start">
	<div
		class="flex flex-wrap sm:flex-nowrap bg-neutral-50 border border-neutral-400 divide-x divide-neutral-400 rounded-full overflow-hidden"
	>
		{#each options as option, i}
			<button
				type="button"
				onclick={() => toggleOption(option)}
				class={`
					flex min-w-0 flex-shrink-0 items-center justify-center px-4 py-2 font-['Inter'] text-sm font-medium tracking-tight leading-tight transition-colors duration-300 ease-in-out
				
					${selectedOption === option ? 'bg-primary-100 text-primary-600' : 'text-neutral-950'}
				
					${i === 0 ? 'rounded-l-full' : ''}
					${i === options.length - 1 ? 'rounded-r-full' : ''}
				`}				
			>
				{option}
			</button>
		{/each}
	</div>
</div>
