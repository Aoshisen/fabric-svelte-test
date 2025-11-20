// src/inversify.config.ts
import { Container } from 'inversify';
import type { ICanvasManager } from './services/canvas-manager.interface';
import { CanvasManager } from './services/canvas-manager';
import type { IFormManager } from './services/form-manager.interface';
import { FormManager } from './services/form-manager';
import "reflect-metadata"
import { TYPES } from './types';

const container = new Container();

// 绑定服务
container.bind<ICanvasManager>(TYPES.CanvasManager).to(CanvasManager);
container.bind<IFormManager>(TYPES.FormManager).to(FormManager);

export { container };