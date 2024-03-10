<script>
	import '../app.pcss';
	import Footer from './Footer.svelte';
</script>

<svelte:head>
	<title>Acapella Songs</title>
</svelte:head>

<div class="flex min-h-[100vh] flex-col">
	<main class="mx-0 my-auto box-border flex w-full flex-1 flex-col p-4">
		<slot />
	</main>
	<Footer />
</div>
