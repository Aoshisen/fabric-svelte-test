// src/inversify.config.ts
import { Container } from 'inversify';
import { Canvas } from './services/canvas';
import "reflect-metadata"
import { Form } from './services/form';
import { Controller } from './services/controller';

const container = new Container();

const TYPES = {
	Canvas: Symbol.for('Canvas'),
	Form: Symbol.for('Form'),
	Controller: Symbol.for('Controller'),
	// 其他类型...
};

// 绑定服务
container.bind<Canvas>(TYPES.Canvas).to(Canvas);
container.bind<Form>(TYPES.Form).to(Form);
container.bind<Controller>(TYPES.Controller).to(Controller)


export { container, TYPES };