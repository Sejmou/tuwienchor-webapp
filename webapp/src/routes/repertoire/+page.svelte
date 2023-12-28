<script lang="ts">
	import PlaylistItem from './PlaylistItem.svelte';

	export let data;
</script>

<svelte:head>
	<title>TU Wien Chor Repertoire</title>
</svelte:head>

<main>
	<ul class="list-disc pl-4">
		{#each data.songs as songName}
			<PlaylistItem {songName} />
		{/each}
	</ul>
</main>
