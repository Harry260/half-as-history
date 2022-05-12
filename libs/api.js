import { Today, Media } from "wikifox";
import { sortByYear } from "../utils/sort.js";
import sleep from "../utils/sleep.js";
import "dotenv/config";

const { ONLY_TWEETS_WITH_IMAGE } = process.env;

const API = {
	getData: (params = {}, callback = console.log) => {
		var category = ["events", "deaths", "births"].includes(params.category)
			? params.category
			: "events";
		var count = params.count ?? 20;

		Today.GetOnThisDay({}, (results) => {
			var data = results.data[category];
			count = count > data.length ? data.length : count;

			callback = typeof callback === "function" ? callback : console.log;

			var postListObj = [];
			var tempPosts = data.slice(0, count);

			tempPosts.forEach((element) => {
				var { year, snippet, article } = element;

				if (!article || !snippet || !year) {
					return;
				} else {
					postListObj.push(element);
				}
			});

			var processed = [];
			postListObj.forEach(async (element, index, array) => {
				var { year, snippet, article } = element;
				await sleep(100);
				try {
					var media = new Media({
						article: article.slice("6"),
						language: "en",
					});

					media.getThumbnail((image) => {
						if (image.success) {
							element.image = image.data.url;
						} else {
							element.image = false;
						}
						var years_ago =
							new Date().getFullYear() - parseInt(year);
						element.snippet =
							snippet +
							"\r\n\r\n" +
							parseInt(year) +
							" · " +
							years_ago +
							" years ago";

						if (ONLY_TWEETS_WITH_IMAGE.toUpperCase() === "TRUE") {
							if (element.image) {
								processed.push(element);
							}
						} else {
							processed.push(element);
						}

						if (
							index === array.length - 1 &&
							typeof callback === "function"
						) {
							processed = sortByYear(processed);
							callback(processed);
						}
					}, 1000);
				} catch (error) {
					console.log(error);
				}
			});
		});
	},
};

export default API;
