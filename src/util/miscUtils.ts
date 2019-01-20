export function getRandomItemFromArray(array: any[]): any {
	return array[Math.floor(Math.random() * array.length)];
}

export const PI2: number = Math.PI * 2;

export const debounce = (func: () => void, wait = 50) => {
	let h: number;
	return () => {
		clearTimeout(h);
		h = window.setTimeout(() => func(), wait);
	};
};

export function uniqueArray(array: any[]): any[] {
	return array.filter((elem, pos, arr) => {
		return arr.indexOf(elem) === pos;
	});
}

export function removeFromArray(item: any, list: any[]): void {
	const index = list.indexOf(item);
	if (index > -1) {
		list.splice(index);
	}
}
