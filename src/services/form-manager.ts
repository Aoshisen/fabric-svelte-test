import { injectable } from 'inversify';
import type { BaseFormItem } from '../libs/form-item/base';
import type { IFormManager } from './form-manager.interface';
import { mount } from 'svelte';

/**
 * 表单管理器实现
 * 类似于 CanvasManager，用于管理表单项的生命周期和状态
 */
@injectable()
export class FormManager implements IFormManager {
	private container: HTMLElement | null = null;
	private formItems: BaseFormItem[] = [];
	private formItemAddedCallbacks: Array<(formItem: BaseFormItem) => void> = [];
	private formItemRemovedCallbacks: Array<(formItem: BaseFormItem) => void> = [];
	private formValuesChangedCallbacks: Array<(values: Record<string, any>) => void> = [];

	/**
	 * 初始化表单管理器
	 */
	public initialize(container: HTMLElement): void {
		this.container = container;
	}

	/**
	 * 获取表单容器
	 */
	public getContainer(): HTMLElement | null {
		return this.container;
	}

	/**
	 * 添加单个表单项
	 */
	public addFormItem(formItem: BaseFormItem): void {
		this.formItems.push(formItem);
		this.setupFormItemListeners(formItem);
		this.formItemAddedCallbacks.forEach((callback) => callback(formItem));
		this.notifyFormValuesChanged();
	}

	/**
	 * 添加多个表单项
	 */
	public addFormItems(formItems: BaseFormItem[]): void {
		formItems.forEach((formItem) => {
			this.addFormItem(formItem);
		});
	}

	/**
	 * 移除单个表单项
	 */
	public removeFormItem(formItem: BaseFormItem): void {
		const index = this.formItems.indexOf(formItem);
		if (index > -1) {
			this.formItems.splice(index, 1);
			formItem.destroy();
			this.formItemRemovedCallbacks.forEach((callback) => callback(formItem));
			this.notifyFormValuesChanged();
		}
	}

	/**
	 * 移除多个表单项
	 */
	public removeFormItems(formItems: BaseFormItem[]): void {
		formItems.forEach((formItem) => {
			const index = this.formItems.indexOf(formItem);
			if (index > -1) {
				this.formItems.splice(index, 1);
				formItem.destroy();
				this.formItemRemovedCallbacks.forEach((callback) => callback(formItem));
			}
		});
		this.notifyFormValuesChanged();
	}

	/**
	 * 根据 name 移除表单项
	 */
	public removeFormItemByName(name: string): void {
		const formItem = this.getFormItemByName(name);
		if (formItem) {
			this.removeFormItem(formItem);
		}
	}

	/**
	 * 获取所有表单项
	 */
	public getFormItems(): BaseFormItem[] {
		return this.formItems;
	}

	/**
	 * 根据 name 获取表单项
	 */
	public getFormItemByName(name: string): BaseFormItem | undefined {
		return this.formItems.find((item) => item.getConfig().name === name);
	}

	/**
	 * 验证所有表单项
	 */
	public async validateAll(): Promise<boolean> {
		const results = await Promise.all(
			this.formItems.map((item) => item.validate())
		);
		return results.every((result) => result === true);
	}

	/**
	 * 重置所有表单项
	 */
	public resetAll(): void {
		this.formItems.forEach((item) => item.reset());
		this.notifyFormValuesChanged();
	}

	/**
	 * 获取所有表单项的值
	 */
	public getFormValues(): Record<string, any> {
		const values: Record<string, any> = {};
		this.formItems.forEach((item) => {
			const config = item.getConfig();
			values[config.name] = item.getValue();
		});
		return values;
	}

	/**
	 * 设置表单值
	 */
	public setFormValues(values: Record<string, any>): void {
		Object.entries(values).forEach(([name, value]) => {
			const formItem = this.getFormItemByName(name);
			if (formItem) {
				formItem.setValue(value);
			}
		});
		this.notifyFormValuesChanged();
	}

	/**
	 * 清空所有表单项
	 */
	public clear(): void {
		const itemsToRemove = [...this.formItems];
		itemsToRemove.forEach((item) => {
			item.destroy();
		});
		this.formItems = [];
		this.notifyFormValuesChanged();
	}

	/**
	 * 订阅表单项添加事件
	 */
	public onFormItemAdded(callback: (formItem: BaseFormItem) => void): void {
		this.formItemAddedCallbacks.push(callback);
	}

	/**
	 * 订阅表单项移除事件
	 */
	public onFormItemRemoved(callback: (formItem: BaseFormItem) => void): void {
		this.formItemRemovedCallbacks.push(callback);
	}

	/**
	 * 订阅表单值变化事件
	 */
	public onFormValuesChanged(callback: (values: Record<string, any>) => void): void {
		this.formValuesChangedCallbacks.push(callback);
	}

	/**
	 * 为表单项设置监听器
	 */
	private setupFormItemListeners(formItem: BaseFormItem): void {
		formItem.onChange(() => {
			this.notifyFormValuesChanged();
		});
	}

	/**
	 * 通知表单值变化
	 */
	private notifyFormValuesChanged(): void {
		const values = this.getFormValues();
		this.formValuesChangedCallbacks.forEach((callback) => callback(values));
	}
}

