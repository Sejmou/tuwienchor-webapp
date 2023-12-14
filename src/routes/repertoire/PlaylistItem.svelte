<script lang="ts">
	export let songName: string;
	let hovered = false;

	function handleMouseEnter() {
		hovered = true;
	}

	function handleMouseLeave() {
		hovered = false;
	}
</script>

<li
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
	class="flex items-center justify-between hover:opacity-60 pt-2"
>
	<a href={`/repertoire/${songName}`}>
		<div class="flex items-center space-x-4">
			<div class="relative flex-shrink-0">
				{#if hovered}
					<div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							class="h-6 w-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 3l14 9-14 9V3z"
							/>
						</svg>
					</div>
				{:else}
					<div>{songName.substring(0, 2)}</div>
				{/if}
			</div>
			<div>
				<p class="font-medium">{songName.substring(2).replaceAll('_', ' ')}</p>
				<!-- <p class="text-gray-500">Artist Name 1</p> -->
			</div>
		</div>
	</a>
</li>
