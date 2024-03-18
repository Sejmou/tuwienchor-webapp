<script lang="ts">
	import { PlayerControls, createSheetMusicPlayer } from '.';
	let container: HTMLDivElement;
	export let musicXml: string;
</script>

<!-- score is rendered by OpenSheetMusicDisplay into div below! -->
<div class="fixed bottom-10 left-0 z-50 flex h-16 w-full items-center justify-center">
	{#await createSheetMusicPlayer(musicXml, container)}
		<div class="rounded border bg-background p-4 text-muted-foreground">Loading player...</div>
	{:then player}
		<PlayerControls {player} />
	{:catch error}
		<p>Error loading score: {error.message}</p>
	{/await}
</div>
<div class="w-[95vw] overflow-x-auto">
	<div class="w-full" bind:this={container} />
</div>
