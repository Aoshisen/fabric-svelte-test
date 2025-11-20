<script lang="ts">
	import { onMount } from "svelte";
	export let onInit: (container: HTMLElement) => void = () => {};

	let formContainer: HTMLElement;

	onMount(() => {
		onInit?.(formContainer);
	});
</script>

<div bind:this={formContainer} class="form-container">
	<slot></slot>
</div>

<style>
	.form-container {
		display: flex;
		flex-direction: column;
		gap: 16px;
		width: 100%;
		min-height: 100px;
	}
</style>
