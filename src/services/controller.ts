import { injectable } from 'inversify';
import type { Canvas } from './canvas';
import { EventName, type Form } from './form';

@injectable()
export class Controller {
	canvasManager: Canvas | undefined;
	formManager: Form | undefined;
	initialize(canvasManager: Canvas, formManager: Form) {
		this.canvasManager = canvasManager;
		this.formManager = formManager;
	}

	run() {
		this.formManager?.emitter.on(EventName.FormChange, this.onFormChange.bind(this))
		this.canvasManager?.onObjectModified(this.onCanvasObjectModified.bind(this))
	}
	onFormChange(e: any) {
		console.log(e, "controller")
	}
	onCanvasObjectModified(e: any) {
		console.log(e, "controller")
	}
}