import type { Canvas as FabricCanvas, FabricObject } from "fabric";
import { injectable } from 'inversify';

import mitt from "mitt";

enum EventName {
	CanvasReady = 'canvas:ready',
}

@injectable()
export class Canvas {
	#canvas: FabricCanvas | null = null;
	#objectAddedCallbacks: Array<(obj: FabricObject) => void> = [];
	#objectRemovedCallbacks: Array<(obj: FabricObject) => void> = [];
	#selectionChangedCallbacks: Array<(selected: FabricObject[]) => void> = [];
	#objectMovingCallbacks: Array<(obj: FabricObject) => void> = [];
	#objectModifiedCallback: Array<(obj: FabricObject) => void> = [];
	#onReadyCallbacks: Array<(canvas: Canvas) => void> = [];
	#emitter = mitt();

	initialize(canvas: FabricCanvas): void {
		this.#canvas = canvas;
		this.#setupEventListeners();
		this.#emitter.emit(EventName.CanvasReady, this);
	}

	onReady(callback: (e: Canvas) => void) {
		this.#onReadyCallbacks.push(callback);
	}

	#setupEventListeners(): void {
		if (!this.#canvas) return;

		//NOTE: 添加 canvas:ready 事件监听
		this.#emitter.on(EventName.CanvasReady, () => this.#onReadyCallbacks.forEach(callback => callback(this)));

		//NOTE: 添加对象添加事件监听
		this.#canvas.on('object:added', (options: any) => {
			const obj = options.target;
			if (obj) {
				this.#objectAddedCallbacks.forEach((callback) => callback(obj));
			}
		});

		//NOTE: 添加对象移除事件监听
		this.#canvas.on('object:removed', (options: any) => {
			const obj = options.target;
			if (obj) {
				this.#objectRemovedCallbacks.forEach((callback) => callback(obj));
			}
		});

		//NOTE: 添加对象选择事件监听
		this.#canvas.on('selection:created', () => {
			const activeObjects = this.#canvas!.getActiveObjects();
			this.#selectionChangedCallbacks.forEach((callback) =>
				callback(activeObjects),
			);
		});

		//NOTE: 添加对象选择更新事件监听
		this.#canvas.on('selection:updated', () => {
			const activeObjects = this.#canvas!.getActiveObjects();
			this.#selectionChangedCallbacks.forEach((callback) =>
				callback(activeObjects),
			);
		});

		//NOTE: 添加对象选择清除事件监听
		this.#canvas.on('selection:cleared', () => {
			this.#selectionChangedCallbacks.forEach((callback) => callback([]));
		});

		//NOTE: 添加对象移动事件监听
		this.#canvas.on('object:moving', (options: any) => {
			const obj = options.target;
			if (obj) {
				this.#objectMovingCallbacks.forEach((callback) => callback(obj));
			}
		});

		//NOTE: 添加对象移动结束事件监听
		this.#canvas.on('object:modified', (options: any) => {
			const obj = options.target;
			if (obj) {
				this.#objectModifiedCallback.forEach((callback) => callback(obj));
			}
		});
	}

	getCanvas(): FabricCanvas | null {
		return this.#canvas;
	}

	addObject(object: FabricObject): void {
		if (this.#canvas) {
			this.#canvas.add(object);
		}
	}

	removeObject(object: FabricObject): void {
		if (this.#canvas) {
			this.#canvas.remove(object);
		}
	}

	addObjects(objects: FabricObject[]): void {
		if (this.#canvas) {
			this.#canvas.add(...objects);
		}
	}

	removeObjects(objects: FabricObject[]): void {
		if (this.#canvas) {
			this.#canvas.remove(...objects);
		}
	}

	getObjects(): FabricObject[] {
		return this.#canvas ? this.#canvas.getObjects() : [];
	}

	onObjectAdded(callback: (obj: FabricObject) => void): void {
		this.#objectAddedCallbacks.push(callback);
	}

	onObjectRemoved(callback: (obj: FabricObject) => void): void {
		this.#objectRemovedCallbacks.push(callback);
	}

	onSelectionChanged(callback: (selected: FabricObject[]) => void): void {
		this.#selectionChangedCallbacks.push(callback);
	}

	onObjectMoving(callback: (obj: FabricObject) => void): void {
		this.#objectMovingCallbacks.push(callback);
	}

	onObjectModified(callback: (obj: FabricObject) => void): void {
		this.#objectModifiedCallback.push(callback);
	}
}