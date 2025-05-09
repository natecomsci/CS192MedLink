<script lang="ts">
	import ChevronD from '$lib/icons/ChevronD.svelte';

	let {
		label, items, selectedItems = $bindable(), opensUp = false
	}: {
		label: string; items: string[]; selectedItems: string[]; opensUp?: boolean;
	} = $props();

	let isOpen: boolean = $state(false);

	function selectItem(item: string): void {
		selectedItems = selectedItems.includes(item) ? selectedItems.filter((i) => i !== item) : [...selectedItems, item];
	}

	// dropdown open / close handler

	export function clickOutside(node: Node, callback: (event: Event) => void): { destroy(): void } {
		const handle = (event: Event) => {
			if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
				callback(event);
			}
		};

		document.addEventListener("click", handle);

		return {
			destroy() {
				document.removeEventListener("click", handle);
			}
		};
	}
</script>

<div class="relative w-full" use:clickOutside={() => (isOpen = false)}>
	<!-- Dropdown Dropdown -->
	<button
		type="button"
		onclick={() => (isOpen = !isOpen)}
		class={
			`flex h-12 w-full items-center justify-between gap-2 bg-neutral-50 px-4 py-3 rounded-2xl border border-neutral-200
			${isOpen ? 'ring-2 ring-neutral-900' : ''}
		`}
	>
		<div
			class="flex-1 text-left text-neutral-400 text-md font-medium tracking-tight leading-tight font-['Inter'] truncate"
		>
			{selectedItems.length > 0 ? selectedItems.join(', ') : label}
		</div>

		<ChevronD
			class={
				`h-7 w-7 text-neutral-900 transition-transform duration-300 ease-in-out 
				${isOpen ? 'rotate-180' : ''}`
			}
		/>
	</button>

	<!-- Dropdown Options -->
	{#if isOpen}
		<div
			class={
				`absolute z-10 bg-background w-full rounded-2xl border border-neutral-200 shadow-lg shadow-neutral-500 overflow-hidden 
				${opensUp ? 'bottom-full mb-2' : 'top-full mt-2'}`
			}
		>
			<ul
				class="text-sm font-normal leading-tight tracking-tight font-['Inter'] max-h-60 py-2 overflow-y-auto"
			>
				{#each items as item}
					<li
						class="flex items-center gap-2 px-4 py-2 text-neutral-900 hover:bg-neutral-100 sm:gap-3"
					>
						<input
							type="checkbox"
							id={item}
							checked={selectedItems.includes(item)}
							onchange={() => selectItem(item)}
							class="checked:bg-primary-500 checked:border-primary-500 focus:ring-primary-50 h-5 w-5 cursor-pointer appearance-none rounded border border-neutral-300 shadow shadow-neutral-100 hover:shadow-md transition-all focus:ring focus:outline-none"
						/>
						<label for={item} class="cursor-pointer">{item}</label>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
