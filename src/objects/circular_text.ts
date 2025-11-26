// src/objects/circular_text.ts
import { Group, Circle, classRegistry } from "fabric";
import { CustomText } from "./text";
import type { TClassProperties } from "fabric";

// 从 text.ts 导入 CustomTextOptions 接口
interface CustomTextOptions extends Partial<TClassProperties<CustomText>> {
  fontUrl?: string;
  customFontFamily?: string;
}

interface CircularTextOptions extends CustomTextOptions, Partial<TClassProperties<Group>> {
  radius?: number;
  text?: string;
  fontSize?: number;
  textColor?: string;
  circleColor?: string;
  showCircle?: boolean;
  spacing?: number;
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
  spacing: number;

  private circle: Circle;
  private textObjects: CustomText[] = [];

  static override ownDefaults: Partial<TClassProperties<CircularText>> = {
    radius: 50,
    text: "Circular Text",
    fontSize: 16,
    textColor: "#000000",
    circleColor: "#cccccc",
    showCircle: true,
    fontUrl: undefined,
    customFontFamily: undefined,
    spacing: 0,
  };

  constructor(options: CircularTextOptions = {}) {
    // 先创建空的组，但保留位置选项
    const { left, top, ...groupOptions } = options;
    
    // 创建占位对象，传递位置信息
    super([], { left, top, ...groupOptions });

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
    
    // 确保位置正确设置
    if (left !== undefined) this.set('left', left);
    if (top !== undefined) this.set('top', top);
  }

  private createTextObjects(): void {
    this.textObjects = [];

    if (!this.text) return;

    const chars = this.text.split('');
    const totalArcLength = (chars.length * this.fontSize) + (chars.length * this.spacing);
    const totalAngle = Math.min(
      (totalArcLength / this.radius),
      Math.PI * 2
    );

    const charAngle = totalAngle / chars.length;

    chars.forEach((char, index) => {
      if (char === ' ') {
        char = '\u00A0';
      }

      const textRadius = this.radius + this.fontSize / 2;
      const angle = (charAngle * index) - (totalAngle / 2) - Math.PI / 2;

      const x = Math.cos(angle) * textRadius;
      const y = Math.sin(angle) * textRadius;

      const rotation = (angle * 180) / Math.PI + 90;

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

  public setText(newText: string): void {
    this.text = newText;
    this.textObjects.forEach(textObj => this.remove(textObj));
    this.createTextObjects();
    this.textObjects.forEach(textObj => this.add(textObj));
    this.set('dirty', true);
    this.canvas?.requestRenderAll();
  }

  public setRadius(newRadius: number): void {
    this.radius = newRadius;
    this.circle.set({ radius: newRadius });
    this.setText(this.text);
  }

  public setFontSize(newFontSize: number): void {
    this.fontSize = newFontSize;
    this.setText(this.text);
  }

  public setSpacing(newSpacing: number): void {
    this.spacing = newSpacing;
    this.setText(this.text);
  }

  public setShowCircle(show: boolean): void {
    this.showCircle = show;
    this.circle.set({
      stroke: show ? this.circleColor : 'transparent'
    });
    this.set('dirty', true);
    this.canvas?.requestRenderAll();
  }

  public async changeFont(fontUrl: string, fontFamily: string): Promise<void> {
    this.fontUrl = fontUrl;
    this.customFontFamily = fontFamily;

    for (const textObj of this.textObjects) {
      await textObj.changeFont(fontUrl, fontFamily);
    }

    this.set('dirty', true);
    this.canvas?.requestRenderAll();
  }

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

classRegistry.setClass(CircularText);