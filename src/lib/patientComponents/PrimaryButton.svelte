<script lang="ts">
    let { 
        text, href, onClick, stretch = false 
    }: {
        text : string; href? : string; onClick? : () => void; stretch? : boolean;
    } = $props();

    const baseClass = `
        flex items-center justify-center 
        bg-primary-500 
        hover:bg-primary-700 
        active:bg-primary-700 
        text-neutral-50 
        text-sm font-bold tracking-tight leading-loose font-['Inter'] text-center
        h-12 px-5 py-3 
        rounded-full 
        transition-colors duration-300 ease-in-out 
        ${stretch ? 'flex-1' : 'w-fit'}
    `;
</script>

{#if href}
    <a href={href} class="{baseClass}">
        {text}
    </a>
{:else}
    <button onclick={onClick} class={baseClass}>
        {text}
    </button>
{/if}