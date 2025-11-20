import type { Component } from 'svelte';

/**
 * 表单项配置接口
 */
export interface FormItemConfig {
	/** 字段名称 */
	name: string;
	/** 标签 */
	label: string;
	/** 是否必填 */
	required?: boolean;
	/** 占位符 */
	placeholder?: string;
	/** 默认值 */
	defaultValue?: any;
	/** 是否禁用 */
	disabled?: boolean;
	/** 自定义样式类 */
	className?: string;
	/** 验证规则 */
	validators?: Array<(value: any) => string | null>;
}

/**
 * 表单项状态接口
 */
export interface FormItemState {
	/** 当前值 */
	value: any;
	/** 是否被触摸过 */
	touched: boolean;
	/** 错误信息 */
	error: string | null;
	/** 是否正在验证 */
	validating: boolean;
}

export const default_state: FormItemState = {
	value: null,
	touched: false,
	error: null,
	validating: false,
}

/**
 * 基础表单项类
 * 提供表单项的核心逻辑和状态管理
 */
export abstract class BaseFormItem<T = any> {
	/** 配置 */
	protected config: FormItemConfig;
	/** 状态 */
	protected state: FormItemState;
	/** 值变化回调 */
	protected onChangeCallbacks: Array<(value: T) => void> = [];
	/** 状态变化回调 */
	protected onStateChangeCallbacks: Array<(state: FormItemState) => void> = [];

	constructor(config: FormItemConfig) {
		this.config = config;
		this.state = {
			value: config.defaultValue ?? this.getDefaultValue(),
			touched: false,
			error: null,
			validating: false,
		};
	}

	/**
	 * 获取默认值 - 子类可以重写
	 */
	protected getDefaultValue(): T {
		return null as T;
	}

	/**
	 * 获取 Svelte 组件 - 子类必须实现
	 */
	abstract getComponent(): Component<any>;

	/**
	 * 获取组件 props
	 */
	getComponentProps(): Record<string, any> {
		return {
			config: this.config,
			state: this.state,
			onChange: this.handleChange.bind(this),
			onBlur: this.handleBlur.bind(this),
		};
	}

	/**
	 * 处理值变化
	 */
	protected handleChange(value: T): void {
		this.state.value = value;
		this.notifyStateChange();
		this.onChangeCallbacks.forEach(cb => cb(value));

		// 如果已经被触摸过,立即验证
		if (this.state.touched) {
			this.validate();
		}
	}

	/**
	 * 处理失焦事件
	 */
	protected handleBlur(): void {
		if (!this.state.touched) {
			this.state.touched = true;
			this.validate();
			this.notifyStateChange();
		}
	}

	/**
	 * 验证表单项
	 */
	async validate(): Promise<boolean> {
		this.state.validating = true;
		this.state.error = null;
		this.notifyStateChange();

		// 必填验证
		if (this.config.required && this.isEmpty(this.state.value)) {
			this.state.error = `${this.config.label}不能为空`;
			this.state.validating = false;
			this.notifyStateChange();
			return false;
		}

		// 自定义验证器
		if (this.config.validators) {
			for (const validator of this.config.validators) {
				const error = validator(this.state.value);
				if (error) {
					this.state.error = error;
					this.state.validating = false;
					this.notifyStateChange();
					return false;
				}
			}
		}

		this.state.validating = false;
		this.notifyStateChange();
		return true;
	}

	/**
	 * 检查值是否为空
	 */
	protected isEmpty(value: any): boolean {
		return value === null || value === undefined || value === '';
	}

	/**
	 * 获取当前值
	 */
	getValue(): T {
		return this.state.value;
	}

	/**
	 * 设置值
	 */
	setValue(value: T): void {
		this.state.value = value;
		this.notifyStateChange();
	}

	/**
	 * 重置表单项
	 */
	reset(): void {
		this.state.value = this.config.defaultValue ?? this.getDefaultValue();
		this.state.touched = false;
		this.state.error = null;
		this.state.validating = false;
		this.notifyStateChange();
	}

	/**
	 * 获取配置
	 */
	getConfig(): FormItemConfig {
		return this.config;
	}

	/**
	 * 获取状态
	 */
	getState(): FormItemState {
		return this.state;
	}

	/**
	 * 订阅值变化
	 */
	onChange(callback: (value: T) => void): () => void {
		this.onChangeCallbacks.push(callback);
		return () => {
			const index = this.onChangeCallbacks.indexOf(callback);
			if (index > -1) {
				this.onChangeCallbacks.splice(index, 1);
			}
		};
	}

	/**
	 * 订阅状态变化
	 */
	onStateChange(callback: (state: FormItemState) => void): () => void {
		this.onStateChangeCallbacks.push(callback);
		return () => {
			const index = this.onStateChangeCallbacks.indexOf(callback);
			if (index > -1) {
				this.onStateChangeCallbacks.splice(index, 1);
			}
		};
	}

	/**
	 * 通知状态变化
	 */
	protected notifyStateChange(): void {
		this.onStateChangeCallbacks.forEach(cb => cb(this.state));
	}

	/**
	 * 销毁
	 */
	destroy(): void {
		this.onChangeCallbacks = [];
		this.onStateChangeCallbacks = [];
	}
}
