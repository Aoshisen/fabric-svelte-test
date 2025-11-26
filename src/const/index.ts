import { Circle, Rect } from "fabric";
import { CustomText } from "../objects/text";

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
const text = new CustomText("Hello World", {
	left: 500,
	top: 100,
	fontSize: 20,
	fill: "black",
	selectable: true,
});
export const objects = [rect, circle, text];
