import Jimp from "jimp";

async function getBuffer(img) {
	return new Promise(function (resolve, reject) {
		Jimp.read(img)

			.then(function (image) {
				image.getBuffer(Jimp.MIME_JPEG, async (err, buffer) => {
					resolve(buffer);
				});
			})
			.catch((err) => {
				resolve(false);
			});
	});
}

export default getBuffer;
