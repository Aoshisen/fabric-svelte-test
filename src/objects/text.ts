import { FabricText, classRegistry } from "fabric";
import type { TClassProperties } from "fabric";

interface CustomTextOptions extends Partial<TClassProperties<FabricText>> {
	fontUrl?: string;
	customFontFamily?: string;
}

export class CustomText extends FabricText {
	fontUrl?: string;
	customFontFamily?: string;

	#fontLoaded: boolean = false;

	static type = "custom_text";
	static override ownDefaults: Partial<TClassProperties<CustomText>> = {
		fontUrl: undefined,
		customFontFamily: undefined,
	};

	constructor(text: string, options: CustomTextOptions = {}) {
		super(text, options);

		this.fontUrl = options.fontUrl;
		this.customFontFamily = options.customFontFamily;

		if (this.fontUrl && this.customFontFamily) {
			this.loadFont(this.fontUrl, this.customFontFamily);
		}
	}

	async loadFont(fontUrl: string, fontFamily: string): Promise<void> {
		try {
			const fontFace = new FontFace(fontFamily, `url(${fontUrl})`);
			const loadedFont = await fontFace.load();
			document.fonts.add(loadedFont);
			await document.fonts.ready;
			console.log(`Font "${fontFamily}" loaded successfully`);
		} catch (error) {
			console.error('Failed to load font:', error);
			throw new Error(`Failed to load font from ${fontUrl}: ${error}`);
		}
	}

	async changeFont(fontUrl: string, fontFamily: string): Promise<void> {
		await this.loadFont(fontUrl, fontFamily);
		this.fontUrl = fontUrl;
		this.customFontFamily = fontFamily;
		this.set('fontFamily', fontFamily);
		this.#fontLoaded = true;
		this.canvas?.requestRenderAll();
	}

	get isFontLoaded(): boolean {
		return this.#fontLoaded;
	}

	static getDefaults() {
		return {
			...super.getDefaults(),
			...CustomText.ownDefaults,
		};
	}

	async fromObject(object: any): Promise<CustomText> {
		const text = new CustomText(object.text, object);

		if (object.fontUrl && object.customFontFamily) {
			await text.loadFont(object.fontUrl, object.customFontFamily);
		}

		return text;
	}
}

classRegistry.setClass(CustomText);
