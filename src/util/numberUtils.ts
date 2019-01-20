export function valueBetween(value: number, min: number, max: number): number {
	return value > min ? (value < max ? value : max) : min;
}

export function getRandomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
