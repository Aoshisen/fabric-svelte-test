import "reflect-metadata"
import { Container } from 'inversify';
import { Canvas } from './services/canvas';
import { Form } from './services/form';
import { Controller } from './services/controller';

const container = new Container();
// 绑定服务
container.bind(Canvas).toSelf()
container.bind(Form).toSelf()
container.bind(Controller).toSelf()
export default container;