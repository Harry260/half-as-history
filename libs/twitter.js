import { TwitterApi } from "twitter-api-v2";
import getBuffer from "../utils/getImageBuffer.js";
import "dotenv/config";
import { sortArray } from "../utils/sort.js";

const {
	APP_KEY,
	APP_SECRET,
	ACCESS_TOKEN,
	ACCESS_SECRET,
	ONLY_TWEETS_WITH_IMAGE,
	MAX_TWEET,
} = process.env;

const authInfo = {
	appKey: APP_KEY,
	appSecret: APP_SECRET,
	accessToken: ACCESS_TOKEN,
	accessSecret: ACCESS_SECRET,
};
var twInstace = new TwitterApi(authInfo);

const Twitter = {
	createThread: async function (obj) {
		return new Promise(async (resolve) => {
			await twInstace.v2
				.tweetThread(obj)
				.then((data) => {
					resolve({ data });
				})
				.catch((error) => {
					resolve({ error });
				});
		});
	},
	_uplaodImageAndGetID: async function (buffer) {
		return new Promise(async function (resolve) {
			if (buffer === false) {
				resolve(false);
			} else {
				const mediaId = await twInstace.v1
					.uploadMedia(buffer, {
						type: "jpeg",
						mimeType: "image/jpeg",
					})
					.catch((er) => {
						console.log(er);
					});

				resolve(mediaId);
			}
		});
	},
	resolveMediaIDs: async function (obj) {
		return new Promise(async function (resolve) {
			tempTwitterObject = {};
			var twitterObject = [];
			var resolved = false;
			for (let i = 0; i < obj.length; i++) {
				if (twitterObject.length + 2 === parseInt(MAX_TWEET)) {
					if (!resolved) {
						resolve(twitterObject);
						resolved = true;
					}
					break;
				} else {
					var { image, snippet, article, year } = obj[i];

					console.log("Working on Post: " + article);

					var buffer = await getBuffer(image);
					var mediaId = await Twitter._uplaodImageAndGetID(buffer);

					if (ONLY_TWEETS_WITH_IMAGE.toUpperCase() === "TRUE") {
						if (mediaId) {
							tempTwitterObject[year] = {
								text: snippet,
								media: { media_ids: [mediaId] },
							};
						}
					} else {
						tempTwitterObject[year] = snippet;
					}

					if (i === obj.length - 1) {
						sortArray(Object.keys(tempTwitterObject)).forEach(
							(key) => {
								twitterObject.push(tempTwitterObject[key]);
							}
						);
						resolve(twitterObject);
					}
				}
			}
		});
	},
};

export default Twitter;
