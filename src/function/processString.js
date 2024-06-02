export const processString = function (inputString, substringsList, callback) {
	let resultJSX = [];
	let currentStartIndex = 0;
	for (const substring of substringsList) {
		const index = inputString.indexOf(substring, currentStartIndex);
		if (index !== -1) {
			const substringBefore = inputString.substring(currentStartIndex, index);
			resultJSX.push(substringBefore);
			resultJSX.push(callback(substring, resultJSX.length));
			currentStartIndex = index + substring.length;
		}
	}
	if (currentStartIndex < inputString.length) {
		resultJSX.push(inputString.substring(currentStartIndex));
	}
	return resultJSX;
};