import moment from "moment";

function getCategory(cb = console.log) {
	var timing = {
		"08:00:00-16:00:00": "events",
		"16:00:00-24:00:00": "deaths",
		"00:00:00-08:00:00": "births",
	};

	var timingArray = {};
	var format = "HH:mm:ss";

	Object.keys(timing).forEach((item) => {
		var from = moment(item.split("-")[0], format);
		var to = moment(item.split("-")[1], format);

		timingArray[timing[item]] = { from, to, name: timing[item] };
	});
	var resolved = false;
	Object.keys(timingArray).forEach((item, i, a) => {
		var { from, to } = timingArray[item];

		var currentTime = moment(moment().format(format), format);

		if (currentTime.isBetween(from, to)) {
			cb(item);
			resolved = true;
		} else {
			if (a.length === i + 1 && !resolved) {
				cb(false);
			}
		}
	});
}
getCategory();
export default getCategory;
