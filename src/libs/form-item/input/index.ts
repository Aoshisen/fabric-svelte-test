import type { Component } from 'svelte';
import { BaseFormItem, type FormItemConfig } from '../base';
import InputComponent from './form-item-input.svelte';

/**
 * Input 表单项配置接口
 */
export interface InputFormItemConfig extends FormItemConfig {
	/** 输入类型 */
	type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
	/** 最大长度 */
	maxLength?: number;
	/** 最小长度 */
	minLength?: number;
}

/**
 * Input 表单项类
 * 提供文本输入框的功能
 */
export class InputFormItem extends BaseFormItem<string> {
	protected config: InputFormItemConfig;

	constructor(config: InputFormItemConfig) {
		super(config);
		this.config = config;
	}

	/**
	 * 获取默认值
	 */
	protected getDefaultValue(): string {
		return '';
	}

	/**
	 * 获取 Svelte 组件
	 */
	getComponent(): Component<any> {
		return InputComponent;
	}

	/**
	 * 获取组件 props
	 */
	getComponentProps(): Record<string, any> {
		return {
			...super.getComponentProps(),
			type: this.config.type || 'text',
			maxLength: this.config.maxLength,
			minLength: this.config.minLength,
		};
	}

	/**
	 * 验证表单项
	 */
	async validate(): Promise<boolean> {
		// 先执行基础验证
		const baseValid = await super.validate();
		if (!baseValid) {
			return false;
		}

		const value = this.state.value as string;

		// 最小长度验证
		if (this.config.minLength && value.length < this.config.minLength) {
			this.state.error = `${this.config.label}长度不能少于${this.config.minLength}个字符`;
			this.notifyStateChange();
			return false;
		}

		// 最大长度验证
		if (this.config.maxLength && value.length > this.config.maxLength) {
			this.state.error = `${this.config.label}长度不能超过${this.config.maxLength}个字符`;
			this.notifyStateChange();
			return false;
		}

		// 邮箱验证
		if (this.config.type === 'email' && value) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(value)) {
				this.state.error = '请输入有效的邮箱地址';
				this.notifyStateChange();
				return false;
			}
		}

		// URL 验证
		if (this.config.type === 'url' && value) {
			try {
				new URL(value);
			} catch {
				this.state.error = '请输入有效的 URL';
				this.notifyStateChange();
				return false;
			}
		}

		return true;
	}
}
