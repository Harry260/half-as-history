import { TwitterApi } from "twitter-api-v2";
import { sortArray } from "../utils/sort.js";
import moment from "moment";
import getBuffer from "../utils/getImageBuffer.js";
import "dotenv/config";

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
			var tempTwitterObject = {};
			var twitterObject = [];
			var resolved = false;
			for (let i = 0; i < obj.length; i++) {
				var { image, snippet, article, year, category } = obj[i];

				if (
					Object.keys(tempTwitterObject).length + 2 ===
					parseInt(MAX_TWEET)
				) {
					if (!resolved) {
						sortArray(Object.keys(tempTwitterObject)).forEach(
							(key) => {
								twitterObject.push(tempTwitterObject[key]);
							}
						);
						resolve(
							Twitter._addStarterText(twitterObject, category)
						);
						resolved = true;
					}
					break;
				} else if (!resolved) {
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
						resolve(
							Twitter._addStarterText(twitterObject, category)
						);
						resolved = true;
					}
				}
			}
		});
	},
	_addStarterText: function (obj, category) {
		var date = moment().format("DD MMMM");
		var array = [
			`Some important ${category} of ${date} in the history!\r\n 👇 A Thread 🧵 👇\r\n\r\n`,
			`Do you know about the ${category} of ${date} in the history?\r\n👇 A Thread 🧵 👇\r\n`,
			`Here are the ${category} of ${date} in the history!\r\n👇 A Thread 🧵 👇\r\n`,
		];
		const randomElement = array[Math.floor(Math.random() * array.length)];
		if (typeof obj[0] === "string") {
			obj[0] = randomElement + obj[0];
		} else if (typeof obj[0] === "object") {
			obj[0].text = randomElement + obj[0].text;
		}
		return obj;
	},
};

export default Twitter;
