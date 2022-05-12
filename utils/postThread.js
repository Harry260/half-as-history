import API from "../libs/api.js";
import Twitter from "../libs/twitter.js";
import "dotenv/config";

const { MAX_LOAD } = process.env;

async function getTwitterThreadData(category = "events") {
	return new Promise((resolve) => {
		const API_parametes = {
			category: category,
			count: MAX_LOAD,
		};
		API.getData(API_parametes, async (data) => {
			var twitterObj = await Twitter.resolveMediaIDs(data);
			resolve(twitterObj);
		});
	});
}

async function postTweet(category) {
	return new Promise(async (resolve) => {
		var ThreadObj = await getTwitterThreadData(category);
		var Thread = await Twitter.createThread(ThreadObj);
		resolve(Thread);
	});
}

export { getTwitterThreadData, postTweet };
