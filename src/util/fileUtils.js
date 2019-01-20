export const formatBytes = (bytes, decimals) => {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const dm = decimals || 2;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

export const foo = 1;
