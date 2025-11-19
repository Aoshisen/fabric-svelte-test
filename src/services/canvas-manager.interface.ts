// src/interfaces/canvas-manager.interface.ts
import type { Canvas, FabricObject } from "fabric";

export interface ICanvasManager {
  initialize(canvas: Canvas): void;
  getCanvas(): Canvas | null;
  addObject(object: FabricObject): void;
  addObjects(objects: FabricObject[]): void;
  removeObject(object: FabricObject): void;
  removeObjects(objects: FabricObject[]): void;
  getObjects(): FabricObject[];
  onObjectAdded(callback: (obj: FabricObject) => void): void;
  onObjectRemoved(callback: (obj: FabricObject) => void): void;
  onSelectionChanged(callback: (selected: FabricObject[]) => void): void;
  onObjectModified(callback: (obj: FabricObject) => void): void;
  onObjectMoving(callback: (obj: FabricObject) => void): void;
}