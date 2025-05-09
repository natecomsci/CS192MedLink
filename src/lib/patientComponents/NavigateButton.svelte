<script lang="ts">
    import ArrowR from "$lib/icons/ArrowR.svelte";

    let {
        text, href
    }: {
        text: string; href?: string;
    } = $props();
</script>

<a
	{href}
	class="
            flex items-center justify-center gap-2
            bg-background
            hover:shadow-primary-100
            active:shadow-primary-100
            text-primary-600
            text-base font-bold tracking-tight leading-loose font-['Inter'] text-center
            h-12 w-fit px-5 py-3
            rounded-full 
            border-2 border-primary-300
            transition-shadow duration-300 ease-in-out
            hover:shadow-md active:shadow-md
        "
>
	{text}
	<ArrowR strokeWidth={8} />
</a>