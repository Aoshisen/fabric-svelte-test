<script lang="ts" module>
	import { onMount, onDestroy } from "svelte";
	import { Canvas } from "fabric";

</script>

<script lang="ts">
	let canvasElement: HTMLCanvasElement;
	let canvas: Canvas;
	let container: HTMLDivElement;
	export let onInit: (canvas: Canvas) => void = () => {};

	// 使用新方法调整画布大小
	function resizeCanvas() {
		if (canvas && container) {
			const containerRect = container.getBoundingClientRect();
			// 使用新的setSize方法替代已废弃的setWidth和setHeight
			canvas.setDimensions({
				width: containerRect.width,
				height: containerRect.height,
			});
			canvas.renderAll();
		}
	}

	onMount(() => {
		// 初始化画布
		canvas = new Canvas(canvasElement, {
			width: container?.clientWidth || 800,
			height: container?.clientHeight || 600,
			backgroundColor: "#f0f0f0",
		});

		// 初始调整大小
		resizeCanvas();
		// 抛出init事件，传出canvas实例
		onInit?.(canvas);
	});

	onDestroy(() => {
		if (canvas) {
			canvas.dispose();
		}
	});
</script>

<!-- 使用svelte:window来托管resize事件 -->
<svelte:window on:resize={resizeCanvas} />

<div bind:this={container} class="canvas-container">
	<canvas bind:this={canvasElement}></canvas>
</div>

<style>
	.canvas-container {
		width: 100%;
		height: 100%;
		position: relative;
	}

	canvas {
		border: 1px solid #ccc;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
		width: 100%;
		height: 100%;
		display: block;
	}
</style>
