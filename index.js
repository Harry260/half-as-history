import { postTweet } from "./utils/postThread.js";
import { fileURLToPath } from "url";
import getCategory from "./utils/getCategory.js";

import express from "express";
import path from "path";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
var availablePlatforms = ["twitter"];

// For static HTML page
app.use(express.static(path.join(__dirname, "public")));

app.get(["/post/:platform"], (req, res) => {
	var platforms = availablePlatforms.includes(req.params.platform)
		? [req.params.platform]
		: availablePlatforms;

	getCategory((category) => {
		platforms.forEach(async (platform) => {
			if (platform === "twitter") {
				var tw = await postTweet(category);
				console.log(tw);

				res.send(tw);
			}
		});
	});
});

app.listen(port, function () {
	console.log("Server is listening on port " + port);
});
