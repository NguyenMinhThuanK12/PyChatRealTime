export const getCroppedImg = (src, crop, aspectRatio) => {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	const image = new Image();
	image.src = src;

	canvas.width = crop.width;
	canvas.height = crop.height;

	ctx.drawImage(
		image,
		crop.x,
		crop.y,
		crop.width,
		crop.height,
		0,
		0,
		crop.width,
		crop.height
	);

	const dataUrl = canvas.toDataURL('image/jpeg');

	// console.log(dataUrl); // Log the dataUrl here

	return dataUrl;
};