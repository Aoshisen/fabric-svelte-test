<script lang="ts">
	import type { FormEventHandler } from "svelte/elements";
	import { get } from "lodash-es";

	// 使用 Svelte 5 的 $props 语法
	let {
		value = "",
		placeholder = "",
		disabled = false,
		readonly = false,
		type = "text",
		name = "",
		id = "",
		size = "default",
		variant = "outlined",
		fullWidth = false,
		error = false,
		success = false,
		// 事件回调函数
		onInput,
		onChange,
		onFocus,
		onBlur,
		onKeyDown,
		onEnter,
		...restProps
	} = $props();

	// 处理输入变化 - 使用回调函数方式
	const handleInput: FormEventHandler<HTMLInputElement> = (event) => {
		const value = get(event, "target.value", "");
		if (typeof onInput === "function") {
			onInput(value, event);
		}
	};

	const handleChange: FormEventHandler<HTMLInputElement> = (event) => {
		const value = get(event, "target.value", "");
		if (typeof onChange === "function") {
			onChange(value, event);
		}
	};

	const handleFocus: FormEventHandler<HTMLInputElement> = (event) => {
		if (typeof onFocus === "function") {
			onFocus(event);
		}
	};

	const handleBlur: FormEventHandler<HTMLInputElement> = (event) => {
		if (typeof onBlur === "function") {
			onBlur(event);
		}
	};

	const handleKeyDown: FormEventHandler<HTMLInputElement> = (event) => {
		const value = get(event, "target.value", "");
		const isEnter = get(event, "key") === "Enter";
		if (isEnter && typeof onEnter === "function") {
			onEnter(value, event);
		}

		if (typeof onKeyDown === "function") {
			onKeyDown(event);
		}
	};
</script>

<input
	{value}
	{placeholder}
	{disabled}
	{readonly}
	{type}
	{name}
	{id}
	class="input"
	class:input-small={size === "small"}
	class:input-default={size === "default"}
	class:input-large={size === "large"}
	class:input-outlined={variant === "outlined"}
	class:input-filled={variant === "filled"}
	class:input-standard={variant === "standard"}
	class:input-full-width={fullWidth}
	class:input-error={error}
	class:input-success={success}
	class:input-disabled={disabled}
	class:input-readonly={readonly}
	oninput={handleInput}
	onchange={handleChange}
	onfocus={handleFocus}
	onblur={handleBlur}
	onkeydown={handleKeyDown}
	{...restProps}
/>

<style>
	.input {
		font-family: inherit;
		box-sizing: border-box;
		border: 1px solid #d9d9d9;
		border-radius: 6px;
		transition: all 0.3s;
		outline: none;
		color: #000000d9;
	}

	.input:focus {
		border-color: #40a9ff;
		box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
	}

	.input::placeholder {
		color: #bfbfbf;
	}

	/* Size variants */
	.input-small {
		padding: 4px 11px;
		font-size: 12px;
		line-height: 1.5;
	}

	.input-default {
		padding: 6px 11px;
		font-size: 14px;
		line-height: 1.5715;
	}

	.input-large {
		padding: 8px 11px;
		font-size: 16px;
		line-height: 1.5;
	}

	/* Variant styles */
	.input-outlined {
		background: #fff;
	}

	.input-filled {
		background: #fafafa;
		border-color: #e8e8e8;
	}

	.input-filled:focus {
		background: #fff;
	}

	.input-standard {
		border-top: 0;
		border-left: 0;
		border-right: 0;
		border-radius: 0;
		background: transparent;
	}

	/* Full width */
	.input-full-width {
		width: 100%;
	}

	/* Status styles */
	.input-error {
		border-color: #ff4d4f;
	}

	.input-error:focus {
		border-color: #ff4d4f;
		box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
	}

	.input-success {
		border-color: #52c41a;
	}

	.input-success:focus {
		border-color: #52c41a;
		box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.2);
	}

	/* Disabled state */
	.input-disabled {
		background: #f5f5f5;
		color: rgba(0, 0, 0, 0.25);
		cursor: not-allowed;
	}

	.input-disabled:focus {
		box-shadow: none;
		border-color: #d9d9d9;
	}

	/* Readonly state */
	.input-readonly {
		background: #f5f5f5;
		cursor: default;
	}
</style>
