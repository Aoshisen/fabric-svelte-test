<script>
	// 表单项标题
	export let label = "";
	// 是否必填
	export let required = false;
	// 错误信息
	export let error = "";
	// 是否禁用
	export let disabled = false;
	// 描述信息
	export let help = "";
	// 表单项名称
	export let name = "";
</script>

<div
	class="form-item"
	class:form-item-error={error}
	class:form-item-disabled={disabled}
>
	{#if label}
		<div class="form-item-label">
			<label for={name}>{label}{required ? "*" : ""}</label>
		</div>
	{/if}

	<div class="form-item-wrapper">
		<slot></slot>

		{#if help}
			<div class="form-item-help">{help}</div>
		{/if}

		{#if error}
			<div class="form-item-error-message">{error}</div>
		{/if}
	</div>
</div>

<style>
	.form-item {
		margin-bottom: 24px;
		display: flex;
		flex-direction: column;
	}

	.form-item-label {
		display: flex;
		align-items: center;
		line-height: 1.5715;
		margin-bottom: 8px;
	}

	.form-item-label label {
		font-size: 14px;
		color: #000000d9;
	}

	.form-item-label label::after {
		content: ":";
		position: relative;
		top: -0.5px;
		margin: 0 8px 0 2px;
	}

	.form-item-wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.form-item-help {
		color: rgba(0, 0, 0, 0.45);
		font-size: 14px;
		line-height: 1.5715;
		margin-top: 4px;
	}

	.form-item-error-message {
		color: #ff4d4f;
		font-size: 14px;
		line-height: 1.5715;
		margin-top: 4px;
	}

	.form-item-error .form-item-label label {
		color: #ff4d4f;
	}

	.form-item-disabled .form-item-label label {
		color: rgba(0, 0, 0, 0.25);
	}
</style>
