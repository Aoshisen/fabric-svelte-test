<script lang="ts">
	export let form_container: HTMLFormElement;
</script>

<form bind:this={form_container} class="form-container">
	<slot></slot>
</form>

<style>
	.form-container {
		display: flex;
		flex-direction: column;
		gap: 16px;
		min-height: 100px;
		padding: 10px;
	}
</style>
