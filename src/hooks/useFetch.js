import { useState } from "react";

export const API_STATUS = {
	pending: 'pending',
	fetching: 'fetching',
	fulfilled: 'fulfilled',
	rejected: "rejected"
}

const useFetch = (callApiCallback) => {
	const [apiStatus, setApiStatus] = useState(API_STATUS.pending);
	const [data, setData] = useState({});
	const [error, setError] = useState({});

	const call = async (...params) => {
		try {
			if (apiStatus === API_STATUS.fetching) {
				return;
			}
			setApiStatus(API_STATUS.fetching);
			const resp = await callApiCallback(...params);
			setApiStatus(API_STATUS.fulfilled);
			setData(resp);
		} catch (error) {
			setApiStatus(API_STATUS.rejected);
			setError(error);
		}
	}

	const arrayReturn = (new Array(4)).fill(() => { });
	arrayReturn[0] = call;
	arrayReturn[1] = apiStatus;
	arrayReturn[2] = data;
	arrayReturn[3] = error;

	return arrayReturn;
}

export default useFetch;