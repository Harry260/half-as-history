var hash = window.location.hash.toLocaleLowerCase().substring(1);

if (hash === "follow") {
	window.location.replace(
		"https://twitter.com/intent/follow?original_referer=https%3A%2F%2Fpublish.twitter.com%2F&ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Efollow%7Ctwgr%5Ehalfashistory&region=follow_link&screen_name=halfashistory"
	);
} else if (hash === "tweet") {
	var items = [
		"Do you know what happed toady in history?",
		"Wanna know about todays history?",
		"It's great to know about todays history right?",
		"I know what happened toady in history! Ask me why? because i ",
	];

	var text =
		items[Math.floor(Math.random() * items.length)] +
		"Follow @halfashistory to get daily tweets about the day in history!";
	var url = window.location.origin;

	var redirect = `https://twitter.com/intent/tweet?url=${url}&text=${text}&hashtags=history`;
	window.location.replace(redirect);
}
