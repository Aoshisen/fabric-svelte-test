import { injectable } from 'inversify';
import mitt from 'mitt';

export enum EventName {
	FormChange = 'form:change',
	FormInitialized = 'form:initialized',
}
@injectable()
export class Form {
	emitter = mitt();
	container: HTMLFormElement | null = null;
	private initCallbacks: Array<(form: Form) => void> = [];
	initialize(container: HTMLFormElement) {
		this.container = container;
		this.initCallbacks.forEach(callback => callback(this));
	}
	onReady(callback: (form: Form) => void) {
		this.initCallbacks.push(callback)
	}
}