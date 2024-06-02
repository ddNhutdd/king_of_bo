import React from 'react';

function AlertCustom(props) {
	const {
		children,
		className
	} = props;
	return (
		<div className={`alert-custom ${className}`}>
			{children}
		</div>
	)
}

export default AlertCustom;