<script lang="ts">
	import type { FormItemState, FormItemConfig } from "./index";
	export let formState: FormItemState;
	export let formConfig: FormItemConfig;
</script>

<div
	class="form-item-wrapper"
	class:has-error={formState.error}
	class:disabled={formConfig.disabled}
>
	<div class="form-item-label">
		{#if formConfig.required}
			<span class="required-mark">*</span>
		{/if}
		<label for={formConfig.name}>{formConfig.label}</label>
	</div>

	<div class="form-item-control">
		<slot></slot>
	</div>

	{#if formState.error && formState.touched}
		<div class="form-item-error">
			{formState.error}
		</div>
	{/if}

	{#if formState.validating}
		<div class="form-item-validating">验证中...</div>
	{/if}
</div>

<style>
	.form-item-wrapper {
		margin-bottom: 24px;
		transition: all 0.3s ease;
	}

	.form-item-label {
		margin-bottom: 8px;
		font-size: 14px;
		font-weight: 500;
		color: #333;
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.required-mark {
		color: #ff4d4f;
		font-size: 14px;
	}

	.form-item-control {
		position: relative;
	}

	.form-item-error {
		margin-top: 4px;
		font-size: 12px;
		color: #ff4d4f;
		animation: slideDown 0.3s ease;
	}

	.form-item-validating {
		margin-top: 4px;
		font-size: 12px;
		color: #1890ff;
	}

	.has-error .form-item-control :global(input),
	.has-error .form-item-control :global(select),
	.has-error .form-item-control :global(textarea) {
		border-color: #ff4d4f;
	}

	.disabled {
		opacity: 0.6;
		pointer-events: none;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
