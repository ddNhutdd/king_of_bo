const addClass = (element, className) => {
	!element.classList.contains(className) &&
		element.classList.add(className);
}

export default addClass;