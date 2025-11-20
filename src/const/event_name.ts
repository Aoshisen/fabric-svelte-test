// src/const/event_name.ts
import type { CanvasEvents } from "fabric";

/**
 * Canvas event names derived from Fabric.js's CanvasEvents type
 * This ensures type safety and automatically includes all available canvas events
 */
export type CanvasEventName = keyof CanvasEvents;