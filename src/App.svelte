<script lang="ts" module>
	import Layout from "./components/layout.svelte";
	import Wrapper from "./components/wrapper.svelte";
	import { App_name } from "./const";
	import Canvas from "./libs/canvas.svelte";
	import Form from "./libs/form.svelte";
	import { container } from "./inversify.config";
	import { TYPES } from "./types";
	import type { ICanvasManager } from "./services/canvas-manager.interface";
	import type { IFormManager } from "./services/form-manager.interface";
	import { Rect, Circle } from "fabric";
	import { InputFormItem } from "./libs/form-item/input";
	import { onMount } from "svelte";
	import { get } from "lodash-es";
	import { default_state } from "./libs/form-item/base";
	import FormItemBaseWrapper from "./libs/form-item/base/form-item-base-wrapper.svelte";

	const rect = new Rect({
		left: 100,
		top: 100,
		fill: "red",
		width: 100,
		height: 100,
		selectable: true,
	});

	const circle = new Circle({
		left: 300,
		top: 100,
		radius: 50,
		fill: "blue",
		selectable: true,
	});
	const objects = [rect, circle];

	// 创建表单项
	const usernameInput = new InputFormItem({
		name: "username",
		label: "用户名",
		required: true,
		placeholder: "请输入用户名",
		minLength: 3,
		maxLength: 20,
	});

	const emailInput = new InputFormItem({
		name: "email",
		label: "邮箱",
		type: "email",
		required: true,
		placeholder: "请输入邮箱地址",
	});
	const items = [usernameInput, emailInput];
</script>

<script lang="ts">
	// 获取服务实例
	const canvasManager = container.get<ICanvasManager>(TYPES.CanvasManager);
	const formManager = container.get<IFormManager>(TYPES.FormManager);

	// 响应式表单项列表 - 从 FormManager 获取
	let form_items = $state(formManager.getFormItems());
	let form_container: HTMLElement;

	// Canvas 初始化
	const handleCanvasInit = (canvas: any) => {
		canvasManager.initialize(canvas);
		canvasManager.addObjects(objects);
		canvasManager.onObjectModified((val) => {
			console.log("object modified:", val);
		});
	};
	let form_values = $state({});
	let form_states = $state({});
	onMount(() => {
		if (!form_container) {
			return;
		}

		formManager.initialize(form_container);

		// 监听表单项添加/删除，更新响应式数组
		formManager.onFormItemAdded((formItem) => {
			form_items = formManager.getFormItems();
		});

		formManager.onFormItemRemoved(() => {
			form_items = formManager.getFormItems();
		});

		// 监听表单值变化
		formManager.onFormValuesChanged((values) => {
			// console.log("Form values changed:", values);
			form_values = values;
		});
		formManager.onFormSteateChanged((states) => {
			form_states = states;
			// console.log(form_states, get(form_states, "email"));
		});

		// 添加到 FormManager
		formManager.addFormItems(items);
	});
</script>

<Wrapper>
	<Layout>
		<h3 slot="header" style:text-align="center">{App_name}</h3>
		<Canvas slot="sidebar" onInit={handleCanvasInit} />
		<Form slot="content" bind:form_container>
			{#each form_items as item (item.getConfig().name)}
				{@const Component = item.getComponent()}
				{@const states = get(
					form_states,
					item.getConfig().name,
					default_state,
				)}
				<FormItemBaseWrapper
					formConfig={item.getConfig()}
					formState={states}
				>
					<Component {...item.getComponentProps()} />
				</FormItemBaseWrapper>
			{/each}
		</Form>
	</Layout>
</Wrapper>
