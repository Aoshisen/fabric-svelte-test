<script lang="ts" module>
	import Layout from "./components/layout.svelte";
	import Wrapper from "./components/wrapper.svelte";
	import { App_name, objects } from "./const";
	import Canvas from "./libs/canvas.svelte";
	import Form from "./libs/form.svelte";
	import { container, TYPES } from "./inversify.config";
	import type { Canvas as CanvasManager } from "./services/canvas.js";
	import { EventName, type Form as FormManager } from "./services/form.js";
	import FormItem from "./components/form-item.svelte";
	import Input from "./components/input.svelte";
	import { partialRight } from "lodash-es";
	import { onMount } from "svelte";
	import type { Controller } from "./services/controller";
</script>

<script lang="ts">
	// 获取服务实例
	const canvasManager = container.get<CanvasManager>(TYPES.Canvas);

	let form_container: any = $state(null);
	let formManager = container.get<FormManager>(TYPES.Form);
	let controller = container.get<Controller>(TYPES.Controller);

	// Canvas 初始化
	const handleCanvasInit = (canvas: any) => {
		canvasManager.initialize(canvas);
	};

	const handleChange = (val: string, event: any, id: string) => {
		formManager.emitter.emit(EventName.FormChange, { key: id, value: val });
	};

	onMount(() => {
		canvasManager.onReady((canvasManager) => {
			canvasManager.addObjects(objects);
			controller.initialize(canvasManager, formManager);
			controller.run();
		});
	});
</script>

<Wrapper>
	<Layout>
		<h3 slot="header" style:text-align="center">{App_name}</h3>
		<Canvas slot="sidebar" onInit={handleCanvasInit} />
		<Form slot="content" bind:form_container>
			<FormItem>
				<Input onChange={partialRight(handleChange, "name")} />
			</FormItem>
		</Form>
	</Layout>
</Wrapper>
