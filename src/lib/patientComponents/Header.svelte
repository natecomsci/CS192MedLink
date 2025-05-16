<script lang="ts">
    import ArrowL from "$lib/icons/ArrowL.svelte";
    import ValueX from "$lib/icons/ValueX.svelte";

    type Icon = 'Arrow' | 'X';

    let {
        text,
        icon,
        href,
    }: {
        text: string; icon: Icon; href?: string;
    } = $props();

    const svgClass =
        "h-8 w-8 transition-colors duration-300 ease-in-out hover:text-neutral-700 active:text-neutral-700";
</script>

<header class="sticky top-0 flex items-center h-20 border-b border-neutral-200 bg-neutral-50">
    {#if href}
        <a
            {href}
            class="absolute left-6 text-neutral-900"
        >
            {#if icon === "Arrow"}
                <ArrowL class={svgClass} />
            {:else}
                <ValueX class={svgClass} />
            {/if}
        </a>
    {:else}
        <button
            type="button"
            onclick={() => window.history.length > 1 && window.history.back()}
            class="absolute left-6 text-neutral-900"
        >
            {#if icon === "Arrow"}
                <ArrowL class={svgClass} />
            {:else}
                <ValueX class={svgClass} />
            {/if}
        </button>
    {/if}

    <h1 class="mx-auto text-primary-950 text-2xl font-bold leading-loose font-['DM_Sans']">
        {text}
    </h1>
</header>