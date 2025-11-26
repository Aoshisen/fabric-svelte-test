import { Group, Circle, classRegistry } from "fabric";
import { CustomText, } from "./text"; // 导入自定义文本类
import type { TClassProperties, TOptions } from "fabric";

interface CircularTextOptions extends Partial<TClassProperties<Group>> {
	radius?: number;
	text?: string;
	fontSize?: number;
	textColor?: string;
	circleColor?: string;
	showCircle?: boolean;
	spacing?: number; // 添加字符间距控制
}

export class CircularText extends Group {
	static type = "circular_text";

	radius: number;
	text: string;
	fontSize: number;
	textColor: string;
	circleColor: string;
	showCircle: boolean;
	fontUrl?: string;
	customFontFamily?: string;
	spacing: number; // 字符间距

	private circle: Circle;
	private textObjects: CustomText[] = []; // 使用 CustomText 数组

	static override ownDefaults: Partial<TClassProperties<CircularText>> = {
		radius: 50, // 更小的默认半径
		text: "Circular Text",
		fontSize: 16,
		textColor: "#000000",
		circleColor: "#cccccc",
		showCircle: true,
		fontUrl: undefined,
		customFontFamily: undefined,
		spacing: 0, // 默认无额外间距
	};

	constructor(options: CircularTextOptions = {}) {
		// 先创建占位对象
		super([], options);

		this.radius = options.radius ?? CircularText.ownDefaults.radius!;
		this.text = options.text ?? CircularText.ownDefaults.text!;
		this.fontSize = options.fontSize ?? CircularText.ownDefaults.fontSize!;
		this.textColor = options.textColor ?? CircularText.ownDefaults.textColor!;
		this.circleColor = options.circleColor ?? CircularText.ownDefaults.circleColor!;
		this.showCircle = options.showCircle ?? CircularText.ownDefaults.showCircle!;
		this.fontUrl = options.fontUrl ?? CircularText.ownDefaults.fontUrl!;
		this.customFontFamily = options.customFontFamily ?? CircularText.ownDefaults.customFontFamily!;
		this.spacing = options.spacing ?? CircularText.ownDefaults.spacing!;

		// 创建圆形路径
		this.circle = new Circle({
			radius: this.radius,
			fill: 'transparent',
			stroke: this.showCircle ? this.circleColor : 'transparent',
			strokeWidth: 1,
			originX: 'center',
			originY: 'center',
		});

		// 创建文本对象
		this.createTextObjects();

		// 添加对象到组
		const objectsToAdd = this.showCircle ? [this.circle, ...this.textObjects] : [...this.textObjects];
		this.add(...objectsToAdd);
	}

	private createTextObjects(): void {
		// 清除之前的文本对象
		this.textObjects = [];

		if (!this.text) return;

		const chars = this.text.split('');

		// 计算总弧长，考虑字符间距
		const totalArcLength = (chars.length * this.fontSize) + (chars.length * this.spacing);
		// 计算占据的总角度（弧度）
		const totalAngle = Math.min(
			(totalArcLength / this.radius), // 弧长公式: 弧长 = 半径 × 角度
			Math.PI * 2 // 最大不超过整圆
		);

		// 每个字符之间的角度间隔
		const charAngle = totalAngle / chars.length;

		chars.forEach((char, index) => {
			if (char === ' ') {
				char = '\u00A0'; // 使用不间断空格
			}

			// 将文字放置在圆形外部
			const textRadius = this.radius + this.fontSize / 2; // 文字在圆外
			// 从顶部开始，但只占据计算出的角度范围，居中显示
			const angle = (charAngle * index) - (totalAngle / 2) - Math.PI / 2;

			const x = Math.cos(angle) * textRadius;
			const y = Math.sin(angle) * textRadius;

			// 计算字符旋转角度，使文字沿切线方向
			const rotation = (angle * 180) / Math.PI + 90;

			// 使用 CustomText 替代普通 Text
			const textChar = new CustomText(char, {
				left: x,
				top: y,
				fontSize: this.fontSize,
				fill: this.textColor,
				originX: 'center',
				originY: 'center',
				angle: rotation,
				selectable: false,
				fontUrl: this.fontUrl,
				customFontFamily: this.customFontFamily,
			});

			this.textObjects.push(textChar);
		});
	}

	/**
	 * 更新文本内容
	 */
	public setText(newText: string): void {
		this.text = newText;

		// 移除旧的文本对象
		this.textObjects.forEach(textObj => this.remove(textObj));

		// 创建新的文本对象
		this.createTextObjects();

		// 添加新的文本对象
		this.textObjects.forEach(textObj => this.add(textObj));

		this.set('dirty', true);
		this.canvas?.requestRenderAll();
	}

	/**
	 * 更新半径
	 */
	public setRadius(newRadius: number): void {
		this.radius = newRadius;

		// 更新圆形
		this.circle.set({ radius: newRadius });

		// 重新创建文本对象以适应新的半径
		this.setText(this.text);
	}

	/**
	 * 更新字体大小
	 */
	public setFontSize(newFontSize: number): void {
		this.fontSize = newFontSize;
		this.setText(this.text); // 重新创建文本以应用新的字体大小
	}

	/**
	 * 更新字符间距
	 */
	public setSpacing(newSpacing: number): void {
		this.spacing = newSpacing;
		this.setText(this.text); // 重新创建文本以应用新的间距
	}

	/**
	 * 切换圆形显示
	 */
	public setShowCircle(show: boolean): void {
		this.showCircle = show;
		this.circle.set({
			stroke: show ? this.circleColor : 'transparent'
		});
		this.set('dirty', true);
		this.canvas?.requestRenderAll();
	}

	/**
	 * 更改字体
	 */
	public async changeFont(fontUrl: string, fontFamily: string): Promise<void> {
		this.fontUrl = fontUrl;
		this.customFontFamily = fontFamily;

		// 更新所有文本对象的字体
		for (const textObj of this.textObjects) {
			await textObj.changeFont(fontUrl, fontFamily);
		}

		this.set('dirty', true);
		this.canvas?.requestRenderAll();
	}

	/**
	 * 获取字体是否已加载
	 */
	public get isFontLoaded(): boolean {
		return this.textObjects.length > 0 ? this.textObjects[0].isFontLoaded : false;
	}

	static getDefaults(): Partial<TClassProperties<CircularText>> {
		return {
			...super.getDefaults(),
			...CircularText.ownDefaults,
		};
	}

	static async fromObject(object: any): Promise<CircularText> {
		const circularText = new CircularText(object);
		return circularText;
	}
}

// 注册类
classRegistry.setClass(CircularText);