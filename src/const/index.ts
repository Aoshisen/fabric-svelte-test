import { Circle, Rect } from "fabric";
import { CustomText } from "../objects/text";
import { CustomImage } from "../objects/image";
import { CircularText } from "../objects/circular_text";

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
const image = new CustomImage({
	imageUrl: "https://fabric5.fabricjs.com/assets/15.svg",
	left: 200,
	top: 100,
	selectable: true,
});
const circular_text = new CircularText({
	left: 0,
	top: 0,
	radius: 100,
	text: "Hello world",
	fontSize: 20,
	selectable: true,
	textPosition: "outside"
});

const circular_text_inside = new CircularText({
	left: 0,
	top: 0,
	radius: 100,
	text: "Hello world",
	fontSize: 20,
	selectable: true,
	textPosition: 'inside',
});

export const objects = [rect, circle, text, image, circular_text, circular_text_inside];
