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

	// 添加一些表单项
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
	const form_items = [usernameInput, emailInput];
</script>

<script lang="ts">
	// 获取服务实例
	const canvasManager = container.get<ICanvasManager>(TYPES.CanvasManager);
	const formManager = container.get<IFormManager>(TYPES.FormManager);

	// Canvas 初始化
	const handleCanvasInit = (canvas: any) => {
		canvasManager.initialize(canvas);
		canvasManager.addObjects(objects);
		canvasManager.onObjectModified((val) => {
			console.log("object modified:", val);
		});
	};

	// Form 初始化
	const handleFormInit = (container: HTMLElement) => {
		formManager.initialize(container);
		formManager.addFormItems(form_items);

		// 监听表单值变化
		formManager.onFormValuesChanged((values) => {
			console.log("Form values changed:", values);
		});
	};
</script>

<Wrapper>
	<Layout>
		<h3 slot="header" style:text-align="center">{App_name}</h3>
		<Canvas slot="sidebar" onInit={handleCanvasInit} />
		<Form slot="content" onInit={handleFormInit}>
			{#each form_items as item}
				{@const Component = item.getComponent()}
				<Component config={item.getConfig()} state={item.getState()} />
			{/each}
		</Form>
	</Layout>
</Wrapper>
