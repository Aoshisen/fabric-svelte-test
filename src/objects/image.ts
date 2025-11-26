// src/objects/custom_image.ts
import { FabricImage, classRegistry } from "fabric";
import type { ImageSource, TClassProperties } from "fabric";

interface CustomImageOptions extends Partial<TClassProperties<FabricImage>> {
	imageUrl?: string;
	originalSrc?: string;
}

export class CustomImage extends FabricImage {
	imageUrl?: string;
	originalSrc?: string;

	#imageLoaded: boolean = false;

	static type = "custom_image";
	static override ownDefaults: Partial<TClassProperties<CustomImage>> = {
		imageUrl: undefined,
		originalSrc: undefined,
	};

	constructor(options: CustomImageOptions = {}, element: ImageSource = new Image()) {
		super(element, options);
		this.imageUrl = options.imageUrl;
		this.originalSrc = options.originalSrc;

		if (this.imageUrl) {
			this.loadImageFromUrl(this.imageUrl);
		}
	}

	async loadImageFromUrl(imageUrl: string): Promise<void> {
		try {
			const imgElement = new Image();

			// 处理跨域问题
			if (imageUrl.startsWith('http')) {
				imgElement.crossOrigin = 'anonymous';
			}

			const loadImage = new Promise<HTMLImageElement>((resolve, reject) => {
				imgElement.onload = () => resolve(imgElement);
				imgElement.onerror = (err) => reject(err);
				imgElement.src = imageUrl;
			});

			const loadedImage = await loadImage;

			// 更新图像元素
			this.setElement(loadedImage);
			this.imageUrl = imageUrl;
			this.#imageLoaded = true;

			// 重新计算尺寸
			this.applyResizeFilters();

			// 触发画布重绘
			this.canvas?.requestRenderAll();

			console.log(`Image loaded successfully from ${imageUrl}`);
		} catch (error) {
			console.error('Failed to load image:', error);
			throw new Error(`Failed to load image from ${imageUrl}: ${error}`);
		}
	}

	async changeImage(imageUrl: string): Promise<void> {
		await this.loadImageFromUrl(imageUrl);
		this.set('dirty', true); // 标记对象需要重绘
		this.canvas?.requestRenderAll();
	}

	get isImageLoaded(): boolean {
		return this.#imageLoaded;
	}

	static getDefaults() {
		return {
			...super.getDefaults(),
			...CustomImage.ownDefaults,
		};
	}

	async fromObject(object: any): Promise<CustomImage> {
		const { element, ...options } = object;
		const img = new CustomImage(options, element);

		if (object.imageUrl) {
			await img.loadImageFromUrl(object.imageUrl);
		}

		return img;
	}
}

classRegistry.setClass(CustomImage);
classRegistry.setSVGClass(CustomImage);