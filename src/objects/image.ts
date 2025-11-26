// src/objects/image.ts
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
		// 先保存URL，但暂时不处理图像加载
		const { imageUrl, originalSrc, ...restOptions } = options;

		// 先调用父构造函数
		super(element, restOptions);

		// 保存属性
		this.imageUrl = imageUrl;
		this.originalSrc = originalSrc;

		// 如果提供了imageUrl，则开始加载图像
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

			// 重新计算尺寸和边界
			this._setWidth(loadedImage.width);
			this._setHeight(loadedImage.height);
			this.applyResizeFilters();

			// 重新计算对象边界
			this.setCoords();

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
		this.set('dirty', true);
		// 重新计算坐标
		this.setCoords();
		this.canvas?.requestRenderAll();
	}

	_setWidth(value: number): void {
		this.set('width', value);
	}
	
	_setHeight(value: number): void {
		this.set('height', value);
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

	static async fromObject(object: any): Promise<CustomImage> {
		// 从序列化对象创建时，先创建基础对象
		const { element, imageUrl, originalSrc, ...options } = object;

		// 创建一个临时的空图像对象
		const img = new CustomImage(options);

		// 如果有imageUrl，则加载图像
		if (imageUrl) {
			await img.loadImageFromUrl(imageUrl);
		}

		return img;
	}
}

classRegistry.setClass(CustomImage);
classRegistry.setSVGClass(CustomImage);