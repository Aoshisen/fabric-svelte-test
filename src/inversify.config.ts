// src/inversify.config.ts
import { Container } from 'inversify';
import type { ICanvasManager } from './services/canvas-manager.interface';
import { CanvasManager } from './services/canvas-manager';
import "reflect-metadata"
import { TYPES } from './types';

const container = new Container();

// 绑定服务
container.bind<ICanvasManager>(TYPES.CanvasManager).to(CanvasManager);

export { container };