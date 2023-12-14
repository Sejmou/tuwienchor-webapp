<script lang="ts">
	import PlaylistItem from './PlaylistItem.svelte';

	export let data;
</script>

<main>
	<ul class="list-disc pl-4">
		{#each data.songs as songName}
			<PlaylistItem {songName} />
		{/each}
	</ul>
</main>
