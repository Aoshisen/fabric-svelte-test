<script lang="ts">
	export let form_container: HTMLElement;
</script>

<div bind:this={form_container} class="form-container">
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
