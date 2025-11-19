// src/services/canvas-manager.ts
import type { Canvas, FabricObject } from "fabric";
import type { ICanvasManager } from "./canvas-manager.interface";
import { injectable } from 'inversify';

@injectable()
export class CanvasManager implements ICanvasManager {
	private canvas: Canvas | null = null;
	private objectAddedCallbacks: Array<(obj: FabricObject) => void> = [];
	private objectRemovedCallbacks: Array<(obj: FabricObject) => void> = [];
	private selectionChangedCallbacks: Array<(selected: FabricObject[]) => void> = [];
	// 添加对象移动回调数组
	private objectMovingCallbacks: Array<(obj: FabricObject) => void> = [];
	private objectModifiedCallback: Array<(obj: FabricObject) => void> = [];

	public initialize(canvas: Canvas): void {
		this.canvas = canvas;
		this.setupEventListeners();
	}

	private setupEventListeners(): void {
		if (!this.canvas) return;

		this.canvas.on("object:added", (options: any) => {
			const obj = options.target;
			if (obj) {
				this.objectAddedCallbacks.forEach((callback) => callback(obj));
			}
		});

		this.canvas.on("object:removed", (options: any) => {
			const obj = options.target;
			if (obj) {
				this.objectRemovedCallbacks.forEach((callback) => callback(obj));
			}
		});

		this.canvas.on("selection:created", () => {
			const activeObjects = this.canvas!.getActiveObjects();
			this.selectionChangedCallbacks.forEach((callback) =>
				callback(activeObjects),
			);
		});

		this.canvas.on("selection:updated", () => {
			const activeObjects = this.canvas!.getActiveObjects();
			this.selectionChangedCallbacks.forEach((callback) =>
				callback(activeObjects),
			);
		});

		this.canvas.on("selection:cleared", () => {
			this.selectionChangedCallbacks.forEach((callback) => callback([]));
		});

		// 添加对象移动事件监听
		this.canvas.on("object:moving", (options: any) => {
			const obj = options.target;
			if (obj) {
				this.objectMovingCallbacks.forEach((callback) => callback(obj));
			}
		});

		// 添加对象移动结束事件监听
		this.canvas.on("object:modified", (options: any) => {
			const obj = options.target;
			if (obj) {
				this.objectModifiedCallback.forEach((callback) => callback(obj));
			}
		});
	}

	public getCanvas(): Canvas | null {
		return this.canvas;
	}

	public addObject(object: FabricObject): void {
		if (this.canvas) {
			this.canvas.add(object);
		}
	}

	public removeObject(object: FabricObject): void {
		if (this.canvas) {
			this.canvas.remove(object);
		}
	}
	public addObjects(objects: FabricObject[]): void {
		if (this.canvas) {
			this.canvas.add(...objects);
		}
	}
	removeObjects(objects: FabricObject[]): void {
		if (this.canvas) {
			this.canvas.remove(...objects);
		}
	}

	public getObjects(): FabricObject[] {
		return this.canvas ? this.canvas.getObjects() : [];
	}

	public onObjectAdded(callback: (obj: FabricObject) => void): void {
		this.objectAddedCallbacks.push(callback);
	}

	public onObjectRemoved(callback: (obj: FabricObject) => void): void {
		this.objectRemovedCallbacks.push(callback);
	}

	public onSelectionChanged(callback: (selected: FabricObject[]) => void): void {
		this.selectionChangedCallbacks.push(callback);
	}

	// 添加对象移动事件订阅方法
	public onObjectMoving(callback: (obj: FabricObject) => void): void {
		this.objectMovingCallbacks.push(callback);
	}

	// 添加对象移动完成事件订阅方法
	public onObjectModified(callback: (obj: FabricObject) => void): void {
		this.objectModifiedCallback.push(callback);
	}
}