<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="navbar bg-base-100">
	<div>
		<div class="dropdown">
			<label tabindex="0" class="btn btn-ghost lg:hidden">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h8m-8 6h16"
					/></svg
				>
			</label>
			<ul
				tabindex="0"
				class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
			>
				<li>
					<a
						href="/repertoire"
						class={$page.url.pathname == '/repertoire'
							? 'text-black dark:text-white'
							: 'text-gray-500'}>Repertoire</a
					>
				</li>
				<!-- Add more subpages here as needed (make sure to add in other list as well!) -->
			</ul>
		</div>
		<a href="/" class="btn btn-ghost normal-case text-xl">TU Chor Webapp</a>
	</div>
	<div class="hidden lg:flex">
		<ul class="menu menu-horizontal px-1">
			<li>
				<a
					href="/repertoire"
					class={$page.url.pathname == '/repertoire'
						? 'text-black dark:text-white'
						: 'text-gray-500'}>Repertoire</a
				>
			</li>
			<!-- Add more subpages here as needed (make sure to add in other list as well!) -->
		</ul>
	</div>
</div>
