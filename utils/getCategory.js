import moment from "moment";

function getCategory(cb = console.log) {
	var timing = {
		"08:00:00-16:00:00": "events",
		"16:00:00-24:00:00": "births",
		"00:00:00-08:00:00": "deaths",
	};

	var timingArray = {};
	var format = "hh:mm:ss";

	Object.keys(timing).forEach((item) => {
		var from = moment(item.split("-")[0], format);
		var to = moment(item.split("-")[1], format);

		timingArray[timing[item]] = { from, to, name: timing[item] };
	});

	Object.keys(timingArray).forEach((item, i) => {
		var { from, to } = timingArray[item];

		var currentTime = moment(moment().format(format), format);

		if (currentTime.isBetween(from, to)) {
			cb(item);
		} else {
			if (Object.keys(timingArray).length === i + 1) {
				cb(false);
			}
		}
	});
}

export default getCategory;
