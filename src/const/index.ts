import { Circle, Rect } from "fabric";
import { InputFormItem } from "../libs/form-item/input";

export const App_name = "Svelte + fabric + Scss + Inversity js + zod + Typescript"


const rect = new Rect({
	left: 100,
	top: 100,
	fill: "red",
	width: 100,
	height: 100,
	selectable: true,
});

const circle = new Circle({
	left: 300,
	top: 100,
	radius: 50,
	fill: "blue",
	selectable: true,
});
export const objects = [rect, circle];

// 创建表单项
const usernameInput = new InputFormItem({
	name: "username",
	label: "用户名",
	required: true,
	placeholder: "请输入用户名",
	minLength: 3,
	maxLength: 20,
});

const emailInput = new InputFormItem({
	name: "email",
	label: "邮箱",
	type: "email",
	required: true,
	placeholder: "请输入邮箱地址",
});
export const items = [usernameInput, emailInput];