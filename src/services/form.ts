import { injectable } from 'inversify';
import mitt from 'mitt';

export enum EventName {
	FormChange = 'form:change'
}
@injectable()
export class Form {
	emitter = mitt()
}