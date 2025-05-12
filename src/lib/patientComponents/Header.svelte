<script lang="ts">
    import ArrowL from "$lib/icons/ArrowL.svelte";
    import ValueX from "$lib/icons/ValueX.svelte";

    type Icon = 'Arrow' | 'X';

    let {
        text,
        icon
    }: {
        text: string;
        icon: Icon;
    } = $props();

    const svgClass =
        "h-10 w-10 transition-colors duration-300 ease-in-out hover:text-neutral-700 active:text-neutral-700";
</script>

<header class="relative flex h-20 items-center border-b border-neutral-200 bg-neutral-50">
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

    <h1 class="mx-auto text-primary-950 text-2xl font-bold leading-loose font-['DM_Sans']">
        {text}
    </h1>
</header>