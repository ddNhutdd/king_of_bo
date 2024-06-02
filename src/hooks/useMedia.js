import { useState, useEffect } from 'react';

export const widthDevice = {
	width_576: '(max-width: 576px)',
	width_768: '(max-width: 768px)',
	width_992: '(max-width: 992px)',
	width_1200: '(max-width: 1200px)',
	width_1400: '(max-width: 1400px)',
};

const useMediaQuery = () => {
	const [device, setDevice] = useState('unknown');

	useEffect(() => {
		const checkMediaQuery = () => {
			if (window.matchMedia(widthDevice.width_576).matches) {
				setDevice(widthDevice.width_576);
			} else if (window.matchMedia(widthDevice.width_768).matches) {
				setDevice(widthDevice.width_768);
			} else if (window.matchMedia(widthDevice.width_968).matches) {
				setDevice(widthDevice.width_968);
			} else if (window.matchMedia(widthDevice.width_992).matches) {
				setDevice(widthDevice.width_992);
			} else if (window.matchMedia(widthDevice.width_1200).matches) {
				setDevice(widthDevice.width_1200);
			} else if (window.matchMedia(widthDevice.width_1400).matches) {
				setDevice(widthDevice.width_1400);
			} else {
				setDevice('unknown');
			}
		};

		checkMediaQuery();
		window.addEventListener('resize', checkMediaQuery);
	}, []);

	return device;
};

export default useMediaQuery;