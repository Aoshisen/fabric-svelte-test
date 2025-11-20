<script lang="ts">
	import type { FormItemConfig, FormItemState } from "../base";

	interface Props {
		config: FormItemConfig;
		state: FormItemState;
		onChange: (value: string) => void;
		onBlur: () => void;
		type?: string;
		maxLength?: number;
		minLength?: number;
	}

	let {
		config,
		state,
		onChange,
		onBlur,
		type = "text",
		maxLength,
		minLength,
	}: Props = $props();

	// 处理输入变化
	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		onChange(target.value);
	}

	// 处理失焦
	function handleBlur() {
		onBlur();
	}
</script>

<input
	id={config.name}
	{type}
	value={state.value || ""}
	placeholder={config.placeholder}
	disabled={config.disabled}
	maxlength={maxLength}
	minlength={minLength}
	class="form-input"
	class:error={state.error && state.touched}
	oninput={handleInput}
	onblur={handleBlur}
/>

<style>
	.form-input {
		width: 100%;
		padding: 8px 12px;
		font-size: 14px;
		line-height: 1.5;
		color: #333;
		background-color: #fff;
		border: 1px solid #d9d9d9;
		border-radius: 4px;
		transition: all 0.3s ease;
		outline: none;
	}

	.form-input:hover:not(:disabled) {
		border-color: #40a9ff;
	}

	.form-input:focus {
		border-color: #40a9ff;
		box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
	}

	.form-input.error {
		border-color: #ff4d4f;
	}

	.form-input.error:focus {
		box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
	}

	.form-input:disabled {
		background-color: #f5f5f5;
		cursor: not-allowed;
		color: rgba(0, 0, 0, 0.25);
	}

	.form-input::placeholder {
		color: #bfbfbf;
	}
</style>
