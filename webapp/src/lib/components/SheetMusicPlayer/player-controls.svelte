<script lang="ts">
	import { Play, Pause } from 'lucide-svelte';
	import type { Player } from '.';
	import { Button } from '$lib/components/ui/button';

	export let player: Player;
	const { playing, handlePlayPause } = player;
</script>

<Button on:click={handlePlayPause}>
	{#if $playing}
		<Pause />
	{:else}
		<Play />
	{/if}
</Button>
