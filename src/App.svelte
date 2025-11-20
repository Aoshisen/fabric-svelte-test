<script lang="ts" module>
	import Layout from "./components/layout.svelte";
	import Wrapper from "./components/wrapper.svelte";
	import { App_name } from "./const";
	import Canvas from "./libs/canvas.svelte";
	import { container } from "./inversify.config";
	import { TYPES } from "./types";
	import type { ICanvasManager } from "./services/canvas-manager.interface";
	import { Rect, Circle } from "fabric";
	import Form from "./Form.svelte";

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
</script>

<script lang="ts">
	// 获取服务实例
	const canvasManager = container.get<ICanvasManager>(TYPES.CanvasManager);
	const handleCanvasInit = (canvas: any) => {
		canvasManager.initialize(canvas);
		canvasManager.addObjects(objects);
		canvasManager.onObjectModified((val) => {
			console.log("object modified:", val);
		});
	};
</script>

<Wrapper>
	<Layout>
		<h3 slot="header" style:text-align="center">{App_name}</h3>
		<Canvas slot="sidebar" onInit={handleCanvasInit} />
		<Form slot="content"></Form>
	</Layout>
</Wrapper>
