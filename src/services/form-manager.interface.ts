import type { BaseFormItem } from "../libs/form-item/base";

/**
 * 表单管理器接口
 * 类似于 Canvas Manager，用于管理表单项的添加、删除和状态
 */
export interface IFormManager {
	/**
	 * 初始化表单管理器
	 * @param container 表单容器元素
	 */
	initialize(container: HTMLElement): void;

	/**
	 * 获取表单容器
	 */
	getContainer(): HTMLElement | null;

	/**
	 * 添加单个表单项
	 */
	addFormItem(formItem: BaseFormItem): void;

	/**
	 * 添加多个表单项
	 */
	addFormItems(formItems: BaseFormItem[]): void;

	/**
	 * 移除单个表单项
	 */
	removeFormItem(formItem: BaseFormItem): void;

	/**
	 * 移除多个表单项
	 */
	removeFormItems(formItems: BaseFormItem[]): void;

	/**
	 * 根据 name 移除表单项
	 */
	removeFormItemByName(name: string): void;

	/**
	 * 获取所有表单项
	 */
	getFormItems(): BaseFormItem[];

	/**
	 * 根据 name 获取表单项
	 */
	getFormItemByName(name: string): BaseFormItem | undefined;

	/**
	 * 验证所有表单项
	 * @returns 是否所有表单项都验证通过
	 */
	validateAll(): Promise<boolean>;

	/**
	 * 重置所有表单项
	 */
	resetAll(): void;

	/**
	 * 获取所有表单项的值
	 * @returns 键值对对象，key 为表单项的 name，value 为表单项的值
	 */
	getFormValues(): Record<string, any>;

	/**
	 * 设置表单值
	 */
	setFormValues(values: Record<string, any>): void;

	/**
	 * 清空所有表单项
	 */
	clear(): void;

	/**
	 * 订阅表单项添加事件
	 */
	onFormItemAdded(callback: (formItem: BaseFormItem) => void): void;

	/**
	 * 订阅表单项移除事件
	 */
	onFormItemRemoved(callback: (formItem: BaseFormItem) => void): void;

	/**
	 * 订阅表单值变化事件
	 */
	onFormValuesChanged(callback: (values: Record<string, any>) => void): void;

	/**
	 * 订阅表单状态变化事件
	 */
	onFormSteateChanged(callback: (states: Record<string, any>) => void): void;
}
