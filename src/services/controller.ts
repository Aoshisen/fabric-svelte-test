import { injectable } from 'inversify';
import type { Canvas } from './canvas';
import { EventName, type Form } from './form';
import type { FabricObject } from 'fabric';
import type { CustomText } from '../objects/text';
import type { CustomImage } from '../objects/image';
import type { CircularText } from '../objects/circular_text';

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
		const { key, value } = e
		// 当表单name字段变更时更新文本内容
		if (key === 'name') {
			const canvas = this.canvasManager?.getCanvas();
			if (!canvas) return;

			const objects = canvas.getObjects();
			console.log(objects)
			const targetObject = objects.find((obj: FabricObject) => {
				return obj.type === 'custom_text'
			});

			if (targetObject) {
				targetObject.set('text', value);
				canvas.requestRenderAll();
			}
		}
		if (key === "font") {
			const canvas = this.canvasManager?.getCanvas();
			if (!canvas) return;

			const objects = canvas.getObjects();
			const targetObject = objects.find((obj: FabricObject) => {
				return obj.type === 'circular_text'
			});

			if (targetObject) {
				// 使用示例字体：Google Fonts 的 Roboto
				(targetObject as CircularText).changeFont(
					"https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2",
					"Roboto"
				)
			}
		}
		if (key === "image") {
			const canvas = this.canvasManager?.getCanvas();
			if (!canvas) return;

			const objects = canvas.getObjects();
			const targetObject = objects.find((obj: FabricObject) => {
				return obj.type === 'custom_image'
			}) as CustomImage | undefined;

			if (targetObject) {
				targetObject.changeImage('https://picsum.photos/200/300')
			}
		}
	}
	onCanvasObjectModified(e: any) {
		console.log(e, "controller")
	}
}