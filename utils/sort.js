import "dotenv/config";

const SORT = process.env.SORT;
console.log(SORT);
var sortOrder = ["AZ", "ZA"].includes(SORT) ? SORT : "ZA";

console.log(sortOrder);

const sortByYear = function (data, key = "year") {
	if (sortOrder === "ZA") {
		data.sort((a, b) => parseFloat(a[key]) - parseInt(b[key]));
	} else if (SORT === "AZ") {
		data.sort((a, b) => parseFloat(b[key]) - parseFloat(a[key]));
	}

	return data;
};

const sortArray = function (data) {
	if (sortOrder === "ZA") {
		return data.sort(function (a, b) {
			return a - b;
		});
	} else if (SORT === "AZ") {
		return data.sort(function (a, b) {
			return b - a;
		});
	}
};

export { sortByYear, sortArray };
