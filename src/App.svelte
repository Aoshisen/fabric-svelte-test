<script lang="ts" module>
	import Layout from "./components/layout.svelte";
	import Wrapper from "./components/wrapper.svelte";
	import { App_name, objects } from "./const";
	import Canvas from "./libs/canvas.svelte";
	import Form from "./libs/form.svelte";
	import container from "./inversify.config";
	import { Canvas as CanvasManager } from "./services/canvas.js";
	import { EventName, Form as FormManager } from "./services/form.js";
	import FormItem from "./components/form-item.svelte";
	import Input from "./components/input.svelte";
	import { partialRight } from "lodash-es";
	import { onMount } from "svelte";
	import { Controller as ControllerManager } from "./services/controller";
</script>

<script lang="ts">
	// 获取服务实例
	const canvasManager = container.get<CanvasManager>(CanvasManager);
	let formManager = container.get<FormManager>(FormManager);
	let controller = container.get<ControllerManager>(ControllerManager);

	let form_container: any = $state(null);
	let is_canvasManager_ready: boolean = $state(false);
	let is_formManager_ready: boolean = $state(false);
	// 使用 derive 创建派生状态，在两个组件都初始化完成后初始化 controller
	let all_ready = $derived(
		//@ts-ignore
		is_canvasManager_ready === true && is_formManager_ready === true,
	);

	const handleCanvasInit = (canvas: any) => {
		canvasManager.initialize(canvas);
	};

	const handleFormItemChange = (val: string, event: any, id: string) => {
		formManager.emitter.emit(EventName.FormChange, { key: id, value: val });
	};

	canvasManager.onReady((canvasManager) => {
		canvasManager.addObjects(objects);
		is_canvasManager_ready = true;
	});

	formManager.onReady((form) => {
		is_formManager_ready = true;
	});

	$effect(() => {
		if (!all_ready) {
			return;
		}

		//NOTE: 在表单和canvas都挂载好后在进行controller的初始化
		controller.initialize(canvasManager, formManager);
		controller.run();
	});

	onMount(() => {
		formManager.initialize(form_container!);
	});
</script>

<Wrapper>
	<Layout>
		<h3 slot="header" style:text-align="center">{App_name}</h3>
		<Canvas slot="sidebar" onInit={handleCanvasInit} />
		<Form slot="content" bind:form_container>
			<FormItem>
				<Input onChange={partialRight(handleFormItemChange, "name")} />
			</FormItem>
			<FormItem>
				<Input onChange={partialRight(handleFormItemChange, "font")} />
			</FormItem>
			<FormItem>
				<Input onChange={partialRight(handleFormItemChange, "image")} />
			</FormItem>
		</Form>
	</Layout>
</Wrapper>
