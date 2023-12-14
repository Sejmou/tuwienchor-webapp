<script>
	import '../app.css';
	import Navbar from './Navbar.svelte';
	import Footer from './Footer.svelte';
</script>

<div class="flex flex-col min-h-[100vh] bg-base-200">
	<Navbar />
	<main class="flex-1 flex flex-col p-4 w-full max-w-screen-lg mx-auto my-auto box-border">
		<slot />
	</main>
	<Footer />
</div>
