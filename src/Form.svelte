<script lang="ts">
	import { InputFormItem } from "./libs/form-item/input";
	import FormItemWrapper from "./libs/form-item/base/form-item-base-wrapper.svelte";

	// 创建用户名输入框
	const usernameInput = new InputFormItem({
		name: "username",
		label: "用户名",
		required: true,
		placeholder: "请输入用户名",
		minLength: 3,
		maxLength: 20,
		validators: [
			(value: string) => {
				if (value && !/^[a-zA-Z0-9_]+$/.test(value)) {
					return "用户名只能包含字母、数字和下划线";
				}
				return null;
			},
		],
	});

	// 创建邮箱输入框
	const emailInput = new InputFormItem({
		name: "email",
		label: "邮箱",
		type: "email",
		required: true,
		placeholder: "请输入邮箱地址",
	});

	// 创建密码输入框
	const passwordInput = new InputFormItem({
		name: "password",
		label: "密码",
		type: "password",
		required: true,
		placeholder: "请输入密码",
		minLength: 6,
		maxLength: 20,
	});

	// 处理表单提交
	async function handleSubmit() {
		const isUsernameValid = await usernameInput.validate();
		const isEmailValid = await emailInput.validate();
		const isPasswordValid = await passwordInput.validate();

		if (isUsernameValid && isEmailValid && isPasswordValid) {
			console.log("表单验证通过！");
			console.log({
				username: usernameInput.getValue(),
				email: emailInput.getValue(),
				password: passwordInput.getValue(),
			});
			alert("表单提交成功！");
		} else {
			console.log("表单验证失败");
		}
	}

	// 处理重置
	function handleReset() {
		usernameInput.reset();
		emailInput.reset();
		passwordInput.reset();
	}
</script>

<div class="demo-container">
	<h1>Input 表单组件示例</h1>

	<form class="demo-form" on:submit|preventDefault={handleSubmit}>
		<FormItemWrapper formItem={usernameInput} />
		<FormItemWrapper formItem={emailInput} />
		<FormItemWrapper formItem={passwordInput} />

		<div class="form-actions">
			<button type="submit" class="btn btn-primary">提交</button>
			<button
				type="button"
				class="btn btn-default"
				on:click={handleReset}
			>
				重置
			</button>
		</div>
	</form>
</div>

<style>
	.demo-container {
		max-width: 600px;
		margin: 40px auto;
		padding: 24px;
		background: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	h1 {
		margin: 0 0 24px;
		font-size: 24px;
		font-weight: 600;
		color: #333;
	}

	.demo-form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.form-actions {
		display: flex;
		gap: 12px;
		margin-top: 8px;
	}

	.btn {
		padding: 8px 16px;
		font-size: 14px;
		border-radius: 4px;
		border: 1px solid transparent;
		cursor: pointer;
		transition: all 0.3s ease;
		outline: none;
	}

	.btn-primary {
		background-color: #1890ff;
		color: #fff;
		border-color: #1890ff;
	}

	.btn-primary:hover {
		background-color: #40a9ff;
		border-color: #40a9ff;
	}

	.btn-primary:active {
		background-color: #096dd9;
		border-color: #096dd9;
	}

	.btn-default {
		background-color: #fff;
		color: #333;
		border-color: #d9d9d9;
	}

	.btn-default:hover {
		color: #40a9ff;
		border-color: #40a9ff;
	}

	.btn-default:active {
		color: #096dd9;
		border-color: #096dd9;
	}
</style>
